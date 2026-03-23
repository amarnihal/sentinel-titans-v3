import { useMemo, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import VehicleCard from "./VehicleCard"
import { CATEGORIES, vehicles as canonicalVehicles } from "../data/vehicles"

const CARD_WIDTH = 280
const CARD_GAP = 24
const VISIBLE = 4

export default function VehiclesSection() {
  const ALL_LABEL = "All Vehicles"
  const tabs = [ALL_LABEL, ...CATEGORIES]
  const [active, setActive] = useState<string>(tabs[0])

  const allItems = useMemo(() => {
    if (active === ALL_LABEL) return canonicalVehicles
    return canonicalVehicles.filter((v) => v.category === active)
  }, [active])

  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    setStartIndex(0)
  }, [active])

  const canPrev = startIndex > 0
  const canNext = startIndex + VISIBLE < allItems.length

  const goPrev = useCallback(() => {
    setStartIndex((s) => Math.max(0, s - VISIBLE))
  }, [])
  const goNext = useCallback(() => {
    setStartIndex((s) => Math.min(s + VISIBLE, Math.max(0, allItems.length - VISIBLE)))
  }, [allItems.length])

  const goToPage = useCallback((pageIndex: number) => {
    setStartIndex(pageIndex * VISIBLE)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("input, textarea, [contenteditable]")) return
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        if (canPrev) goPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        if (canNext) goNext()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [canPrev, canNext, goPrev, goNext])

  const trackOffset = startIndex * (CARD_WIDTH + CARD_GAP)

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-bold mb-3 text-center" style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
          Armored Vehicles
        </h3>

        <p className="text-[14px] text-gray-600 mb-6 text-center max-w-2xl mx-auto">Explore our diverse lineup of armored SUVs, sedans, pickup trucks, limousines, and special-purpose vehicles.</p>

        <nav className="flex flex-wrap justify-center gap-4 items-center mb-6 border-b border-gray-200 pb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`text-sm font-medium pb-2 ${active === t ? "text-black border-b-2 border-red-600" : "text-gray-600"}`}
              style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="relative flex items-center gap-3 md:gap-6">
          {/* Prev arrow */}
          {allItems.length > VISIBLE && (
            <button
              onClick={goPrev}
              aria-label="Previous vehicles"
              disabled={!canPrev}
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-black/30 ${
                !canPrev
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 active:scale-95"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M15.75 19.5L8.25 12l7.5-7.5" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <div className="flex-1 min-w-0 overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(-${trackOffset}px, 0, 0)`,
                gap: CARD_GAP,
              }}
            >
              {allItems.map((v) => (
                <div
                  key={v.id}
                  className="flex-shrink-0 h-[480px]"
                  style={{ width: CARD_WIDTH }}
                >
                  <VehicleCard vehicle={v as any} category={v.category || active} />
                </div>
              ))}
            </div>
          </div>

          {/* Next arrow */}
          {allItems.length > VISIBLE && (
            <button
              onClick={goNext}
              aria-label="Next vehicles"
              disabled={!canNext}
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-black/30 ${
                !canNext
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 active:scale-95"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M8.25 19.5L15.75 12l-7.5-7.5" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Indicators (matches hero slideshow style) */}
        {allItems.length > VISIBLE && (
          <div className="flex justify-center items-center gap-3 mt-6">
            {Array.from({ length: Math.ceil(allItems.length / VISIBLE) }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                aria-label={`Go to page ${i + 1}`}
                aria-current={startIndex === i * VISIBLE ? "true" : "false"}
                className={`transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
                  startIndex === i * VISIBLE
                    ? "bg-black h-[3px] md:h-[4px] w-8 md:w-10 rounded-none scale-x-105 shadow-md"
                    : "bg-gray-300 h-[3px] md:h-[4px] w-6 md:w-8 rounded-none hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href={active === ALL_LABEL ? "/vehicles" : `/vehicles?filter=${encodeURIComponent(active)}`}
            className="inline-block border border-black px-6 py-3 text-[14px] font-medium hover:bg-black hover:text-white transition-colors"
            style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
          >
            Show all {active === ALL_LABEL ? "vehicles" : active}
          </Link>
        </div>
      </div>
    </section>
  )
}

