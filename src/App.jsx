import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import ScrollToTop from "./components/ScrollToTop"
import { AuthProvider } from "./context/AuthContext"
import { BookingProvider } from "./context/BookingContext"
import Confirmation from "./pages/Confirmation"
import Home from "./pages/Home"
import Login from "./pages/Login"
import MovieDetails from "./pages/MovieDetails"
import Movies from "./pages/Movies"
import NotFound from "./pages/NotFound"
import RequireAuth from "./components/RequireAuth"
import Seats from "./pages/Seats"
import Signup from "./pages/Signup"
import Summary from "./pages/Summary"
import Tickets from "./pages/Tickets"

function Frame() {
  const { pathname } = useLocation()
  const bare = pathname === "/login" || pathname === "/signup"
  const docked = pathname.startsWith("/movie/") || pathname === "/summary"

  return (
    <>
      <ScrollToTop />
      {!bare && <Navbar />}
      <main key={pathname} className={`animate-rise min-h-screen ${bare || pathname === "/" ? "" : "pt-16"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/movie/:id/seats" element={<RequireAuth><Seats /></RequireAuth>} />
          <Route path="/summary" element={<RequireAuth><Summary /></RequireAuth>} />
          <Route path="/confirmation/:id" element={<RequireAuth><Confirmation /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tickets" element={<RequireAuth><Tickets /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!bare && <Footer className={docked ? "pb-24" : ""} />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <Frame />
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  )
}
