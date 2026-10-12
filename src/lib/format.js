export function inr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function priceBreakdown(seats) {
  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0)
  const convenience = seats.length * 32
  const gst = Math.round(convenience * 0.18)
  return { subtotal, convenience, gst, total: subtotal + convenience + gst }
}

export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function upcomingDates(count = 6) {
  const today = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    return {
      iso: toISODate(date),
      day: date.toLocaleDateString("en-IN", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      label:
        index === 0
          ? "Today"
          : index === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-IN", { weekday: "short" }),
    }
  })
}

export function formatShowDate(iso) {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

export function formatBookedAt(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
