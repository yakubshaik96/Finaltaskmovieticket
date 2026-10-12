import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import App from "../App"

const go = (path) => window.history.pushState({}, "", path)
const bookings = () => JSON.parse(localStorage.getItem("lumina_bookings") || "[]")

async function signUp(user, { name = "Test User", email = "test@example.com", password = "goodpass1" } = {}) {
  await user.type(await screen.findByLabelText("Name"), name)
  await user.type(screen.getByLabelText("Email"), email)
  await user.type(screen.getByLabelText("Password"), password)
  await user.type(screen.getByLabelText("Confirm password"), password)
  await user.click(screen.getByRole("button", { name: "Create account" }))
}

describe("auth", () => {
  it("shows field-level validation messages on sign up", async () => {
    go("/signup")
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole("button", { name: "Create account" }))
    expect(await screen.findByText("Enter your name.")).toBeInTheDocument()
    expect(screen.getByText("Enter your email address.")).toBeInTheDocument()
    expect(screen.getByText("Enter a password.")).toBeInTheDocument()
    expect(screen.getByText("Confirm your password.")).toBeInTheDocument()
  })

  it("rejects mismatched passwords and bad email formats", async () => {
    go("/signup")
    const user = userEvent.setup()
    render(<App />)
    await user.type(await screen.findByLabelText("Name"), "Test User")
    await user.type(screen.getByLabelText("Email"), "not-an-email")
    await user.type(screen.getByLabelText("Password"), "goodpass1")
    await user.type(screen.getByLabelText("Confirm password"), "different1")
    await user.click(screen.getByRole("button", { name: "Create account" }))
    expect(await screen.findByText(/valid email address/)).toBeInTheDocument()
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument()
  })

  it("toggles password visibility", async () => {
    go("/login")
    const user = userEvent.setup()
    render(<App />)
    const field = await screen.findByLabelText("Password")
    expect(field).toHaveAttribute("type", "password")
    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(field).toHaveAttribute("type", "text")
  })

  it("stores only a hash, then signs in with the right password and rejects the wrong one", async () => {
    go("/signup")
    const user = userEvent.setup()
    const first = render(<App />)
    await signUp(user)
    await waitFor(() => expect(localStorage.getItem("lumina_session")).toBeTruthy())
    const stored = localStorage.getItem("lumina_users")
    expect(stored).not.toContain("goodpass1")
    expect(JSON.parse(stored)[0]).not.toHaveProperty("password")
    first.unmount()

    localStorage.removeItem("lumina_session")
    go("/login")
    render(<App />)
    await user.type(await screen.findByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "wrongpass1")
    await user.click(screen.getByRole("button", { name: "Sign in" }))
    expect(await screen.findByText("Email or password is incorrect.")).toBeInTheDocument()

    await user.clear(screen.getByLabelText("Password"))
    await user.type(screen.getByLabelText("Password"), "goodpass1")
    await user.click(screen.getByRole("button", { name: "Sign in" }))
    await waitFor(() => expect(localStorage.getItem("lumina_session")).toBeTruthy())
  })

  it("upgrades a legacy plain-text account to a hash on first sign in", async () => {
    localStorage.setItem("lumina_users", JSON.stringify([{ name: "Old", email: "old@example.com", password: "legacy123" }]))
    go("/login")
    const user = userEvent.setup()
    render(<App />)
    await user.type(await screen.findByLabelText("Email"), "old@example.com")
    await user.type(screen.getByLabelText("Password"), "legacy123")
    await user.click(screen.getByRole("button", { name: "Sign in" }))
    await waitFor(() => expect(localStorage.getItem("lumina_session")).toBeTruthy())
    expect(localStorage.getItem("lumina_users")).not.toContain("legacy123")
  })
})

describe("routing", () => {
  it("shows a not-found state for an invalid movie id", async () => {
    go("/movie/not-a-real-movie")
    render(<App />)
    expect(await screen.findByText("This screen is dark")).toBeInTheDocument()
  })

  it("shows a 404 for unknown routes", async () => {
    go("/nowhere")
    render(<App />)
    expect(await screen.findByText("This screen is dark")).toBeInTheDocument()
  })

  it.each(["/summary", "/tickets", "/movie/oppenheimer/seats", "/confirmation/LMX"])(
    "redirects %s to sign in when signed out",
    async (path) => {
      go(path)
      render(<App />)
      expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument()
    },
  )
})

describe("movie listing", () => {
  it("shows an empty state for a search with no results and can reset it", async () => {
    go("/movies?q=zzzzzz")
    const user = userEvent.setup()
    render(<App />)
    expect(await screen.findByText("No matches")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Reset filters" }))
    expect(screen.queryByText("No matches")).not.toBeInTheDocument()
  })

  it("filters to coming-soon titles only", async () => {
    go("/movies?status=coming-soon")
    render(<App />)
    expect((await screen.findAllByText("Midnight Orchard")).length).toBeGreaterThan(0)
    expect(screen.queryAllByText("Oppenheimer")).toHaveLength(0)
  })

  it("combines availability and search filters", async () => {
    go("/movies?status=now-showing&q=oppenheimer")
    render(<App />)
    expect((await screen.findAllByText("Oppenheimer")).length).toBeGreaterThan(0)
    expect(screen.queryAllByText("Midnight Orchard")).toHaveLength(0)
    expect(screen.queryAllByText("Dune: Part Two")).toHaveLength(0)
  })

  it("combines genre and language filters", async () => {
    go("/movies?genre=Sci-Fi&language=Tamil")
    render(<App />)
    expect((await screen.findAllByText("Dune: Part Two")).length).toBeGreaterThan(0)
    expect(screen.queryAllByText("Midnight Orchard")).toHaveLength(0)
  })

  it("does not offer booking for a coming-soon title", async () => {
    go("/movie/midnight-orchard")
    render(<App />)
    expect(await screen.findByText("Tickets are not on sale yet")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Select seats" })).not.toBeInTheDocument()
  })
})

describe("full booking journey", () => {
  it("books seats end to end, persists the booking and blocks duplicate confirmation", async () => {
    const user = userEvent.setup()
    go("/movie/oppenheimer")
    const view = render(<App />)

    // Select seats is disabled until a show is chosen
    const selectSeats = await screen.findByRole("button", { name: "Select seats" })
    expect(selectSeats).toBeDisabled()
    const showtimes = document.getElementById("showtimes")
    const showButtons = within(showtimes).getAllByRole("button").filter((b) => /\d{2}:\d{2} (AM|PM)/.test(b.textContent))
    await user.click(showButtons[0])
    expect(selectSeats).toBeEnabled()
    await user.click(selectSeats)

    // Signed out: sent to sign up, then returned to the seat page
    await screen.findByRole("heading", { name: "Sign in" })
    await user.click(screen.getByRole("link", { name: "Create an account" }))
    await signUp(user)
    await screen.findByText("No seats selected")

    const continueBtn = screen.getByRole("button", { name: "Continue" })
    expect(continueBtn).toBeDisabled()

    // Booked seats cannot be selected
    const booked = screen.getAllByRole("button").filter((b) => /booked$/.test(b.getAttribute("aria-label") || ""))
    expect(booked.length).toBeGreaterThan(0)
    expect(booked[0]).toBeDisabled()

    // Select two seats, deselect one, reselect
    const free = screen.getAllByRole("button").filter((b) => /available$/.test(b.getAttribute("aria-label") || ""))
    const a = free.find((b) => b.getAttribute("aria-label").startsWith("G"))
    const b = free.find((b2) => b2.getAttribute("aria-label").startsWith("A"))
    await user.click(a)
    await user.click(b)
    expect(a).toHaveAttribute("aria-pressed", "true")
    expect(continueBtn).toBeEnabled()
    await user.click(a)
    expect(a).toHaveAttribute("aria-pressed", "false")
    await user.click(a)

    // 190 (classic) + 540 (recliner) + 2 x 32 fee + GST 12 = 806
    expect(screen.getByText("₹806")).toBeInTheDocument()

    await user.click(continueBtn)
    await screen.findByRole("heading", { name: "Summary" })
    expect(screen.getByText("₹806", { selector: "dd" })).toBeInTheDocument()

    // Refresh on the summary route keeps the draft (sessionStorage)
    view.unmount()
    render(<App />)
    const pay = await screen.findByRole("button", { name: /^Pay/ })

    // Double click must create exactly one booking
    await user.dblClick(pay)
    await waitFor(() => expect(window.location.pathname).toMatch(/^\/confirmation\/LM/), { timeout: 4000 })
    expect(bookings()).toHaveLength(1)
    expect(bookings()[0].total).toBe(806)
    expect(bookings()[0].seats).toHaveLength(2)
    expect(await screen.findByText("You are booked")).toBeInTheDocument()

    // Survives a refresh and appears under My tickets
    const ref = bookings()[0].id
    expect(screen.getByText(ref)).toBeInTheDocument()
    go("/tickets")
    render(<App />)
    expect((await screen.findAllByText(ref)).length).toBeGreaterThan(0)
  })
})
