export type SystemConfig = {
  name: string
  description: string
  startDate: string
  url: string
  launchAt: Date
}

type RuntimeConfig = {
  name?: string
  description?: string
  startDate?: string
  url?: string
}

declare global {
  interface Window {
    __SYSTEM_CONFIG__?: RuntimeConfig
  }
}

const DEFAULT_NAME = "Aurora"
const DEFAULT_DESCRIPTION =
  "Uma nova experiência para gerenciar, acompanhar e evoluir suas operações — em um só lugar."
const DEFAULT_START_DATE = "2026-12-20T09:00:00-03:00"

function firstFilled(...values: Array<string | undefined>) {
  return values.map((value) => value?.trim()).find(Boolean)
}

function normalizeUrl(value: string | undefined) {
  const raw = firstFilled(value)
  if (!raw) return ""

  try {
    const url = new URL(raw)
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : ""
  } catch {
    return ""
  }
}

const runtime: RuntimeConfig =
  typeof window === "undefined" ? {} : (window.__SYSTEM_CONFIG__ ?? {})
const env = import.meta.env

const configuredStartDate =
  firstFilled(runtime.startDate, env.VITE_SYSTEM_START_DATE) ??
  DEFAULT_START_DATE

const parsedStartDate = new Date(configuredStartDate)
const isStartDateValid = !Number.isNaN(parsedStartDate.getTime())

if (!isStartDateValid && import.meta.env.DEV) {
  console.warn(
    `[preview] Data de início inválida: "${configuredStartDate}". Usando ${DEFAULT_START_DATE}.`,
  )
}

export const systemConfig: SystemConfig = {
  name: firstFilled(runtime.name, env.VITE_SYSTEM_NAME) ?? DEFAULT_NAME,
  description:
    firstFilled(runtime.description, env.VITE_SYSTEM_DESCRIPTION) ??
    DEFAULT_DESCRIPTION,
  startDate: isStartDateValid ? configuredStartDate : DEFAULT_START_DATE,
  url: normalizeUrl(firstFilled(runtime.url, env.VITE_SYSTEM_URL)),
  launchAt: isStartDateValid ? parsedStartDate : new Date(DEFAULT_START_DATE),
}

export const launchDateLabel = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
}).format(systemConfig.launchAt)
