import { getBrandAndModel } from "../lib/getVehicleUrl"

export type VehicleNameSize = "sm" | "default" | "lg"

const SIZE_STYLES: Record<
  VehicleNameSize,
  { brand: string; model: string }
> = {
  sm: {
    brand: "text-[14px]",
    model: "text-[16px]",
  },
  default: {
    brand: "text-[16px]",
    model: "text-[18px]",
  },
  lg: {
    brand: "text-[20px]",
    model: "text-[22px]",
  },
}

/** Canonical vehicle name display: brand (400) on top, model (600) below. Use everywhere vehicle names appear. */
export default function VehicleName({
  make,
  model,
  size = "default",
  className = "",
}: {
  make?: string
  model?: string
  size?: VehicleNameSize
  className?: string
}) {
  const { brand, model: modelText } = getBrandAndModel(make, model)
  const styles = SIZE_STYLES[size]

  if (!brand && !modelText) return null

  return (
    <span className={`flex flex-col gap-px ${className}`.trim()} role="text">
      <span className={`font-normal ${styles.brand}`}>{brand}</span>
      {modelText && <span className={`font-semibold ${styles.model}`}>{modelText}</span>}
    </span>
  )
}
