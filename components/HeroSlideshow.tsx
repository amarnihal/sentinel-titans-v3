import { useEffect, useRef, useState } from "react"
import Image from "next/image"

type HeroSlideshowProps = {
  images?: { src: string; alt?: string }[]
  interval?: number
}

const DEFAULT_HERO_IMAGES: { src: string; alt: string }[] = [
  { src: "/images/hero/mercedes-g-class-snow-mountains.png", alt: "Vehicle slide 1" },
  { src: "/images/hero/toyota-hilux-gr-sport-mountain.png", alt: "Black Toyota Hilux GR Sport driving through mud and snow in the mountains" },
  { src: "/images/hero/toyota-land-cruiser-70-mountain-road.png", alt: "Black Toyota Land Cruiser 70 Series on a scenic mountain road" },
  { src: "/images/hero/toyota-land-cruiser-78-desert.png", alt: "Tan Toyota Land Cruiser in desert terrain with Sentinel Titans branding" },
  { src: "/images/hero/chevrolet-tahoe-mountain-road.png", alt: "Black Chevrolet Tahoe on a mountain road with snow-covered peaks" },
]

export default function HeroSlideshow({
  images = DEFAULT_HERO_IMAGES,
  interval = 5000,
}: HeroSlideshowProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<number | null>(null)

  const slides = images && images.length > 0 ? images : []

  useEffect(() => {
    setIndex((i) => (i >= slides.length ? 0 : i))
  }, [slides.length])

  useEffect(() => {
    if (paused) return
    if (slides.length <= 1) return
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, interval)
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [slides.length, interval, paused])

  // keyboard navigation (left/right arrows)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [slides.length])

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length)
  }

  // Guard: no slides (e.g. empty `images` prop) — after hooks
  if (slides.length === 0) return null

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="w-full h-screen relative">
        {slides.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={i === index ? "false" : "true"}
          >
            <Image
              src={img.src}
              alt={img.alt || `slide-${i}`}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 -ml-1 p-2 text-white hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 z-40"
      >
        <svg width="28" height="28" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false" className="block">
          <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="sr-only">Previous slide</span>
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 -mr-1 p-2 text-white hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 z-40"
      >
        <svg width="28" height="28" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false" className="block">
          <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="sr-only">Next slide</span>
      </button>

      {/* Indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-3 z-40">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : "false"}
            onClick={() => setIndex(i)}
            className={`transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/60 ${
              i === index
                ? "bg-white h-[3px] md:h-[4px] w-8 md:w-10 rounded-none scale-x-105 shadow-lg"
                : "bg-white/40 h-[3px] md:h-[4px] w-6 md:w-8 rounded-none hover:bg-white/70"
            }`}
          >
            <span className="sr-only">{i === index ? `Slide ${i + 1}, current` : `Go to slide ${i + 1}`}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

