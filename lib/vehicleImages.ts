import type { Vehicle, VehicleColor } from "../data/vehicles"
import { categoryToSlug } from "./getVehicleUrl"

/**
 * Returns the effective colors for a vehicle. If the vehicle has no colors array,
 * synthesizes a single "Default" color from its thumbnail so the color selector always shows.
 */
export function getEffectiveColors(vehicle: Vehicle): VehicleColor[] {
  if (vehicle.colors && vehicle.colors.length > 0) {
    return vehicle.colors
  }
  const thumb = vehicle.thumbnail || "thumbnail.jpg"
  return [{ name: "Default", thumbnail: thumb }]
}

/**
 * Resolve full image path. If value starts with "/", return as-is. Otherwise treat as filename under the vehicle folder.
 */
export function resolveVehicleImagePath(
  category: string,
  slug: string,
  value: string | undefined
): string {
  if (!value) return ""
  if (value.startsWith("/")) return value
  const catSlug = categoryToSlug(category)
  return `/images/vehicles/${catSlug}/${slug}/${value}`
}

/**
 * Get the thumbnail path for a vehicle, optionally for a specific color.
 */
export function getVehicleThumbnail(
  vehicle: Vehicle,
  category: string,
  colorIndex?: number,
  vehicleThumbs?: Record<string, string>
): string {
  const catSlug = categoryToSlug(category)
  const base = `/images/vehicles/${catSlug}/${vehicle.slug}`

  // Use effective colors (includes synthesized default when none defined)
  const colors = getEffectiveColors(vehicle)
  if (colors.length > 0) {
    const idx = colorIndex ?? 0
    const color = colors[Math.min(idx, colors.length - 1)]
    if (color?.thumbnail) {
      return resolveVehicleImagePath(category, vehicle.slug, color.thumbnail)
    }
  }

  // Fallback: vehicle-thumbs, then vehicle.thumbnail, then default
  const defaultPath = `${base}/thumbnail.jpg`
  if (vehicleThumbs?.[vehicle.slug]) return vehicleThumbs[vehicle.slug]
  if (vehicle.thumbnail && !vehicle.thumbnail.includes("placeholder")) {
    return resolveVehicleImagePath(category, vehicle.slug, vehicle.thumbnail)
  }
  return defaultPath
}

/**
 * Get gallery images for a vehicle, optionally for a specific color.
 * Returns full paths.
 */
export function getVehicleGallery(
  vehicle: Vehicle,
  category: string,
  colorIndex?: number,
  /** Raw image paths from getStaticProps (e.g. from filesystem scan) - used when no colors. */
  staticImages?: string[]
): string[] {
  const hasExplicitColors = Boolean(vehicle.colors && vehicle.colors.length > 0)
  if (hasExplicitColors) {
    const colors = vehicle.colors as VehicleColor[]
    const idx = colorIndex ?? 0
    const color = colors[Math.min(idx, colors.length - 1)]
    if (color?.gallery && color.gallery.length > 0) {
      return color.gallery.map((f) =>
        resolveVehicleImagePath(category, vehicle.slug, f)
      )
    }
    if (color?.thumbnail) {
      return [resolveVehicleImagePath(category, vehicle.slug, color.thumbnail)]
    }
    return []
  }

  // Use static images from page props if provided
  if (staticImages && staticImages.length > 0) return staticImages

  // Fallback: vehicle.images (full paths) or build from vehicle.gallery
  if (vehicle.images && vehicle.images.length > 0) return vehicle.images
  const gallery = (vehicle as { gallery?: string[] }).gallery
  if (gallery?.length) {
    return gallery.map((f) =>
      resolveVehicleImagePath(category, vehicle.slug, f)
    )
  }
  return []
}
