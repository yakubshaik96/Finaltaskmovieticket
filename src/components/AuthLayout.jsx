import { Link } from "react-router-dom"
import Logo from "./Logo"

export default function AuthLayout({ image, quote, credit, children }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative h-52 sm:h-64 lg:h-auto">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-black/20 lg:bg-gradient-to-r lg:from-black/10 lg:via-ink/30 lg:to-ink" />
        <div className="absolute bottom-5 left-5 right-5 hidden lg:block">
          <p className="font-display text-5xl leading-none tracking-wide">{quote}</p>
          <p className="mt-3 text-sm text-white/70">{credit}</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-5 py-10 sm:px-12 lg:px-16">
        <Logo />
        <div className="mt-8 max-w-md">{children}</div>
        <Link to="/" className="mt-10 text-sm text-white/50 hover:text-white">
          ← Back to movies
        </Link>
      </div>
    </div>
  )
}
