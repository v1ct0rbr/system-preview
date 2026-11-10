import { useEffect, useState } from "react"
import { ArrowUpRight, Moon, Sun } from "lucide-react"

import { AuroraBackground } from "@/components/aurora-background"
import { BrandMark } from "@/components/brand-mark"
import { Countdown } from "@/components/countdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { launchDateLabel, systemConfig } from "@/lib/config"
import { useCountdown } from "@/lib/countdown"
import { cn } from "@/lib/utils"

const CURRENT_YEAR = new Date().getFullYear()
const THEME_STORAGE_KEY = "aurora-theme"

type Theme = "light" | "dark"

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light"

  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light"
}

export default function App() {
  const { name, description, url, launchAt } = systemConfig
  const countdown = useCountdown(launchAt)
  const { isLaunched } = countdown
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.title = isLaunched ? `${name} — Disponível` : `${name} — Em breve`

    const metaDescription = document.querySelector('meta[name="description"]')
    metaDescription?.setAttribute("content", description)
  }, [description, isLaunched, name])

  useEffect(() => {
    const isDark = theme === "dark"
    const root = document.documentElement

    root.classList.toggle("dark", isDark)
    root.style.colorScheme = theme

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#05060f" : "#f4f7fc")
  }, [theme])

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark"

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {
      // Browsers can block storage in private contexts; the theme still applies.
    }

    setTheme(nextTheme)
  }

  const themeActionLabel =
    theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground transition-colors duration-500">
      <AuroraBackground />

      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium tracking-tight">
                {name}
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Preview build
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "h-8 gap-2 rounded-full px-3.5 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm",
                isLaunched
                  ? "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-200"
                  : "border-cyan-700/20 bg-cyan-500/[0.07] text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/[0.06] dark:text-cyan-100/80",
              )}
            >
              <span className="relative flex size-1.5">
                <span
                  className={cn(
                    "absolute inline-flex size-full rounded-full opacity-70 motion-safe:animate-ping",
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
              {isLaunched ? "Disponível" : "Em breve"}
            </Badge>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={themeActionLabel}
              title={themeActionLabel}
              className="size-8 rounded-full border-slate-900/10 bg-white/70 text-slate-600 shadow-none backdrop-blur-sm hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
            >
              {theme === "dark" ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-14 sm:py-20">
          <div className="flex w-full flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/60 px-3.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.3em] text-cyan-800/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-cyan-100/70 dark:shadow-none sm:text-[10px]">
              <span className="size-1 rounded-full bg-cyan-500 shadow-[0_0_10px_2px_rgba(8,145,178,0.35)] dark:bg-cyan-300 dark:shadow-[0_0_10px_2px_rgba(34,211,238,0.55)]" />
              {isLaunched ? "Acesso liberado" : "Prévia de desenvolvimento"}
            </span>

            <h1 className="mt-6 max-w-4xl text-balance text-[clamp(2.9rem,7.6vw,6rem)] font-medium leading-[0.95] tracking-[-0.045em]">
              <span className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-500 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(8,145,178,0.15)] dark:from-white dark:via-white dark:to-slate-400 dark:drop-shadow-[0_0_60px_rgba(34,211,238,0.2)]">
                {name}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              {description}
            </p>

            <Countdown parts={countdown} launchDateLabel={launchDateLabel} />

            {isLaunched ? (
              <div className="mt-8 flex items-center justify-center">
                {url ? (
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-full bg-slate-950 px-6 font-medium text-white shadow-[0_18px_45px_-20px_rgba(15,23,42,0.65)] hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-[0_18px_50px_-20px_rgba(255,255,255,0.6)] dark:hover:bg-white/90"
                  >
                    <a href={url} target="_blank" rel="noreferrer">
                      Acessar sistema
                      <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                ) : (
                  <span className="rounded-full border border-emerald-600/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-200">
                    O acesso já está liberado
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </main>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-900/[0.08] py-6 text-[11px] text-muted-foreground dark:border-white/[0.06] sm:flex-row">
          <p>
            © {CURRENT_YEAR} {name}. Todos os direitos reservados.
          </p>
          <p className="inline-flex items-center gap-2">
            <span
              className={cn(
                "size-1.5 rounded-full",
                isLaunched
                  ? "bg-emerald-500 dark:bg-emerald-300/80"
                  : "bg-cyan-500 shadow-[0_0_8px_1px_rgba(8,145,178,0.3)] dark:bg-cyan-300/70 dark:shadow-[0_0_8px_1px_rgba(34,211,238,0.4)]",
              )}
            />
            {isLaunched
              ? "Sistema disponível"
              : "Ambiente de prévia · build de desenvolvimento"}
          </p>
        </footer>
      </div>
    </div>
  )
}
