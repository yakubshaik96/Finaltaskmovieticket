import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Booking routes need a (demo) signed-in user. Unauthenticated visitors are sent
// to /login and returned to the page they asked for afterwards.
export default function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return children
}
