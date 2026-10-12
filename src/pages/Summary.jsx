import { useRef, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import Stepper from "../components/Stepper"
import { useAuth } from "../context/AuthContext"
import { useBooking } from "../context/BookingContext"
import { getTheatre } from "../data/cinema"
import { getMovie } from "../data/movies"
import { formatShowDate, inr, priceBreakdown } from "../lib/format"
import { useTitle } from "../hooks/useTitle"

const METHODS = [
  { id: "UPI", note: "GPay, PhonePe, Paytm" },
  { id: "Card", note: "Visa, Mastercard, RuPay" },
  { id: "Net banking", note: "All major banks" },
]

export default function Summary() {
  useTitle("Ticket summary")
  const navigate = useNavigate()
  const { user } = useAuth()
  const { draft, confirmBooking } = useBooking()
  const [payment, setPayment] = useState("UPI")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const submitting = useRef(false)

  if (!draft?.seats?.length) {
    if (!done) {
      return <Navigate to={draft?.movieId ? `/movie/${draft.movieId}/seats` : "/movies"} replace />
    }
    return null
  }

  const movie = getMovie(draft.movieId)
  const theatre = getTheatre(draft.theatreId)
  const totals = priceBreakdown(draft.seats)

  const pay = () => {
    if (!user) {
      navigate("/login", { state: { from: "/summary" } })
      return
    }
    if (submitting.current) return
    submitting.current = true
    setError("")
    setBusy(true)
    window.setTimeout(() => {
      const result = confirmBooking(user, payment)
      if (!result.ok) {
        submitting.current = false
        setBusy(false)
        setError(result.message)
        return
      }
      setDone(true)
      navigate(`/confirmation/${result.booking.id}`)
    }, 700)
  }

  return (
    <div className="px-4 py-8 pb-16 sm:px-6 lg:px-10">
      <Stepper current={2} />
      <h1 className="mt-6 font-display text-6xl tracking-wide">Summary</h1>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.3fr_0.8fr]">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-panel">
          <div className="grid gap-5 p-4 sm:grid-cols-[160px_1fr] sm:p-6">
            <img src={movie?.poster} alt="" className="h-60 w-full rounded-2xl object-cover sm:h-full" />
            <div>
              <p className="text-xs tracking-[0.28em] text-gold">YOUR SHOW</p>
              <h2 className="font-display text-5xl tracking-wide">{movie?.title}</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Row label="Date" value={formatShowDate(draft.date)} />
                <Row label="Show" value={`${draft.time} · ${draft.format}`} />
                <Row label="Theatre" value={`${theatre?.name}, ${draft.city}`} />
                <Row label="Screen" value={`${draft.screen} · ${draft.language}`} />
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {draft.seats.map((seat) => (
                  <span key={seat.id} className="rounded-full bg-gold px-3 py-1 text-sm font-semibold text-ink">
                    {seat.id}
                  </span>
                ))}
              </div>
              <Link to={`/movie/${draft.movieId}/seats`} className="mt-4 inline-block text-sm text-white/55 hover:text-gold">
                Edit seats
              </Link>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-white/10 bg-ink-2 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Payment</h2>
          <div className="mt-4 grid gap-2">
            {METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPayment(method.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  payment === method.id ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/30"
                }`}
              >
                <span className="block font-semibold">{method.id}</span>
                <span className="text-sm text-white/50">{method.note}</span>
              </button>
            ))}
          </div>
          <dl className="mt-6 space-y-2 text-sm">
            <Money label={`Tickets (${draft.seats.length})`} value={totals.subtotal} />
            <Money label="Convenience fee" value={totals.convenience} />
            <Money label="GST on fee" value={totals.gst} />
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="text-gold">{inr(totals.total)}</dd>
            </div>
          </dl>
          {error && <p className="mt-4 text-sm text-rose">{error}</p>}
          {user ? (
            <button type="button" className="btn-gold mt-5 w-full" disabled={busy} onClick={pay}>
              {busy ? "Confirming…" : `Pay ${inr(totals.total)}`}
            </button>
          ) : (
            <button type="button" className="btn-gold mt-5 w-full" onClick={pay}>
              Sign in to pay
            </button>
          )}
          <p className="mt-3 text-center text-xs text-white/40">Demo checkout. Nothing is charged.</p>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.16em] text-white/40">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  )
}

function Money({ label, value }) {
  return (
    <div className="flex items-center justify-between text-white/70">
      <dt>{label}</dt>
      <dd>{inr(value)}</dd>
    </div>
  )
}
