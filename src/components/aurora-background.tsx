import { BackgroundSlideshow } from "@/components/background-slideshow"

const STARS = [
  { top: "11%", left: "9%", size: 2, delay: "0s", duration: "6s" },
  { top: "18%", left: "26%", size: 1, delay: "1.4s", duration: "7s" },
  { top: "8%", left: "62%", size: 1.5, delay: "0.8s", duration: "5.5s" },
  { top: "16%", left: "82%", size: 2, delay: "2.2s", duration: "8s" },
  { top: "32%", left: "6%", size: 1, delay: "1.1s", duration: "6.5s" },
  { top: "38%", left: "92%", size: 1.5, delay: "0.3s", duration: "7.5s" },
  { top: "48%", left: "15%", size: 1, delay: "2.8s", duration: "5s" },
  { top: "56%", left: "88%", size: 2, delay: "1.9s", duration: "6.8s" },
  { top: "66%", left: "7%", size: 1.5, delay: "0.6s", duration: "8.5s" },
  { top: "72%", left: "94%", size: 1, delay: "3.1s", duration: "7s" },
  { top: "82%", left: "20%", size: 2, delay: "1.5s", duration: "6.2s" },
  { top: "88%", left: "70%", size: 1, delay: "0.9s", duration: "5.6s" },
  { top: "24%", left: "44%", size: 1, delay: "2.5s", duration: "7.8s" },
  { top: "60%", left: "52%", size: 1.5, delay: "0.2s", duration: "6.6s" },
] as const

export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#f4f7fc] dark:bg-[#05060f]" />
      <BackgroundSlideshow />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-12%,rgba(6,182,212,0.17),transparent_62%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-12%,rgba(34,211,238,0.17),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(139,92,246,0.11),transparent_65%)]" />

      <div className="absolute -left-40 top-[18%] size-[32rem] rounded-full bg-cyan-500/[0.1] blur-3xl motion-safe:animate-[drift-alt_24s_ease-in-out_infinite] dark:bg-cyan-400/[0.06]" />
      <div className="absolute -right-48 top-[8%] size-[38rem] rounded-full bg-violet-500/[0.1] blur-3xl motion-safe:animate-[drift_28s_ease-in-out_infinite] dark:bg-violet-500/[0.08]" />
      <div className="absolute bottom-[-18rem] left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-sky-500/[0.09] blur-3xl motion-safe:animate-[drift-alt_30s_ease-in-out_infinite] dark:bg-sky-500/[0.07]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:68px_68px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_42%,#000_18%,transparent_100%)]" />

      <div className="absolute left-1/2 top-1/2 size-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-900/[0.05] dark:border-white/[0.035]" />
      <div className="absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-900/[0.06] dark:border-white/[0.045]" />

      <div className="absolute inset-0">
        {STARS.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-cyan-700/50 dark:bg-cyan-100"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-600/30 to-transparent dark:via-cyan-300/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
    </div>
  )
}
