import { getMovie } from "../data/movies"
import { getTheatre } from "../data/cinema"
import { formatBookedAt, formatShowDate, inr } from "../lib/format"

export default function TicketCard({ booking }) {
  const movie = getMovie(booking.movieId)
  const theatre = getTheatre(booking.theatreId)

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[148px_1fr_auto] md:items-center">
        <img
          src={movie?.poster}
          alt=""
          className="h-52 w-full rounded-2xl object-cover md:h-44 md:w-[148px]"
        />
        <div>
          <p className="text-xs tracking-[0.28em] text-gold">LUMINA TICKET</p>
          <h2 className="mt-1 font-display text-4xl tracking-wide">{movie?.title}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <Item label="When" value={`${formatShowDate(booking.date)} · ${booking.time}`} />
            <Item
              label="Where"
              value={`${theatre?.name || "Theatre"}${booking.city ? `, ${booking.city}` : ""} · ${booking.screen}`}
            />
            <Item label="Format" value={`${booking.format} · ${booking.language}`} />
            <Item label="Seats" value={booking.seats.map((seat) => seat.id).join(", ")} />
            <Item label="Paid" value={inr(booking.total)} />
            <Item label="Guest" value={booking.guest} />
          </dl>
        </div>
        <TicketMark seed={booking.id} />
      </div>
      <div className="relative border-t border-dashed border-white/15 px-6 py-4">
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-ink" />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-ink" />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="font-semibold tracking-[0.18em]">{booking.id}</p>
          <p className="text-white/50">Booked {formatBookedAt(booking.createdAt)}</p>
        </div>
      </div>
    </article>
  )
}

function Item({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.16em] text-white/40">{label}</dt>
      <dd className="mt-1 text-white/90">{value}</dd>
    </div>
  )
}

function TicketMark({ seed }) {
  let hash = 7
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 33 + seed.charCodeAt(i)) % 997
  const cells = []
  for (let i = 0; i < 81; i += 1) {
    hash = (hash * 17 + i) % 997
    cells.push(hash % 3 !== 0)
  }
  return (
    <div className="grid w-fit grid-cols-9 gap-[3px] rounded-xl bg-white p-2" aria-hidden="true">
      {cells.map((on, index) => (
        <span key={index} className={`h-2.5 w-2.5 ${on ? "bg-ink" : "bg-transparent"}`} />
      ))}
    </div>
  )
}
