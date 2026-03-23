"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Vehicle } from "../data/vehicles"
import { VEHICLE_THUMBNAILS } from "../data/vehicle-thumbs"
import { getVehicleUrl } from "../lib/getVehicleUrl"
import { getVehicleThumbnail, getEffectiveColors } from "../lib/vehicleImages"
import VehicleName from "./VehicleName"
import ColorSelector from "./ColorSelector"

export default function VehicleCard({ vehicle, category }: { vehicle: Vehicle; category: string }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const src = getVehicleThumbnail(vehicle, category, selectedColorIndex, VEHICLE_THUMBNAILS)
  const href = getVehicleUrl(category, vehicle.slug)
  const effectiveColors = getEffectiveColors(vehicle)

  return (
    <Link href={href} className="block w-full h-full group">
      <article className="w-full h-full min-h-[480px] flex flex-col bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 select-none">
        <div className="relative w-full h-72 flex-shrink-0 rounded-md overflow-hidden bg-transparent">
          <Image src={src} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-contain object-center" />
        </div>

        <div className="flex-1 flex flex-col min-h-0 p-4">
          <h3 className="text-gray-900 group-hover:text-[#8B0000] transition-colors">
            <VehicleName make={vehicle.make} model={vehicle.model} />
          </h3>

          <div
            className="mt-3"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <ColorSelector
              colors={effectiveColors}
                selectedIndex={selectedColorIndex}
                onSelect={setSelectedColorIndex}
                variant="compact"
                onInteraction={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            />
          </div>

          <div className="mt-auto pt-4">
            <span
              className="inline-block text-[14px] font-medium border border-black text-black px-4 py-2 rounded-sm group-hover:bg-[#8B0000] group-hover:border-[#8B0000] group-hover:text-white transition-colors"
              style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif" }}
            >
              EXPLORE
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

