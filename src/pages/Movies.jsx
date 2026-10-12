import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import MovieCard from "../components/MovieCard"
import { genres, languages, movies } from "../data/movies"
import { useSaved } from "../hooks/useSaved"
import { useTitle } from "../hooks/useTitle"

export default function Movies() {
  useTitle("Movies")
  const [params, setParams] = useSearchParams()
  const { ids } = useSaved()
  const q = params.get("q") || ""
  const genre = params.get("genre") || "All"
  const language = params.get("language") || "All"
  const sort = params.get("sort") || "featured"
  const savedOnly = params.get("saved") === "1"
  const status = params.get("status") || "all"

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === "All" || value === "all" || value === "featured" || value === "0") next.delete(key)
      else next.set(key, value)
    })
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    const filtered = movies.filter((movie) => {
      const haystack = `${movie.title} ${movie.director} ${movie.cast.join(" ")} ${movie.genres.join(" ")}`.toLowerCase()
      const matchesQuery = !query || haystack.includes(query)
      const matchesGenre = genre === "All" || movie.genres.includes(genre)
      const matchesLanguage = language === "All" || movie.languages.includes(language)
      const matchesSaved = !savedOnly || ids.includes(movie.id)
      const matchesStatus = status === "all" || movie.status === status
      return matchesQuery && matchesGenre && matchesLanguage && matchesSaved && matchesStatus
    })
    const sorted = [...filtered]
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating)
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title))
    if (sort === "newest") sorted.sort((a, b) => b.year - a.year)
    return sorted
  }, [q, genre, language, sort, savedOnly, status, ids])

  const clear = () => setParams({}, { replace: true })
  const filtering = Boolean(q || genre !== "All" || language !== "All" || savedOnly || status !== "all" || sort !== "featured")

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.28em] text-gold">ALL FILMS</p>
          <h1 className="font-display text-6xl tracking-wide">Movies</h1>
        </div>
        <p className="text-sm text-white/55">
          {results.length} title{results.length === 1 ? "" : "s"}
        </p>
      </div>

      <div role="tablist" aria-label="Availability" className="mt-6 flex gap-2">
        {[
          ["all", "All"],
          ["now-showing", "Now showing"],
          ["coming-soon", "Coming soon"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={status === value}
            data-on={status === value}
            className="btn-line !py-2 text-xs"
            onClick={() => update({ status: value })}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="sticky top-16 z-30 -mx-4 mt-4 border-y border-white/10 bg-ink/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={q}
            onChange={(event) => update({ q: event.target.value })}
            placeholder="Search title, cast, or director"
            aria-label="Search movies"
            className="field lg:max-w-sm"
          />
          <select
            value={language}
            aria-label="Filter by language"
            onChange={(event) => update({ language: event.target.value })}
            className="field lg:w-44"
          >
            <option value="All">All languages</option>
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={sort}
            aria-label="Sort movies"
            onChange={(event) => update({ sort: event.target.value })}
            className="field lg:w-44"
          >
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
            <option value="title">A to Z</option>
          </select>
          <button type="button" data-on={savedOnly} className="btn-line" onClick={() => update({ saved: savedOnly ? "0" : "1" })}>
            Saved {ids.length ? `(${ids.length})` : ""}
          </button>
          {filtering && (
            <button type="button" className="text-sm text-white/60 hover:text-white" onClick={clear}>
              Clear
            </button>
          )}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", ...genres].map((item) => (
            <button
              key={item}
              type="button"
              data-on={genre === item}
              className="btn-line shrink-0 !py-2 text-xs"
              onClick={() => update({ genre: item })}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mx-auto max-w-lg py-24 text-center">
          <p className="font-display text-5xl tracking-wide">No matches</p>
          <p className="mt-3 text-white/60">Try another title, language, or genre. Saved films live under the heart icon.</p>
          <button type="button" className="btn-gold mt-6" onClick={clear}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((movie, index) => (
            <div key={movie.id} className="animate-rise" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
