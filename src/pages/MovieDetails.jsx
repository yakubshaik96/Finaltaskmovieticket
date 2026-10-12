import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Stepper from "../components/Stepper"
import { useBooking } from "../context/BookingContext"
import { screenFor, showsFor, theatres } from "../data/cinema"
import { getMovie, isBookable } from "../data/movies"
import { useCity } from "../hooks/useCity"
import { formatShowDate, upcomingDates } from "../lib/format"
import { useTitle } from "../hooks/useTitle"
import NotFound from "./NotFound"

export default function MovieDetails() {
  const { id } = useParams()
  const movie = getMovie(id)
  useTitle(movie ? movie.title : "Not found")
  const navigate = useNavigate()
  const { setDraft } = useBooking()
  const [city] = useCity()
  const dates = useMemo(() => upcomingDates(6), [])
  const [date, setDate] = useState(dates[0].iso)
  const [theatreId, setTheatreId] = useState(theatres[0].id)
  const [language, setLanguage] = useState("All")
  const [showKey, setShowKey] = useState("")

  const shows = useMemo(() => {
    if (!isBookable(movie)) return []
    return showsFor(movie, theatreId).filter((show) => language === "All" || show.language === language)
  }, [movie, theatreId, language])

  if (!movie) return <NotFound />

  const bookable = isBookable(movie)
  const selected = shows.find((show) => showId(show) === showKey)
  const theatre = theatres.find((item) => item.id === theatreId)

  const continueBooking = () => {
    if (!bookable || !selected || !theatre) return
    setDraft({
      movieId: movie.id,
      theatreId: theatre.id,
      city,
      date,
      time: selected.time,
      format: selected.format,
      language: selected.language,
      screen: screenFor(movie.id, theatre.id),
      seats: [],
    })
    navigate(`/movie/${movie.id}/seats`)
  }

  return (
    <div className="pb-28">
      <section className="relative -mt-16 min-h-[78vh] overflow-hidden">
        {movie.backdrop ? (
          <img src={movie.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-ink-2 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />
        <div className="relative flex min-h-[78vh] items-end px-4 pb-10 pt-28 sm:px-6 lg:px-10">
          <div className="grid w-full items-end gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={`${movie.title} poster`}
                className="w-36 rounded-2xl shadow-2xl sm:w-44 md:w-full"
              />
            ) : (
              <div className="grid aspect-[2/3] w-36 place-items-center rounded-2xl bg-gradient-to-br from-zinc-800 to-black p-4 text-center font-display text-3xl tracking-wide shadow-2xl sm:w-44 md:w-full">
                {movie.title}
              </div>
            )}
            <div className="animate-rise">
              <Stepper current={0} />
              <p className="mt-5 text-xs tracking-[0.28em] text-gold">{movie.certificate} · {movie.year}</p>
              <h1 className="font-display text-6xl leading-[0.9] tracking-wide sm:text-7xl">{movie.title}</h1>
              <p className="mt-3 text-white/75">{movie.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/70">
                {bookable ? (
                  <>
                    <span className="rounded-md bg-gold px-2 py-1 font-semibold text-ink">★ {movie.rating.toFixed(1)}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{movie.votes} votes</span>
                  </>
                ) : (
                  <span className="rounded-md bg-gold px-2 py-1 font-semibold text-ink">
                    Releases {movie.releaseDate ? formatShowDate(movie.releaseDate) : "soon"}
                  </span>
                )}
                <span className="rounded-full bg-white/10 px-3 py-1">{movie.duration}</span>
                {movie.genres.map((genre) => (
                  <Link key={genre} to={`/movies?genre=${encodeURIComponent(genre)}`} className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">
                    {genre}
                  </Link>
                ))}
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{movie.description}</p>
              <p className="mt-4 text-sm text-white/60">
                Directed by <span className="text-white">{movie.director}</span>
              </p>
              {movie.trailer && (
                <a href={movie.trailer} target="_blank" rel="noreferrer" className="btn-ghost mt-6">
                  Watch trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <h2 className="font-display text-4xl tracking-wide">Cast</h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {movie.cast.map((person) => (
            <div key={person} className="flex w-40 shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-panel p-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold font-semibold text-ink">
                {person[0]}
              </span>
              <span className="text-sm">{person}</span>
            </div>
          ))}
        </div>
      </section>

      {!bookable && (
        <section className="px-4 pb-10 sm:px-6 lg:px-10" id="showtimes">
          <div className="rounded-3xl border border-white/10 bg-panel p-6 text-center sm:p-10">
            <p className="text-xs tracking-[0.28em] text-gold">COMING SOON</p>
            <h2 className="mt-2 font-display text-5xl tracking-wide">Tickets are not on sale yet</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/65">
              Showtimes for {movie.title} open closer to release. This is a demo listing, so it cannot be booked.
            </p>
            <Link to="/movies?status=now-showing" className="btn-gold mt-6">
              Browse films you can book
            </Link>
          </div>
        </section>
      )}

      {bookable && (
      <section className="px-4 pb-10 sm:px-6 lg:px-10" id="showtimes">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.28em] text-gold">{city.toUpperCase()}</p>
            <h2 className="font-display text-5xl tracking-wide">Pick a show</h2>
          </div>
          <div className="flex gap-2">
            {["All", ...movie.languages].map((item) => (
              <button
                key={item}
                type="button"
                data-on={language === item}
                className="btn-line !py-2 text-xs"
                onClick={() => {
                  setLanguage(item)
                  setShowKey("")
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {dates.map((item) => (
            <button
              key={item.iso}
              type="button"
              onClick={() => {
                setDate(item.iso)
                setShowKey("")
              }}
              className={`min-w-20 rounded-2xl border px-3 py-3 text-center transition ${
                date === item.iso ? "border-gold bg-gold text-ink" : "border-white/10 bg-white/5 hover:border-gold/50"
              }`}
            >
              <span className="block text-[11px] uppercase tracking-wide opacity-70">{item.label}</span>
              <span className="block text-2xl font-semibold">{item.date}</span>
              <span className="block text-xs">{item.month}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          {theatres.map((item) => {
            const active = item.id === theatreId
            const itemShows = active ? shows : showsFor(movie, item.id)
            return (
              <article
                key={item.id}
                className={`rounded-3xl border p-4 transition sm:p-5 ${
                  active ? "border-gold/70 bg-white/[0.04]" : "border-white/10 bg-panel"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
                  onClick={() => {
                    setTheatreId(item.id)
                    setShowKey("")
                  }}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-white/55">
                      {item.area}, {city} · {screenFor(movie.id, item.id)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.amenities.map((amenity) => (
                      <span key={amenity} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </button>
                {active && (
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {itemShows.map((show, index) => {
                      const on = showId(show) === showKey
                      return (
                        <button
                          key={showId(show)}
                          type="button"
                          onClick={() => setShowKey(showId(show))}
                          className={`rounded-2xl border px-3 py-3 text-left transition ${
                            on ? "border-gold bg-gold text-ink" : "border-white/10 bg-black/30 hover:-translate-y-0.5 hover:border-gold/60"
                          }`}
                        >
                          <span className="block font-semibold">{show.time}</span>
                          <span className={`mt-1 block text-[11px] uppercase tracking-wide ${on ? "text-ink/70" : "text-white/50"}`}>
                            {show.format} · {show.language}
                          </span>
                          {index >= itemShows.length - 2 && (
                            <span className={`mt-1 block text-[11px] ${on ? "text-ink/70" : "text-rose"}`}>Filling fast</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
      )}

      {bookable && (
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {selected ? `${theatre.name} · ${selected.time}` : "Select a theatre and showtime"}
            </p>
            <p className="truncate text-xs text-white/50">
              {selected ? `${selected.format} · ${selected.language} · ${city}` : "Classic seats from ₹190"}
            </p>
          </div>
          <button type="button" className="btn-gold shrink-0" disabled={!selected} onClick={continueBooking}>
            Select seats
          </button>
        </div>
      </div>
      )}
    </div>
  )
}

function showId(show) {
  return `${show.time}|${show.format}|${show.language}`
}
