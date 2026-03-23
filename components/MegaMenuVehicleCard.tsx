"use client"

import Link from "next/link"
import { Vehicle } from "../data/vehicles"
import { VEHICLE_THUMBNAILS } from "../data/vehicle-thumbs"
import { getVehicleUrl } from "../lib/getVehicleUrl"
import { getVehicleThumbnail } from "../lib/vehicleImages"
import VehicleName from "./VehicleName"

type Props = {
  vehicle: Vehicle
  category: string
  onExploreClick?: () => void
  /** "mobile" = compact (h-28), "desktop" = taller (h-36) */
  variant?: "mobile" | "desktop"
}

export default function MegaMenuVehicleCard({
  vehicle,
  category,
  onExploreClick,
  variant = "desktop",
}: Props) {
  const src = getVehicleThumbnail(vehicle, category, 0, VEHICLE_THUMBNAILS)
  const imgHeight = variant === "mobile" ? "h-28" : "h-40"
  const cardMinH = variant === "mobile" ? "min-h-[180px]" : "min-h-[220px]"
  const textAreaH = variant === "mobile" ? "h-10" : "h-11"

  return (
    <div className={`flex flex-col h-full ${cardMinH}`}>
      <div className={`w-full ${imgHeight} flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden`}>
        <img
          src={src}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="object-contain w-full h-full"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement
            img.onerror = null
            img.src = vehicle.thumbnail || "/placeholder/vehicle-thumb.png"
          }}
        />
      </div>
      <div className={`mt-2 ${textAreaH} flex flex-col justify-center text-gray-800 uppercase overflow-hidden`} style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
        <VehicleName make={vehicle.make} model={vehicle.model} size="sm" />
      </div>
      <Link
        href={getVehicleUrl(category, vehicle.slug)}
        onClick={onExploreClick}
        className="inline-block text-[14px] font-normal border border-black text-black px-4 py-2 mt-2 rounded-sm hover:bg-black hover:text-white transition-colors btn"
      >
        EXPLORE
      </Link>
    </div>
  )
}
