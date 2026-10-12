import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import SeatMap from "../components/SeatMap"
import Stepper from "../components/Stepper"
import { useBooking } from "../context/BookingContext"
import { allSeatIds, getTheatre } from "../data/cinema"
import { getMovie } from "../data/movies"
import { formatShowDate, inr, priceBreakdown } from "../lib/format"
import { useTitle } from "../hooks/useTitle"

const MAX_SEATS = 8

export default function Seats() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { draft, setDraft, getTaken } = useBooking()
  const movie = getMovie(id)
  useTitle(movie ? `Seats · ${movie.title}` : "Seats")
  const [notice, setNotice] = useState("")

  const ready = Boolean(draft && draft.movieId === id && draft.time)
  const taken = ready ? getTaken(draft) : new Set()
  const selected = ready ? draft.seats : []
  const totals = priceBreakdown(selected)

  useEffect(() => {
    if (!ready) navigate(movie ? `/movie/${id}` : "/movies", { replace: true })
  }, [ready, movie, id, navigate])

  if (!ready || !movie) return null

  const theatre = getTheatre(draft.theatreId)

  const toggle = (seat) => {
    setNotice("")
    const exists = selected.some((item) => item.id === seat.id)
    if (exists) {
      setDraft({ ...draft, seats: selected.filter((item) => item.id !== seat.id) })
      return
    }
    if (selected.length >= MAX_SEATS) {
      setNotice(`You can book up to ${MAX_SEATS} seats at a time.`)
      return
    }
    setDraft({ ...draft, seats: [...selected, seat] })
  }

  return (
    <div className="px-4 py-8 pb-32 sm:px-6 lg:px-10">
      <Stepper current={1} />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.28em] text-gold">{theatre?.name}</p>
          <h1 className="font-display text-5xl tracking-wide sm:text-6xl">{movie.title}</h1>
          <p className="mt-2 text-sm text-white/60">
            {formatShowDate(draft.date)} · {draft.time} · {draft.format} · {draft.language} · {draft.screen}
          </p>
        </div>
        <Link to={`/movie/${movie.id}`} className="text-sm text-white/60 hover:text-gold">
          Change showtime
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/70">
        <Legend className="bg-[#343b4e]" label="Classic" />
        <Legend className="bg-[#6d572c]" label="Premium" />
        <Legend className="bg-[#6d3550]" label="Recliner" />
        <Legend className="bg-gold" label="Selected" />
        <Legend className="border border-white/15 bg-[#12141c]" label="Booked" />
      </div>
      <p className="mt-3 text-sm text-white/50">
        {allSeatIds().length - taken.size} seats open · {taken.size} already booked
      </p>
      {notice && <p className="mt-3 text-sm text-rose">{notice}</p>}

      <div className="mt-8 rounded-3xl border border-white/10 bg-panel/80 px-2 py-8 sm:px-6">
        <SeatMap taken={taken} selected={selected} onToggle={toggle} />
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">
              {selected.length ? selected.map((seat) => seat.id).join(", ") : "No seats selected"}
            </p>
            <p className="text-sm text-gold">{selected.length ? inr(totals.total) : "Includes fees at checkout"}</p>
          </div>
          <button
            type="button"
            className="btn-gold"
            disabled={!selected.length}
            onClick={() => navigate("/summary")}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

function Legend({ className, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-4 w-4 rounded-t rounded-b-sm ${className}`} />
      {label}
    </span>
  )
}
