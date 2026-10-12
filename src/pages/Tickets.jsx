import { Link } from "react-router-dom"
import TicketCard from "../components/TicketCard"
import { useAuth } from "../context/AuthContext"
import { useBooking } from "../context/BookingContext"
import { useTitle } from "../hooks/useTitle"

export default function Tickets() {
  useTitle("My tickets")
  const { user } = useAuth()
  const { bookings } = useBooking()
  const mine = user ? bookings.filter((booking) => booking.email === user.email) : []

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <p className="text-xs tracking-[0.28em] text-gold">BOOKINGS</p>
      <h1 className="font-display text-6xl tracking-wide">My tickets</h1>
      {!user ? (
        <div className="mt-10 max-w-lg">
          <p className="text-white/70">Sign in to see the shows saved on this browser.</p>
          <Link to="/login" state={{ from: "/tickets" }} className="btn-gold mt-6">
            Sign in
          </Link>
        </div>
      ) : mine.length === 0 ? (
        <div className="mt-10 max-w-lg">
          <p className="text-white/70">No tickets yet, {user.name.split(" ")[0]}. The next show is a few taps away.</p>
          <Link to="/movies" className="btn-gold mt-6">
            Find a movie
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          {mine.map((booking) => (
            <TicketCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}
