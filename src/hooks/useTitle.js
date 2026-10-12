import { useEffect } from "react"

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Lumina` : "Lumina · Movie Tickets"
  }, [title])
}
