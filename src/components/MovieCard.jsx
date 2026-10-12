import { useState } from "react"
import { Link } from "react-router-dom"
import { formatShowDate } from "../lib/format"
import { useSaved } from "../hooks/useSaved"

export default function MovieCard({ movie }) {
  const { has, toggle } = useSaved()
  const saved = has(movie.id)
  const [failed, setFailed] = useState(false)

  return (
    <article className="lift group relative">
      <div className="shine relative overflow-hidden rounded-2xl bg-panel">
        {failed || !movie.poster ? (
          <div className="grid aspect-[2/3] place-items-center bg-gradient-to-br from-zinc-800 to-black p-4 text-center font-display text-3xl tracking-wide">
            {movie.title}
          </div>
        ) : (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            className="aspect-[2/3] w-full object-cover transition duration-700 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20 opacity-80" />
        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-gold backdrop-blur">
          {movie.status === "coming-soon" ? "Coming soon" : `★ ${movie.rating.toFixed(1)}`}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink">
            {movie.status === "coming-soon" ? "View details" : "Book now"}
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-label={saved ? `Remove ${movie.title} from saved` : `Save ${movie.title}`}
        aria-pressed={saved}
        onClick={() => toggle(movie.id)}
        className={`absolute right-3 top-3 z-30 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
          saved ? "bg-rose text-white" : "bg-black/55 text-white hover:bg-black/80"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
          <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
        </svg>
      </button>
      <div className="px-1 pt-3">
        <h3 className="truncate text-base font-semibold">{movie.title}</h3>
        <p className="mt-1 truncate text-sm text-white/55">
          {movie.status === "coming-soon" && movie.releaseDate
            ? `Releases ${formatShowDate(movie.releaseDate)}`
            : `${movie.certificate} · ${movie.languages.slice(0, 2).join(", ")} · ${movie.genres[0]}`}
        </p>
      </div>
      <Link to={`/movie/${movie.id}`} className="absolute inset-0 z-10" aria-label={`View ${movie.title}`} />
    </article>
  )
}
