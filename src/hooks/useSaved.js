import { useEffect, useState } from "react"

const KEY = "lumina_saved"

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

export function useSaved() {
  const [ids, setIds] = useState(read)

  useEffect(() => {
    const sync = () => setIds(read())
    window.addEventListener("lumina-saved", sync)
    return () => window.removeEventListener("lumina-saved", sync)
  }, [])

  const toggle = (id) => {
    const current = read()
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event("lumina-saved"))
  }

  return { ids, toggle, has: (id) => ids.includes(id) }
}
