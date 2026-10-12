import { createContext, useContext, useState } from "react"
import { hashPassword, verifyPassword } from "../lib/passwords"

// Demo authentication only: accounts live in this browser's localStorage and
// passwords are stored as salted PBKDF2 hashes, never as plain text.
const AuthContext = createContext(null)
const USERS_KEY = "lumina_users"
const SESSION_KEY = "lumina_session"

function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null")
    if (!session) return null
    const found = readUsers().find((item) => item.email === session.email)
    return found ? { name: found.name, email: found.email } : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)

  const startSession = (found) => {
    const session = { name: found.name, email: found.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  const signup = async ({ name, email, password }) => {
    const users = readUsers()
    const normalized = email.trim().toLowerCase()
    if (users.some((item) => item.email === normalized)) {
      return { ok: false, field: "email", message: "An account with this email already exists." }
    }
    const credentials = await hashPassword(password)
    const record = { name: name.trim(), email: normalized, ...credentials }
    writeUsers([...readUsers(), record])
    startSession(record)
    return { ok: true }
  }

  const login = async ({ email, password }) => {
    const normalized = email.trim().toLowerCase()
    const users = readUsers()
    const found = users.find((item) => item.email === normalized)
    const invalid = { ok: false, message: "Email or password is incorrect." }
    if (!found) return invalid

    if (typeof found.password === "string") {
      // Legacy record from an earlier build that stored plain text: verify once,
      // then replace it with a salted hash so the plain-text copy is removed.
      if (found.password !== password) return invalid
      const { password: _legacy, ...rest } = found
      const upgraded = { ...rest, ...(await hashPassword(password)) }
      writeUsers(users.map((item) => (item.email === normalized ? upgraded : item)))
      startSession(upgraded)
      return { ok: true }
    }

    if (!(await verifyPassword(password, found))) return invalid
    startSession(found)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used within AuthProvider")
  return value
}
