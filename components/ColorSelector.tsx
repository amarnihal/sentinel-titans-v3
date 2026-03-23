"use client"

import type { VehicleColor } from "../data/vehicles"

type ColorSelectorProps = {
  colors: VehicleColor[]
  selectedIndex: number
  onSelect: (index: number) => void
  /** Compact style for cards (smaller swatches). */
  variant?: "default" | "compact"
  /** Callback to prevent parent navigation when clicking swatches (e.g. inside a Link) */
  onInteraction?: (e: React.MouseEvent | React.KeyboardEvent) => void
}

/** Known color names mapped to CSS color values for swatch display. */
const COLOR_SWATCHES: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  silver: "#c0c0c0",
  gray: "#808080",
  grey: "#808080",
  red: "#8B0000",
  blue: "#1e3a5f",
  green: "#2d5016",
  brown: "#5c4033",
  beige: "#d4b896",
  gold: "#b8860b",
  navy: "#000080",
  burgundy: "#800020",
}

function colorToSwatch(color: { name: string; hex?: string }): string {
  if (color.hex && /^#[0-9A-Fa-f]{6}$/.test(color.hex)) return color.hex
  const key = color.name.trim().toLowerCase()
  return COLOR_SWATCHES[key] ?? "#666"
}

export default function ColorSelector({
  colors,
  selectedIndex,
  onSelect,
  variant = "default",
  onInteraction,
}: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null

  const handleClick = (e: React.MouseEvent, i: number) => {
    onInteraction?.(e)
    onSelect(i)
  }

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onInteraction?.(e)
      onSelect(i)
    }
  }

  const size = variant === "compact" ? "w-5 h-5" : "w-6 h-6"
  const ring = variant === "compact" ? "ring-2" : "ring-2"

  return (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Select color">
      {colors.map((c, i) => (
        <button
          key={c.name}
          type="button"
          onClick={(e) => handleClick(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          aria-label={`${c.name}${selectedIndex === i ? " (selected)" : ""}`}
          aria-pressed={selectedIndex === i}
          className={`rounded-full border border-gray-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-black/40 focus:ring-offset-1 ${size} ${
            selectedIndex === i ? `${ring} ring-offset-1 ring-black` : "hover:border-gray-500"
          }`}
          style={{ backgroundColor: colorToSwatch(c) }}
          title={c.name}
        />
      ))}
    </div>
  )
}
