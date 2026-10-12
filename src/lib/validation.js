const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateName(value) {
  const name = value.trim()
  if (!name) return "Enter your name."
  if (name.length < 2) return "Name must be at least 2 characters."
  if (name.length > 60) return "Name must be 60 characters or fewer."
  return ""
}

export function validateEmail(value) {
  const email = value.trim()
  if (!email) return "Enter your email address."
  if (!EMAIL.test(email)) return "Enter a valid email address, like name@example.com."
  return ""
}

export function validatePassword(value) {
  if (!value) return "Enter a password."
  if (value.length < 8) return "Use at least 8 characters."
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Include at least one letter and one number."
  return ""
}

export function validateConfirm(password, confirm) {
  if (!confirm) return "Confirm your password."
  if (password !== confirm) return "Passwords do not match."
  return ""
}
