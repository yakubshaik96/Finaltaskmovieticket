import { Link } from "react-router-dom"
import { useTitle } from "../hooks/useTitle"

export default function NotFound() {
  useTitle("Not found")
  return (
    <div className="px-4 py-28 text-center">
      <p className="text-xs tracking-[0.3em] text-gold">404</p>
      <h1 className="mt-3 font-display text-7xl tracking-wide">This screen is dark</h1>
      <p className="mt-3 text-white/60">That page is not on tonight’s schedule.</p>
      <Link to="/" className="btn-gold mt-6">
        Back home
      </Link>
    </div>
  )
}
