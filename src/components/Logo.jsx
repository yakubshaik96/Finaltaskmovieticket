import { Link } from "react-router-dom"

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Lumina home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold font-display text-2xl leading-none text-ink shadow-[0_0_24px_rgba(240,193,75,0.35)]">
        L
      </span>
      {!compact && (
        <span className="font-display text-[1.85rem] leading-none tracking-[0.14em]">LUMINA</span>
      )}
    </Link>
  )
}
