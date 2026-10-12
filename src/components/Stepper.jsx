const STEPS = ["Showtime", "Seats", "Payment", "Ticket"]

export default function Stepper({ current }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs sm:text-sm">
      {STEPS.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
              index <= current ? "bg-gold text-ink" : "bg-white/10 text-white/45"
            }`}
          >
            {index + 1}
          </span>
          <span className={index <= current ? "text-white" : "text-white/40"}>{step}</span>
          {index < STEPS.length - 1 && <span className="mx-1 hidden h-px w-6 bg-white/15 sm:block" />}
        </li>
      ))}
    </ol>
  )
}
