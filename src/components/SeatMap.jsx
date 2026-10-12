import { ROWS } from "../data/cinema"
import { inr } from "../lib/format"

const priceOf = (type) => ROWS.find((row) => row.type === type)?.price ?? 0

const GROUPS = [
  { label: "Recliner", type: "recliner", hint: inr(priceOf("recliner")) },
  { label: "Premium", type: "premium", hint: inr(priceOf("premium")) },
  { label: "Classic", type: "regular", hint: inr(priceOf("regular")) },
]

function seatTone(type, status) {
  if (status === "booked") return "cursor-not-allowed border border-white/10 bg-[#12141c] text-white/25"
  if (status === "selected") return "scale-110 bg-gold text-ink shadow-[0_0_18px_rgba(240,193,75,0.55)]"
  if (type === "recliner") return "bg-[#6d3550] text-white hover:bg-[#8a4466]"
  if (type === "premium") return "bg-[#6d572c] text-white hover:bg-[#8c7138]"
  return "bg-[#343b4e] text-white hover:bg-[#46516c]"
}

export default function SeatMap({ taken, selected, onToggle }) {
  const selectedIds = new Set(selected.map((seat) => seat.id))

  return (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto w-max min-w-full px-2">
        <div className="mx-auto mb-8 max-w-xl">
          <div className="h-3 rounded-[50%] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_18px_40px_rgba(240,193,75,0.45)]" />
          <p className="mt-3 text-center text-[11px] tracking-[0.4em] text-white/45">SCREEN THIS WAY</p>
        </div>

        <div className="space-y-6">
          {GROUPS.map((group) => (
            <div key={group.type}>
              <div className="mb-3 flex items-center justify-between text-xs tracking-[0.2em] text-white/45">
                <span>{group.label.toUpperCase()}</span>
                <span>{group.hint}</span>
              </div>
              <div className="space-y-2">
                {ROWS.filter((row) => row.type === group.type).map((row) => {
                  const half = Math.ceil(row.count / 2)
                  return (
                    <div key={row.row} className="flex items-center justify-center gap-2 sm:gap-3">
                      <span className="w-4 text-xs text-white/35">{row.row}</span>
                      <SeatCluster
                        row={row}
                        start={1}
                        end={half}
                        taken={taken}
                        selectedIds={selectedIds}
                        onToggle={onToggle}
                      />
                      <span className="w-6 sm:w-10" />
                      <SeatCluster
                        row={row}
                        start={half + 1}
                        end={row.count}
                        taken={taken}
                        selectedIds={selectedIds}
                        onToggle={onToggle}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SeatCluster({ row, start, end, taken, selectedIds, onToggle }) {
  const seats = []
  for (let number = start; number <= end; number += 1) {
    const id = `${row.row}${number}`
    const seat = { id, row: row.row, number, type: row.type, price: row.price }
    const status = taken.has(id) ? "booked" : selectedIds.has(id) ? "selected" : "available"
    seats.push(
      <button
        key={id}
        type="button"
        disabled={status === "booked"}
        aria-pressed={status === "selected"}
        aria-label={`${id} ${row.type} seat, ${status}`}
        title={`${id} · ₹${row.price}`}
        onClick={() => onToggle(seat)}
        className={`grid h-7 w-7 place-items-center rounded-t-md rounded-b-sm text-[10px] font-semibold transition sm:h-8 sm:w-8 ${seatTone(row.type, status)}`}
      >
        {status === "booked" ? "×" : number}
      </button>,
    )
  }
  return <div className="flex gap-1.5">{seats}</div>
}
