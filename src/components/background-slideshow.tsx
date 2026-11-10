import { useEffect, useState } from "react"

const MANIFEST_URL = "/backgrounds/manifest.json"
const SLIDE_DURATION = 7_000
const FADE_DURATION = 1_800

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setPrefersReducedMotion(media.matches)

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return prefersReducedMotion
}

export function BackgroundSlideshow() {
  const [images, setImages] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const controller = new AbortController()

    fetch(MANIFEST_URL, { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: unknown) => {
        if (!Array.isArray(data)) return

        setImages(
          data.filter(
            (source): source is string =>
              typeof source === "string" && source.length > 0,
          ),
        )
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return

        console.warn("[backgrounds] Não foi possível carregar o manifesto.", error)
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (images.length < 2 || prefersReducedMotion) return

    const timer = window.setTimeout(() => {
      setPrevious(current)
      setCurrent((index) => (index + 1) % images.length)
    }, SLIDE_DURATION)

    return () => window.clearTimeout(timer)
  }, [current, images.length, prefersReducedMotion])

  useEffect(() => {
    if (previous === null) return

    const timer = window.setTimeout(() => setPrevious(null), FADE_DURATION)
    return () => window.clearTimeout(timer)
  }, [previous])

  useEffect(() => {
    if (!images.length) return

    const nextImage = images[(current + 1) % images.length]

    if (nextImage) {
      const preload = new Image()
      preload.src = nextImage
    }
  }, [current, images])

  if (!images.length) return null

  const currentSource = images[current]
  const previousSource = previous === null ? null : images[previous]

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {previousSource ? (
        <div
          key={`previous-${previous}-${current}`}
          className="background-layer-previous absolute inset-0"
        >
          <img
            src={previousSource}
            alt=""
            className="background-slide size-full object-cover"
          />
        </div>
      ) : null}

      {currentSource ? (
        <div
          key={`current-${current}`}
          className="background-layer-current absolute inset-0"
        >
          <img
            src={currentSource}
            alt=""
            loading="eager"
            decoding="async"
            className="background-slide size-full object-cover"
          />
        </div>
      ) : null}

      <div className="absolute inset-0 bg-slate-200/45 dark:bg-[#05060f]/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/45 to-background/90" />
    </div>
  )
}
