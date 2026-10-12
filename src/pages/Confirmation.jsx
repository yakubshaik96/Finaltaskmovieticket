import { Link, useParams } from "react-router-dom"
import Stepper from "../components/Stepper"
import TicketCard from "../components/TicketCard"
import { useAuth } from "../context/AuthContext"
import { useBooking } from "../context/BookingContext"
import { useTitle } from "../hooks/useTitle"

export default function Confirmation() {
  const { id } = useParams()
  const { getBooking } = useBooking()
  const { user } = useAuth()
  const found = getBooking(id)
  const booking = found && user && found.email === user.email ? found : undefined
  useTitle(booking ? "Booking confirmed" : "Ticket")

  if (!booking) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="font-display text-6xl tracking-wide">Ticket not found</h1>
        <p className="mt-3 text-white/60">That booking is not saved in this browser.</p>
        <Link to="/movies" className="btn-gold mt-6">
          Browse movies
        </Link>
      </div>
    )
  }

  return (
    <div className="relative px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden no-print" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="confetti"
            style={{
              left: `${(index * 53) % 100}%`,
              animationDelay: `${index * 0.08}s`,
              background: index % 2 === 0 ? "#f0c14b" : "#ff4d6d",
            }}
          />
        ))}
      </div>
      <div className="no-print">
        <Stepper current={3} />
      </div>
      <div className="animate-pop mx-auto mt-8 max-w-4xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint/15 text-3xl text-mint">✓</div>
        <h1 className="mt-4 font-display text-6xl tracking-wide">You are booked</h1>
        <p className="mt-2 text-white/65">Show this ticket at the theatre. A copy also lives in My Tickets.</p>
      </div>
      <div className="mx-auto mt-8 max-w-4xl">
        <TicketCard booking={booking} />
      </div>
      <div className="no-print mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-3">
        <button type="button" className="btn-ghost" onClick={() => window.print()}>
          Print ticket
        </button>
        <Link to="/tickets" className="btn-gold">
          My tickets
        </Link>
      </div>
    </div>
  )
}
