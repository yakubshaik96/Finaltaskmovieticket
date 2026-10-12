import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import FormField from "../components/FormField"
import { useAuth } from "../context/AuthContext"
import { movies } from "../data/movies"
import { useTitle } from "../hooks/useTitle"
import { validateEmail } from "../lib/validation"

export default function Login() {
  useTitle("Sign in")
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/"
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [busy, setBusy] = useState(false)

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => ({ ...current, [key]: "" }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    setFormError("")
    const next = {
      email: validateEmail(form.email),
      password: form.password ? "" : "Enter your password.",
    }
    setErrors(next)
    if (next.email || next.password) return

    setBusy(true)
    try {
      const result = await login(form)
      if (!result.ok) {
        setFormError(result.message)
        return
      }
      navigate(from, { replace: true })
    } catch {
      setFormError("Sign in failed in this browser. Try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      image={movies[3].backdrop}
      quote="The seat you want is still open."
      credit="Sign in to keep tickets under your name."
    >
      <h1 className="font-display text-6xl tracking-wide">Sign in</h1>
      <p className="mt-2 text-sm text-white/60">
        New here?{" "}
        <Link to="/signup" state={location.state} className="text-gold">
          Create an account
        </Link>
      </p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-4">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
        />
        {formError && (
          <p role="alert" className="text-sm text-rose">
            {formError}
          </p>
        )}
        <button type="submit" className="btn-gold" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-xs text-white/40">
          Demo sign-in: accounts are created and stored only in this browser. Create one to book tickets.
        </p>
      </form>
    </AuthLayout>
  )
}
