import { useId, useState } from "react"

// Labelled input with an inline error, optional show/hide toggle for passwords.
export default function FormField({ label, error, type = "text", reveal, ...inputProps }) {
  const id = useId()
  const [shown, setShown] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && shown ? "text" : type
  const errorId = `${id}-error`

  return (
    <div className="grid gap-2 text-sm">
      <label htmlFor={id}>{label}</label>
      <span className="relative">
        <input
          id={id}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`field ${isPassword && reveal !== false ? "pr-16" : ""} ${error ? "!border-rose" : ""}`}
          {...inputProps}
        />
        {isPassword && reveal !== false && (
          <button
            type="button"
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-1 text-xs text-white/60 hover:text-white"
            onClick={() => setShown((value) => !value)}
          >
            {shown ? "Hide" : "Show"}
          </button>
        )}
      </span>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-rose">
          {error}
        </p>
      )}
    </div>
  )
}
