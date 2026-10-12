import { useEffect, useState } from "react"

const KEY = "lumina_city"

export function useCity() {
  const [city, setCityState] = useState(() => localStorage.getItem(KEY) || "Mumbai")

  useEffect(() => {
    const sync = () => setCityState(localStorage.getItem(KEY) || "Mumbai")
    window.addEventListener("lumina-city", sync)
    return () => window.removeEventListener("lumina-city", sync)
  }, [])

  const setCity = (next) => {
    localStorage.setItem(KEY, next)
    setCityState(next)
    window.dispatchEvent(new Event("lumina-city"))
  }

  return [city, setCity]
}
