/**
 * Base vehicle specification rows shown on /vehicles/[category]/[slug].
 * Always returns exactly 12 rows (same order as the previous UI contract).
 */

export type VehicleSpecSource = {
  year?: number | null;
  make?: string | null;
  model?: string | null;
  armorLevel?: string | null;
  transmission?: string | null;
  engine?: string | null;
  horsepower?: string | null;
  drivetrain?: string | null;
  dimensions?: string | null;
  wheelbase?: string | null;
  seatingCapacity?: string | number | null;
  fuelCapacity?: string | null;
};

export type SpecRow = { label: string; value: string | number };

function str(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

function yearValue(year: number | null | undefined): number {
  if (typeof year === "number" && year > 0) return year;
  return 2024;
}

/** Always 12 rows. Complete `data.json` entries should make fallbacks unnecessary. */
export function buildBaseVehicleSpecRows(
  vehicle: VehicleSpecSource,
  fallback = "—"
): SpecRow[] {
  const f = (v: unknown) => {
    const s = str(v);
    return s === "" ? fallback : s;
  };

  const seat = vehicle.seatingCapacity;
  const seatVal =
    seat === undefined || seat === null
      ? fallback
      : typeof seat === "number"
        ? seat
        : f(seat);

  return [
    { label: "Year", value: yearValue(vehicle.year) },
    { label: "Make", value: f(vehicle.make) },
    { label: "Model", value: f(vehicle.model) },
    { label: "Armor Level", value: f(vehicle.armorLevel) },
    { label: "Transmission", value: f(vehicle.transmission) },
    { label: "Engine", value: f(vehicle.engine) },
    { label: "Horsepower", value: f(vehicle.horsepower) },
    { label: "Drivetrain", value: f(vehicle.drivetrain) },
    { label: "Dimensions (mm)", value: f(vehicle.dimensions) },
    { label: "Wheelbase (mm)", value: f(vehicle.wheelbase) },
    { label: "Seating Capacity", value: seatVal },
    { label: "Fuel Capacity", value: f(vehicle.fuelCapacity) },
  ];
}
