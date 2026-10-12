import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import FormField from "../components/FormField"
import { useAuth } from "../context/AuthContext"
import { movies } from "../data/movies"
import { useTitle } from "../hooks/useTitle"
import { validateConfirm, validateEmail, validateName, validatePassword } from "../lib/validation"

export default function Signup() {
  useTitle("Create account")
  const { signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
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
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setBusy(true)
    try {
      const result = await signup(form)
      if (!result.ok) {
        if (result.field) setErrors((current) => ({ ...current, [result.field]: result.message }))
        else setFormError(result.message)
        return
      }
      navigate(from, { replace: true })
    } catch {
      setFormError("Could not create the account in this browser. Try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      image={movies[4].backdrop}
      quote="Save a seat before the lights go down."
      credit="Demo accounts stay in this browser only."
    >
      <h1 className="font-display text-6xl tracking-wide">Create account</h1>
      <p className="mt-2 text-sm text-white/60">
        Already booked with us?{" "}
        <Link to="/login" state={location.state} className="text-gold">
          Sign in
        </Link>
      </p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-4">
        <FormField label="Name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
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
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
        />
        <p className="-mt-2 text-xs text-white/45">At least 8 characters, with a letter and a number.</p>
        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
        />
        {formError && (
          <p role="alert" className="text-sm text-rose">
            {formError}
          </p>
        )}
        <button type="submit" className="btn-gold" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-xs text-white/40">
          Demo only. Passwords are hashed before being saved in this browser, but this is not production authentication.
        </p>
      </form>
    </AuthLayout>
  )
}
