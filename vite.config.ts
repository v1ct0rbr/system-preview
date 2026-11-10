import { existsSync, readdirSync } from "node:fs"
import { resolve, sep } from "node:path"
import { fileURLToPath, URL } from "node:url"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin } from "vite"

const PUBLIC_DIR = fileURLToPath(new URL("./public", import.meta.url))
const IMAGE_PATTERN = /\.(avif|jpe?g|png|webp)$/i
const DEFAULT_BACKGROUND_DIRS = "/backgrounds"

function parseBackgroundDirs(value: string | undefined) {
  return (value ?? DEFAULT_BACKGROUND_DIRS)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function normalizeDir(dir: string) {
  const cleaned = dir.replace(/^\/+|\/+$/g, "")

  return cleaned ? `/${cleaned}` : ""
}

function listBackgroundImages(dirs: string[]) {
  const images: string[] = []

  for (const rawDir of dirs) {
    const urlDir = normalizeDir(rawDir)
    if (!urlDir || urlDir.includes("..")) continue

    const fsDir = resolve(PUBLIC_DIR, `.${urlDir}`)
    if (!fsDir.startsWith(`${PUBLIC_DIR}${sep}`) || !existsSync(fsDir)) {
      console.warn(`[backgrounds] Diretório ignorado: ${rawDir}`)
      continue
    }

    const files = readdirSync(fsDir)
      .filter((file) => IMAGE_PATTERN.test(file))
      .sort((a, b) => a.localeCompare(b, "pt-BR"))

    for (const file of files) {
      images.push(`${urlDir}/${encodeURIComponent(file)}`)
    }
  }

  return [...new Set(images)]
}

function backgroundsManifest(getDirs: () => string[]): Plugin {
  return {
    name: "aurora-backgrounds-manifest",
    configureServer(server) {
      server.middlewares.use(
        "/backgrounds/manifest.json",
        (_request, response) => {
          response.setHeader("Content-Type", "application/json; charset=utf-8")
          response.setHeader("Cache-Control", "no-store")
          response.end(JSON.stringify(listBackgroundImages(getDirs())))
        },
      )
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "backgrounds/manifest.json",
        source: JSON.stringify(listBackgroundImages(getDirs()), null, 2),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const backgroundDirs = parseBackgroundDirs(env.SYSTEM_BACKGROUND_DIRS)

  return {
    plugins: [
      react(),
      tailwindcss(),
      backgroundsManifest(() => backgroundDirs),
    ],
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  }
})
