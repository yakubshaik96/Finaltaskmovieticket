export const cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune"]

export const theatres = [
  {
    id: "pvr",
    name: "PVR ICON",
    area: "Phoenix Mall",
    amenities: ["Dolby Atmos", "4K Laser", "Recliner"],
  },
  {
    id: "inox",
    name: "INOX Megaplex",
    area: "City Centre",
    amenities: ["IMAX", "Dolby 7.1", "4DX"],
  },
  {
    id: "cinepolis",
    name: "Cinépolis VIP",
    area: "West End",
    amenities: ["VIP Lounge", "Recliner", "Dolby Atmos"],
  },
  {
    id: "miraj",
    name: "Miraj Cinemas",
    area: "Lakeview Plaza",
    amenities: ["3D", "Family", "Value"],
  },
]

export const ROWS = [
  { row: "A", type: "recliner", price: 540, count: 8 },
  { row: "B", type: "recliner", price: 540, count: 8 },
  { row: "C", type: "premium", price: 320, count: 10 },
  { row: "D", type: "premium", price: 320, count: 10 },
  { row: "E", type: "premium", price: 320, count: 10 },
  { row: "F", type: "premium", price: 320, count: 10 },
  { row: "G", type: "regular", price: 190, count: 12 },
  { row: "H", type: "regular", price: 190, count: 12 },
  { row: "I", type: "regular", price: 190, count: 12 },
  { row: "J", type: "regular", price: 190, count: 12 },
]

const TIME_SETS = [
  ["09:30 AM", "12:45 PM", "04:00 PM", "07:20 PM", "10:40 PM"],
  ["10:15 AM", "01:30 PM", "04:50 PM", "08:10 PM", "11:15 PM"],
  ["11:00 AM", "02:20 PM", "05:40 PM", "09:00 PM"],
]

const FORMATS = {
  pvr: ["Dolby Atmos", "2D", "4DX", "Dolby Atmos", "2D"],
  inox: ["IMAX", "2D", "IMAX", "Dolby Atmos", "2D"],
  cinepolis: ["VIP", "2D", "4DX", "VIP", "2D"],
  miraj: ["2D", "3D", "2D", "2D", "3D"],
}

export function getTheatre(id) {
  return theatres.find((theatre) => theatre.id === id)
}

export function screenFor(movieId, theatreId) {
  const n = (movieId.length * 3 + theatreId.length * 5) % 7 + 1
  return `Audi ${n}`
}

export function showsFor(movie, theatreId) {
  let hash = 0
  const seed = movie.id + theatreId
  for (const char of seed) hash += char.charCodeAt(0)
  const times = TIME_SETS[hash % TIME_SETS.length]
  const formats = FORMATS[theatreId]
  return times.map((time, index) => ({
    time,
    format: formats[index % formats.length],
    language: movie.languages[index % movie.languages.length],
  }))
}

export function allSeatIds() {
  return ROWS.flatMap((row) =>
    Array.from({ length: row.count }, (_, index) => `${row.row}${index + 1}`),
  )
}

export function presetBooked(seed) {
  const ids = allSeatIds()
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  const taken = new Set()
  const count = 16 + (Math.abs(hash) % 10)
  let cursor = hash || 1
  let guard = 0
  while (taken.size < count && guard < ids.length) {
    cursor = Math.imul(cursor ^ (cursor >>> 16), 2246822507) + guard + 1
    taken.add(ids[Math.abs(cursor) % ids.length])
    guard += 1
  }
  return taken
}

export function seatKey({ movieId, theatreId, date, time }) {
  return [movieId, theatreId, date, time].join("|")
}
