import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const INTERVAL = 5500

export default function Hero({ movies }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const movie = movies[index]

  useEffect(() => {
    if (paused || movies.length < 2) return undefined
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % movies.length)
    }, INTERVAL)
    return () => window.clearInterval(id)
  }, [paused, movies.length])

  const go = (direction) => {
    setIndex((current) => (current + direction + movies.length) % movies.length)
  }

  return (
    <section
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {movies.map((item, itemIndex) => (
        <img
          key={item.id}
          src={item.backdrop}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            itemIndex === index ? "opacity-100 animate-ken" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />

      <div className="relative z-10 flex h-full items-end px-4 pb-16 sm:px-6 lg:px-10">
        <div key={movie.id} className="animate-rise max-w-3xl">
          <p className="mb-3 text-xs font-semibold tracking-[0.35em] text-gold">NOW SHOWING</p>
          <h1 className="font-display text-6xl leading-[0.9] tracking-wide sm:text-7xl lg:text-8xl">
            {movie.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/75 sm:text-base">{movie.tagline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span className="rounded-md bg-gold px-2 py-1 font-semibold text-ink">★ {movie.rating.toFixed(1)}</span>
            <span>{movie.duration}</span>
            <span className="text-white/30">•</span>
            <span>{movie.certificate}</span>
            <span className="text-white/30">•</span>
            <span>{movie.languages.slice(0, 2).join(", ")}</span>
            <span className="text-white/30">•</span>
            <span>{movie.genres.join(" / ")}</span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={`/movie/${movie.id}`} className="btn-gold">
              Book tickets
            </Link>
            <a href={movie.trailer} target="_blank" rel="noreferrer" className="btn-ghost">
              <PlayIcon />
              Trailer
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 z-10 flex items-center gap-2 sm:right-8">
        <button type="button" className="btn-ghost !px-3 !py-3" aria-label="Previous movie" onClick={() => go(-1)}>
          ‹
        </button>
        <button
          type="button"
          className="btn-ghost !px-3 !py-3"
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "▶" : "❚❚"}
        </button>
        <button type="button" className="btn-ghost !px-3 !py-3" aria-label="Next movie" onClick={() => go(1)}>
          ›
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex h-1 bg-white/10">
        {movies.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.title}`}
            onClick={() => setIndex(itemIndex)}
            className="relative h-full flex-1 overflow-hidden"
          >
            {itemIndex === index && (
              <span
                key={`${index}-${paused}`}
                className="animate-load absolute inset-y-0 left-0 w-full bg-gold"
                style={{ animationPlayState: paused ? "paused" : "running" }}
              />
            )}
            {itemIndex < index && <span className="absolute inset-0 bg-gold/70" />}
          </button>
        ))}
      </div>
    </section>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  )
}
