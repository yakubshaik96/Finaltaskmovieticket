import { createContext, useContext, useState } from "react"
import { presetBooked, seatKey } from "../data/cinema"
import { priceBreakdown } from "../lib/format"

const BookingContext = createContext(null)
const DRAFT_KEY = "lumina_draft"
const BOOKS_KEY = "lumina_bookings"
const TAKEN_KEY = "lumina_taken"

function readJson(storage, key, fallback) {
  try {
    return JSON.parse(storage.getItem(key) || "null") ?? fallback
  } catch {
    return fallback
  }
}

export function BookingProvider({ children }) {
  const [draft, setDraftState] = useState(() => readJson(sessionStorage, DRAFT_KEY, null))
  const [bookings, setBookings] = useState(() => readJson(localStorage, BOOKS_KEY, []))
  const setDraft = (value) => {
    if (value) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(value))
    else sessionStorage.removeItem(DRAFT_KEY)
    setDraftState(value)
  }

  const getTaken = (show) => {
    const key = seatKey(show)
    const stored = readJson(localStorage, TAKEN_KEY, {})
    const taken = presetBooked(key)
    for (const id of stored[key] || []) taken.add(id)
    return taken
  }

  const confirmBooking = (user, payment) => {
    if (!draft?.seats?.length || !user) {
      return { ok: false, message: "Choose seats before paying." }
    }
    const key = seatKey(draft)
    const stored = readJson(localStorage, TAKEN_KEY, {})
    const taken = presetBooked(key)
    for (const id of stored[key] || []) taken.add(id)
    if (draft.seats.some((seat) => taken.has(seat.id))) {
      return { ok: false, message: "Some of those seats were just booked. Pick again." }
    }
    const totals = priceBreakdown(draft.seats)
    const booking = {
      id: `LM${Date.now().toString(36).toUpperCase()}`,
      email: user.email,
      guest: user.name,
      ...draft,
      ...totals,
      payment,
      createdAt: new Date().toISOString(),
    }
    const nextBooks = [booking, ...bookings]
    const nextTaken = {
      ...stored,
      [key]: [...(stored[key] || []), ...draft.seats.map((seat) => seat.id)],
    }
    localStorage.setItem(BOOKS_KEY, JSON.stringify(nextBooks))
    localStorage.setItem(TAKEN_KEY, JSON.stringify(nextTaken))
    sessionStorage.removeItem(DRAFT_KEY)
    setBookings(nextBooks)
    setDraftState(null)
    return { ok: true, booking }
  }

  const getBooking = (id) => bookings.find((booking) => booking.id === id)

  return (
    <BookingContext.Provider
      value={{ draft, setDraft, bookings, confirmBooking, getBooking, getTaken }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const value = useContext(BookingContext)
  if (!value) throw new Error("useBooking must be used within BookingProvider")
  return value
}
