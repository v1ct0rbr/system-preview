import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex size-11 items-center justify-center rounded-2xl border border-slate-900/10 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_40px_-18px_rgba(8,145,178,0.35)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_16px_40px_-18px_rgba(34,211,238,0.65)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 64 64"
        className="size-8 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="brand-orbit"
            x1="10"
            y1="54"
            x2="54"
            y2="10"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#22d3ee" />
            <stop offset="0.52" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#c084fc" />
          </linearGradient>
          <radialGradient
            id="brand-core"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(30 30) rotate(48) scale(9)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffffff" />
            <stop offset="0.32" stopColor="#a5f3fc" />
            <stop offset="1" stopColor="#38bdf8" />
          </radialGradient>
        </defs>
        <ellipse
          cx="32"
          cy="33"
          rx="20"
          ry="8.2"
          transform="rotate(-30 32 33)"
          stroke="url(#brand-orbit)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <circle cx="32" cy="32" r="8" fill="url(#brand-core)" />
        <circle cx="32" cy="32" r="2.6" fill="#ffffff" />
        <circle cx="49" cy="20" r="3" fill="#e0f2fe" />
      </svg>
    </div>
  )
}
