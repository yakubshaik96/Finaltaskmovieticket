import { Link } from "react-router-dom"
import Hero from "../components/Hero"
import MovieCard from "../components/MovieCard"
import { theatres } from "../data/cinema"
import { comingSoon, genres, movies, nowShowing } from "../data/movies"
import { useCity } from "../hooks/useCity"
import { useTitle } from "../hooks/useTitle"

const MARQUEE = [
  "IMAX",
  "DOLBY ATMOS",
  "4DX",
  "VIP RECLINERS",
  "4K LASER",
  "INSTANT E-TICKETS",
  "NOW SHOWING",
]

const EXPERIENCES = [
  {
    title: "IMAX",
    copy: "A screen tall enough to make the desert, the ocean, and Gotham feel close.",
    image: movies[0].backdrop,
  },
  {
    title: "Dolby Atmos",
    copy: "Sound moves over the seats, not just from the front of the room.",
    image: movies[3].backdrop,
  },
  {
    title: "VIP Recliners",
    copy: "More legroom, warmer light, and a slower walk to your seat.",
    image: movies[6].backdrop,
  },
]

export default function Home() {
  useTitle("")
  const [city] = useCity()
  const featured = movies.filter((movie) => movie.featured)
  const topRated = [...nowShowing].sort((a, b) => b.rating - a.rating).slice(0, 8)

  return (
    <div>
      <Hero movies={featured} />

      <div className="w-full overflow-hidden border-y border-white/10 bg-ink-2">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8 px-4 py-3">
              {MARQUEE.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center gap-8 text-xs tracking-[0.28em] text-white/70">
                  {item}
                  <span className="text-gold">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-2 border-b border-white/10 sm:grid-cols-4">
        {[
          ["120+", "Screens"],
          ["6", "Cities"],
          [String(nowShowing.length), "Films now showing"],
          ["₹190", "Classic seats from"],
        ].map(([value, label]) => (
          <div key={label} className="px-4 py-6 sm:px-6 lg:px-10">
            <p className="font-display text-4xl tracking-wide text-gold">{value}</p>
            <p className="text-sm text-white/55">{label}</p>
          </div>
        ))}
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] text-gold">IN {city.toUpperCase()}</p>
            <h2 className="font-display text-5xl tracking-wide">Now showing</h2>
          </div>
          <Link to="/movies?status=now-showing" className="text-sm text-white/70 hover:text-gold">
            View all
          </Link>
        </div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {genres.map((genre) => (
            <Link key={genre} to={`/movies?genre=${encodeURIComponent(genre)}`} className="btn-line shrink-0 text-sm">
              {genre}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {nowShowing.slice(0, 5).map((movie, index) => (
            <div key={movie.id} className="animate-rise" style={{ animationDelay: `${index * 70}ms` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      <section className="relative min-h-[440px] overflow-hidden">
        <img src={movies[8].backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="relative flex min-h-[440px] flex-col justify-center px-4 py-16 sm:px-6 lg:px-10">
          <p className="text-xs tracking-[0.32em] text-gold">THIS WEEKEND</p>
          <h2 className="mt-2 max-w-xl font-display text-6xl leading-[0.9] tracking-wide sm:text-7xl">
            Recliners for the long ones
          </h2>
          <p className="mt-4 max-w-md text-white/75">
            Oppenheimer, Avatar, and Dune run past two and a half hours. Book a recliner and stay for the last frame.
          </p>
          <Link to="/movies" className="btn-gold mt-7 w-fit">
            Browse showtimes
          </Link>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] text-gold">DEMO LISTINGS</p>
            <h2 className="font-display text-5xl tracking-wide">Coming soon</h2>
          </div>
          <Link to="/movies?status=coming-soon" className="text-sm text-white/70 hover:text-gold">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {comingSoon.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-5xl tracking-wide">Top rated</h2>
          <Link to="/movies?sort=rating" className="text-sm text-white/70 hover:text-gold">
            Sort by rating
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {topRated.map((movie) => (
            <div key={movie.id} className="w-[46vw] shrink-0 sm:w-[220px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-10">
        <h2 className="mb-6 font-display text-5xl tracking-wide">Theatres in {city}</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {theatres.map((theatre, index) => (
            <Link
              key={theatre.id}
              to="/movies"
              className="lift group relative min-h-56 overflow-hidden rounded-3xl border border-white/10"
            >
              <img
                src={movies[index % movies.length].backdrop}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
              <div className="relative flex h-full min-h-56 flex-col justify-end p-5">
                <p className="text-xs tracking-[0.22em] text-gold">{theatre.area.toUpperCase()}</p>
                <h3 className="font-display text-4xl tracking-wide">{theatre.name}</h3>
                <p className="mt-2 text-sm text-white/70">{theatre.amenities.join(" · ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3">
        {EXPERIENCES.map((item) => (
          <Link key={item.title} to="/movies" className="group relative min-h-72 overflow-hidden">
            <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/55 transition group-hover:bg-black/40" />
            <div className="relative flex min-h-72 flex-col justify-end p-6 sm:p-8">
              <h3 className="font-display text-5xl tracking-wide">{item.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-white/75">{item.copy}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
