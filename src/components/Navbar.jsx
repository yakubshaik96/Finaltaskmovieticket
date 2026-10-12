import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cities } from "../data/cinema"
import { useAuth } from "../context/AuthContext"
import { useCity } from "../hooks/useCity"
import Logo from "./Logo"

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [city, setCity] = useCity()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [query, setQuery] = useState("")
  const cityRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const close = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) setCityOpen(false)
      if (userRef.current && !userRef.current.contains(event.target)) setUserOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const solid = pathname !== "/" || scrolled || open
  const closeMenu = () => setOpen(false)

  const search = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/movies?q=${encodeURIComponent(trimmed)}` : "/movies")
    closeMenu()
  }

  const itemClass = (active) =>
    `text-sm font-medium transition ${active ? "text-gold" : "text-white/75 hover:text-white"}`

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 transition ${
        solid ? "border-b border-white/10 bg-ink/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Logo />
        <nav className="ml-4 hidden items-center gap-6 lg:flex">
          <Link to="/" className={itemClass(pathname === "/")}>
            Home
          </Link>
          <Link to="/movies" className={itemClass(pathname.startsWith("/movie"))}>
            Movies
          </Link>
          <Link to="/tickets" className={itemClass(pathname === "/tickets")}>
            My Tickets
          </Link>
        </nav>

        <form onSubmit={search} className="ml-auto hidden items-center rounded-full border border-white/10 bg-black/30 px-3 lg:flex">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies"
            aria-label="Search movies"
            className="w-36 bg-transparent py-2 text-sm outline-none placeholder:text-white/40 xl:w-52"
          />
          <button type="submit" aria-label="Search" className="text-white/70 hover:text-gold">
            <SearchIcon />
          </button>
        </form>

        <div className="relative ml-auto lg:ml-3" ref={cityRef}>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm sm:flex"
            aria-expanded={cityOpen}
            onClick={() => setCityOpen((value) => !value)}
          >
            <PinIcon />
            {city}
          </button>
          {cityOpen && (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-ink-2 shadow-2xl">
              {cities.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 ${
                    item === city ? "text-gold" : ""
                  }`}
                  onClick={() => {
                    setCity(item)
                    setCityOpen(false)
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className="relative" ref={userRef}>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-gold font-semibold text-ink"
              aria-label="Account menu"
              aria-expanded={userOpen}
              onClick={() => setUserOpen((value) => !value)}
            >
              {initials(user.name)}
            </button>
            {userOpen && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-ink-2 p-2 shadow-2xl">
                <p className="px-3 py-2 text-sm">
                  <span className="block font-semibold">{user.name}</span>
                  <span className="block truncate text-white/50">{user.email}</span>
                </p>
                <Link to="/tickets" className="block rounded-xl px-3 py-2 text-sm hover:bg-white/5" onClick={() => setUserOpen(false)}>
                  My tickets
                </Link>
                <button
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/5"
                  onClick={() => {
                    logout()
                    setUserOpen(false)
                    navigate("/")
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-gold hidden px-4 py-2.5 text-sm sm:inline-flex">
            Sign in
          </Link>
        )}

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink px-4 py-4 lg:hidden">
          <form onSubmit={search} className="mb-4 flex items-center rounded-full border border-white/10 bg-white/5 px-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies"
              aria-label="Search movies"
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>
          <div className="mb-4 flex gap-2 overflow-x-auto sm:hidden">
            {cities.map((item) => (
              <button
                key={item}
                type="button"
                data-on={item === city}
                className="btn-line shrink-0 !py-2 text-xs"
                onClick={() => setCity(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-1">
            <Link to="/" className="rounded-xl px-3 py-3 hover:bg-white/5" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/movies" className="rounded-xl px-3 py-3 hover:bg-white/5" onClick={closeMenu}>
              Movies
            </Link>
            <Link to="/tickets" className="rounded-xl px-3 py-3 hover:bg-white/5" onClick={closeMenu}>
              My Tickets
            </Link>
            {!user && (
              <Link to="/login" className="btn-gold mt-2" onClick={closeMenu}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  )
}
