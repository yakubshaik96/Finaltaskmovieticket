import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cities } from "../data/cinema"
import { useCity } from "../hooks/useCity"
import Logo from "./Logo"

const year = new Date().getFullYear()

export default function Footer({ className = "" }) {
  const [city, setCity] = useCity()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const subscribe = (event) => {
    event.preventDefault()
    if (!email.includes("@")) {
      setError("Enter a valid email to get show alerts.")
      return
    }
    setError("")
    setDone(true)
  }

  return (
    <footer className={`no-print border-t border-white/10 bg-ink-2 ${className}`}>
      <div className="grid gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-10">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
            Big screens, honest seats, and tickets that stay on your phone. Lumina is a cinema desk for the movies you actually want to see.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.25em] text-white/40">CITIES</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {cities.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCity(item)
                  navigate("/")
                }}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  item === city ? "bg-gold text-ink" : "bg-white/5 text-white/75 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[0.25em] text-white/40">SHOW ALERTS</p>
          {done ? (
            <p className="mt-4 text-sm text-mint">You are on the list. We will send new releases for {city}.</p>
          ) : (
            <form onSubmit={subscribe} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                className="field"
              />
              <button type="submit" className="btn-gold shrink-0">
                Join
              </button>
            </form>
          )}
          {error && <p className="mt-2 text-sm text-rose">{error}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-white/10 px-4 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>© {year} Lumina Cinemas. Demo booking, no real charges.</p>
        <p>Seats update in this browser only.</p>
      </div>
    </footer>
  )
}
