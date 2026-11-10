import { CalendarDays } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { CountdownParts } from "@/lib/countdown"
import { cn } from "@/lib/utils"

type CountdownProps = {
  parts: CountdownParts
  launchDateLabel: string
}

type ClockDensity = "default" | "compact" | "dense"

const TILE_STYLES: Record<ClockDensity, string> = {
  default:
    "h-[clamp(4rem,13vw,7.75rem)] w-[clamp(2.45rem,9vw,5.4rem)] rounded-[clamp(0.9rem,2.5vw,1.35rem)]",
  compact:
    "h-[clamp(3.1rem,13vw,7.75rem)] w-[clamp(1.8rem,9vw,5.4rem)] rounded-[clamp(0.65rem,2.5vw,1.35rem)]",
  dense:
    "h-[clamp(2.7rem,11vw,6.3rem)] w-[clamp(1.4rem,7vw,4.4rem)] rounded-[clamp(0.55rem,2vw,1.1rem)]",
}

const DIGIT_STYLES: Record<ClockDensity, string> = {
  default: "text-[clamp(2.1rem,8.6vw,5.1rem)]",
  compact: "text-[clamp(1.55rem,8.6vw,5.1rem)]",
  dense: "text-[clamp(1.25rem,6.6vw,4rem)]",
}

const GROUP_GAP_STYLES: Record<ClockDensity, string> = {
  default: "gap-1 sm:gap-1.5",
  compact: "gap-0.5 sm:gap-1.5",
  dense: "gap-0.5 sm:gap-1",
}

const LABEL_STYLES: Record<ClockDensity, string> = {
  default:
    "text-[9px] tracking-[0.28em] sm:text-[10px] sm:tracking-[0.34em]",
  compact:
    "text-[7px] tracking-[0.12em] min-[360px]:text-[8px] min-[360px]:tracking-[0.18em] sm:text-[10px] sm:tracking-[0.34em]",
  dense:
    "text-[7px] tracking-[0.1em] min-[360px]:text-[8px] min-[360px]:tracking-[0.14em] sm:text-[9px] sm:tracking-[0.26em]",
}

const SEPARATOR_STYLES: Record<ClockDensity, string> = {
  default: "h-[clamp(4rem,13vw,7.75rem)]",
  compact: "h-[clamp(3.1rem,13vw,7.75rem)]",
  dense: "h-[clamp(2.7rem,11vw,6.3rem)]",
}

const CLOCK_GAP_STYLES: Record<ClockDensity, string> = {
  default: "gap-1.5 sm:gap-3",
  compact: "gap-1 sm:gap-3",
  dense: "gap-0.5 sm:gap-2.5",
}

function Digit({
  value,
  launched,
  density,
}: {
  value: string
  launched: boolean
  density: ClockDensity
}) {
  return (
    <span
      className={cn(
        "relative flex items-center justify-center overflow-hidden border bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_50px_-30px_rgba(15,23,42,0.22)] backdrop-blur-sm dark:bg-white/[0.035] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_24px_60px_-30px_rgba(0,0,0,0.95)]",
        TILE_STYLES[density],
        launched
          ? "border-emerald-600/20 dark:border-emerald-300/20"
          : "border-slate-900/10 dark:border-white/10",
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-slate-900/[0.04] dark:from-white/[0.08] dark:via-transparent dark:to-black/25"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-60 dark:via-white/40"
      />
      <span
        key={value}
        className={cn(
          "relative bg-gradient-to-b bg-clip-text font-mono font-medium leading-none tracking-[-0.04em] text-transparent tabular-nums motion-safe:animate-[digit-tick_450ms_cubic-bezier(0.22,1,0.36,1)]",
          DIGIT_STYLES[density],
          launched
            ? "from-emerald-700 via-emerald-600 to-emerald-500/60 dark:from-emerald-50 dark:via-emerald-100 dark:to-emerald-300/60"
            : "from-slate-900 via-slate-900 to-slate-500 dark:from-white dark:via-white dark:to-white/40",
        )}
      >
        {value}
      </span>
    </span>
  )
}

function TimeGroup({
  value,
  label,
  launched,
  density,
}: {
  value: string
  label: string
  launched: boolean
  density: ClockDensity
}) {
  const digits = value.padStart(2, "0").split("")

  return (
    <div className="flex flex-col items-center gap-2.5 sm:gap-3.5">
      <div className={cn("flex", GROUP_GAP_STYLES[density])}>
        {digits.map((digit, index) => (
          <Digit
            key={`${index}-${digit}`}
            value={digit}
            launched={launched}
            density={density}
          />
        ))}
      </div>
      <span
        className={cn(
          "font-medium uppercase text-muted-foreground",
          LABEL_STYLES[density],
        )}
      >
        {label}
      </span>
    </div>
  )
}

function TimeSeparator({
  launched,
  density,
}: {
  launched: boolean
  density: ClockDensity
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 sm:gap-3.5",
        SEPARATOR_STYLES[density],
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full motion-safe:animate-[colon-pulse_2s_ease-in-out_infinite] sm:size-2",
          launched
            ? "bg-emerald-600/60 dark:bg-emerald-300/70"
            : "bg-slate-900/25 dark:bg-white/30",
        )}
      />
      <span
        className={cn(
          "size-1.5 rounded-full motion-safe:animate-[colon-pulse_2s_ease-in-out_infinite] [animation-delay:1s] sm:size-2",
          launched
            ? "bg-emerald-600/60 dark:bg-emerald-300/70"
            : "bg-slate-900/25 dark:bg-white/30",
        )}
      />
    </div>
  )
}

export function Countdown({ parts, launchDateLabel }: CountdownProps) {
  const { days, hours, minutes, seconds, isLaunched } = parts
  const hourDigits = String(hours).length
  const density: ClockDensity =
    hourDigits > 3 ? "dense" : hourDigits > 2 ? "compact" : "default"

  const hoursWithinDay = hours % 24
  const clockLabel = isLaunched
    ? "Sistema disponível agora"
    : days > 0
      ? `Faltam ${days} dias, ${hoursWithinDay} horas, ${minutes} minutos e ${seconds} segundos`
      : `Faltam ${hours} horas, ${minutes} minutos e ${seconds} segundos`

  return (
    <div className="relative mt-12 w-full max-w-3xl">
      <div
        aria-hidden="true"
        className={cn(
          "absolute -inset-6 rounded-[3rem] blur-2xl",
          isLaunched
            ? "bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.2),transparent_70%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.17),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.2),transparent_70%)]",
        )}
      />

      <div
        className={cn(
          "relative rounded-[2rem] p-px shadow-[0_50px_120px_-60px_rgba(8,145,178,0.35)] dark:shadow-[0_50px_140px_-60px_rgba(34,211,238,0.65)]",
          isLaunched
            ? "bg-[linear-gradient(140deg,rgba(16,185,129,0.4),rgba(255,255,255,0.9)_38%,rgba(20,184,166,0.28))] dark:bg-[linear-gradient(140deg,rgba(52,211,153,0.45),rgba(255,255,255,0.07)_38%,rgba(45,212,191,0.3))]"
            : "bg-[linear-gradient(140deg,rgba(8,145,178,0.35),rgba(255,255,255,0.9)_38%,rgba(139,92,246,0.3))] dark:bg-[linear-gradient(140deg,rgba(103,232,249,0.45),rgba(255,255,255,0.07)_38%,rgba(167,139,250,0.4))]",
        )}
      >
        <Card className="relative gap-0 overflow-hidden rounded-[calc(2rem-1px)] border-0 bg-white/80 py-0 shadow-none backdrop-blur-2xl dark:bg-[#070a14]/85">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-slate-900/[0.025] to-transparent motion-safe:animate-[scan_9s_ease-in-out_infinite] dark:via-white/[0.04]" />
          </div>

          <CardContent className="relative px-4 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                <span className="relative flex size-1.5">
                  <span
                    className={cn(
                      "absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping",
                      isLaunched
                        ? "bg-emerald-500 dark:bg-emerald-300"
                        : "bg-cyan-500 dark:bg-cyan-300",
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex size-1.5 rounded-full",
                      isLaunched
                        ? "bg-emerald-500 dark:bg-emerald-300"
                        : "bg-cyan-500 dark:bg-cyan-300",
                    )}
                  />
                </span>
                {isLaunched ? "Sistema online" : "Contagem regressiva"}
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70 min-[380px]:inline">
                Horário local
              </span>
            </div>

            <div
              role="timer"
              aria-live="off"
              aria-atomic="true"
              aria-label={clockLabel}
              className={cn(
                "mt-7 flex items-start justify-center",
                CLOCK_GAP_STYLES[density],
              )}
            >
              <TimeGroup
                value={String(hours)}
                label="horas"
                launched={isLaunched}
                density={density}
              />
              <TimeSeparator launched={isLaunched} density={density} />
              <TimeGroup
                value={String(minutes)}
                label="minutos"
                launched={isLaunched}
                density={density}
              />
              <TimeSeparator launched={isLaunched} density={density} />
              <TimeGroup
                value={String(seconds)}
                label="segundos"
                launched={isLaunched}
                density={density}
              />
            </div>

            <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-slate-900/[0.08] pt-5 text-xs dark:border-white/[0.07] sm:flex-row">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="size-3.5 text-cyan-700/70 dark:text-cyan-200/70" />
                <span className="tracking-wide">{launchDateLabel}</span>
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]",
                  isLaunched
                    ? "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-200"
                    : "border-cyan-700/20 bg-cyan-500/[0.07] text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/[0.06] dark:text-cyan-100/80",
                )}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {isLaunched
                  ? "Disponível agora"
                  : days > 0
                    ? `Faltam ${days} dias`
                    : "Reta final"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
