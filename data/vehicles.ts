export type VehicleColor = {
  name: string
  thumbnail: string
  gallery?: string[]
  /** Optional hex for the color swatch (e.g. "#d9c4a0"). Overrides name-based lookup. */
  hex?: string
}

export type Vehicle = {
  id: string
  category: string
  year: number
  make: string
  model: string
  body: string
  shortDescription?: string
  description?: string
  armorLevel?: string
  transmission?: string
  engine?: string
  horsepower?: string
  drivetrain?: string
  dimensionsMM?: string
  wheelbaseMM?: string
  seatingCapacity?: number | string
  fuelCapacity?: string
  availability?: string
  thumbnail?: string
  images?: string[]
  slug: string
  specs?: Record<string, string | number>
  /** When present and length > 1, a color selector is shown. Each color has its own thumbnail and optional gallery. */
  colors?: VehicleColor[]
}

// Canonical vehicle data. Update these records when you provide real data.
export const vehicles: Vehicle[] = [
  // SUV CATEGORY
  {
    id: "toyota-land-cruiser-78-hardtop",
    category: "SUV",
    year: 2024,
    make: "Toyota",
    model: "Land Cruiser 78 Hardtop",
    body: "SUV",
    slug: "toyota-land-cruiser-78-hardtop",
    thumbnail: "/images/vehicles/suv/toyota-land-cruiser-78-hardtop/thumbnail.png",
    images: [
      "/images/vehicles/suv/toyota-land-cruiser-78-hardtop/01-side-left.png",
      "/images/vehicles/suv/toyota-land-cruiser-78-hardtop/02-interior-cargo.png",
      "/images/vehicles/suv/toyota-land-cruiser-78-hardtop/03-rear-right.png",
      "/images/vehicles/suv/toyota-land-cruiser-78-hardtop/04-front-passenger.png",
      "/images/vehicles/suv/toyota-land-cruiser-78-hardtop/05-interior-rear.png",
    ],
    colors: [{ name: "Beige", hex: "#d9c4a0", thumbnail: "thumbnail.png", gallery: ["01-side-left.png", "02-interior-cargo.png", "03-rear-right.png", "04-front-passenger.png", "05-interior-rear.png"] }],
    availability: "TBD",
  },
  {
    id: "toyota-land-cruiser-76-hardtop",
    category: "SUV",
    year: 2024,
    make: "Toyota",
    model: "Land Cruiser 76 Hardtop",
    body: "SUV",
    slug: "toyota-land-cruiser-76-hardtop",
    thumbnail: "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/thumbnail.png",
    images: [
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/01-front-view.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/02-front-three-quarter.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/03-front-left-three-quarter.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/04-side-profile.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/05-rear-view.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/06-rear-doors-open.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/07-rear-interior-cargo.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/08-interior-dashboard.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/09-interior-drivers-side.png",
      "/images/vehicles/suv/toyota-land-cruiser-76-hardtop/10-interior-rear-door.png",
    ],
    armorLevel: "TBD",
    transmission: "6-Speed Automatic",
    engine: "4.5L V8 Turbo Diesel",
    horsepower: "272 HP",
    drivetrain: "4WD",
    seatingCapacity: 5,
    fuelCapacity: "180L",
    availability: "TBD",
    shortDescription: "Rugged off-road SUV with modern refinements, optional armor, and legendary 70 Series durability.",
    colors: [{ name: "Black", thumbnail: "thumbnail.png" }],
  },
  {
    id: "chevrolet-tahoe",
    category: "SUV",
    year: 0,
    make: "Chevrolet",
    model: "Tahoe",
    body: "SUV",
    slug: "chevrolet-tahoe",
    thumbnail: "/images/vehicles/suv/chevrolet-tahoe/tahoe-thumbnail.png",
    images: [
      "/images/vehicles/suv/chevrolet-tahoe/chevrolet-tahoe-1.jpg",
      "/images/vehicles/suv/chevrolet-tahoe/chevrolet-tahoe-2.jpg",
      "/images/vehicles/suv/chevrolet-tahoe/chevrolet-tahoe-3.jpg",
      "/images/vehicles/suv/chevrolet-tahoe/chevrolet-tahoe-4.jpg",
      "/images/vehicles/suv/chevrolet-tahoe/chevrolet-tahoe-5.jpg",
      "/images/vehicles/suv/chevrolet-tahoe/chevrolet-tahoe-6.jpg",
      "/images/vehicles/suv/chevrolet-tahoe/chevrolet-tahoe-7.jpg",
    ],
    colors: [{ name: "Black", thumbnail: "tahoe-thumbnail.png" }],
    availability: "TBD",
  },

  // SEDAN CATEGORY
  {
    id: "toyota-camry",
    category: "Sedan",
    year: 2024,
    make: "Toyota",
    model: "Camry",
    body: "Sedan",
    slug: "toyota-camry",
    thumbnail: "/images/vehicles/sedan/toyota-camry/thumbnail.png",
    images: [
      "/images/vehicles/sedan/toyota-camry/gallery-1.png",
      "/images/vehicles/sedan/toyota-camry/gallery-2.png",
      "/images/vehicles/sedan/toyota-camry/gallery-3.png",
      "/images/vehicles/sedan/toyota-camry/gallery-4.png",
      "/images/vehicles/sedan/toyota-camry/gallery-5.png",
      "/images/vehicles/sedan/toyota-camry/gallery-6.png",
      "/images/vehicles/sedan/toyota-camry/gallery-7.png",
      "/images/vehicles/sedan/toyota-camry/gallery-8.png"
    ],
    shortDescription: "Reliable midsize sedan with mission-ready security options.",
    availability: "TBD",
  },

  // OFF-ROAD & PICKUP CATEGORY
  {
    id: "toyota-hilux",
    category: "OFF-ROAD & PICK-UP",
    year: 2024,
    make: "Toyota",
    model: "Hilux",
    body: "Pickup Truck",
    armorLevel: "B6+",
    transmission: "6-Speed Automatic",
    engine: "2.8L Turbo Diesel",
    horsepower: "201 HP",
    drivetrain: "4WD",
    dimensionsMM: "5325 x 1855 x 1815",
    wheelbaseMM: "3085",
    seatingCapacity: 5,
    fuelCapacity: "80L",
    slug: "toyota-hilux",
    thumbnail: "/images/vehicles/off-road-pick-up/toyota-hilux/thumbnail.png",
    images: [
      "/images/vehicles/off-road-pick-up/toyota-hilux/image-1.png",
      "/images/vehicles/off-road-pick-up/toyota-hilux/image-2.png",
      "/images/vehicles/off-road-pick-up/toyota-hilux/image-3.png",
      "/images/vehicles/off-road-pick-up/toyota-hilux/image-4.png",
      "/images/vehicles/off-road-pick-up/toyota-hilux/image-5.png",
      "/images/vehicles/off-road-pick-up/toyota-hilux/image-6.png",
      "/images/vehicles/off-road-pick-up/toyota-hilux/image-7.png"
    ],
    colors: [{ name: "Black", thumbnail: "thumbnail.png", gallery: ["image-1.png", "image-2.png", "image-3.png", "image-4.png", "image-5.png", "image-6.png", "image-7.png"] }],
    availability: "In Stock",
  },
  {
    id: "toyota-land-cruiser-79-roll-cage",
    category: "OFF-ROAD & PICK-UP",
    year: 0,
    make: "Toyota",
    model: "Land Cruiser 79 – Roll Cage Version",
    body: "Pickup",
    slug: "toyota-land-cruiser-79-roll-cage",
    thumbnail: "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-roll-cage/thumbnail.png",
    images: [
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-roll-cage/image-1.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-roll-cage/image-2.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-roll-cage/image-3.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-roll-cage/image-4.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-roll-cage/image-5.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-roll-cage/image-6.png"
    ],
    colors: [
      { name: "Beige", thumbnail: "thumbnail.png", gallery: ["image-1.png", "image-2.png", "image-3.png", "image-4.png", "image-5.png", "image-6.png"] },
    ],
    availability: "TBD",
  },
  {
    id: "toyota-land-cruiser-79-standard",
    category: "OFF-ROAD & PICK-UP",
    year: 2024,
    make: "Toyota",
    model: "Land Cruiser 79",
    body: "Pickup Truck",
    armorLevel: "B6+",
    transmission: "5-Speed Manual",
    engine: "4.5L Turbo Diesel V8",
    horsepower: "202 HP",
    drivetrain: "4WD",
    dimensionsMM: "4870 x 1870 x 1950",
    wheelbaseMM: "2730",
    seatingCapacity: 5,
    fuelCapacity: "90L",
    slug: "toyota-land-cruiser-79-standard",
    thumbnail: "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/thumbnail.png",
    images: [
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/image-1.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/image-2.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/image-3.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/image-4.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/image-5.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/image-6.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/image-7.png",
      "/images/vehicles/off-road-pick-up/toyota-land-cruiser-79-standard/image-8.png"
    ],
    colors: [
      { name: "Beige", thumbnail: "thumbnail.png", gallery: ["image-1.png", "image-2.png", "image-3.png", "image-4.png", "image-5.png", "image-6.png", "image-7.png", "image-8.png"] },
    ],
    availability: "In Stock",
  },

  // CASH-IN-TRANSIT (CIT) / ARMORED VEHICLES
  {
    id: "toyota-land-cruiser-79-cit",
    category: "CASH-IN-TRANSIT (CIT)",
    year: 0,
    make: "Toyota",
    model: "Land Cruiser 79",
    body: "Armored",
    slug: "toyota-land-cruiser-79",
    thumbnail: "/images/vehicles/cash-in-transit/toyota-land-cruiser-79/toyota-land-cruiser-79-thumbnail.png",
    images: [
      "/images/vehicles/cash-in-transit/toyota-land-cruiser-79/toyota-land-cruiser-79-1.png",
      "/images/vehicles/cash-in-transit/toyota-land-cruiser-79/toyota-land-cruiser-79-2.png",
      "/images/vehicles/cash-in-transit/toyota-land-cruiser-79/toyota-land-cruiser-79-3.png",
      "/images/vehicles/cash-in-transit/toyota-land-cruiser-79/toyota-land-cruiser-79-4.png",
      "/images/vehicles/cash-in-transit/toyota-land-cruiser-79/toyota-land-cruiser-79-5.png",
      "/images/vehicles/cash-in-transit/toyota-land-cruiser-79/toyota-land-cruiser-79-6.png",
      "/images/vehicles/cash-in-transit/toyota-land-cruiser-79/toyota-land-cruiser-79-7.png"
    ],
    colors: [
      { name: "White", thumbnail: "toyota-land-cruiser-79-thumbnail.png", gallery: ["toyota-land-cruiser-79-1.png", "toyota-land-cruiser-79-2.png", "toyota-land-cruiser-79-3.png", "toyota-land-cruiser-79-4.png", "toyota-land-cruiser-79-5.png", "toyota-land-cruiser-79-6.png", "toyota-land-cruiser-79-7.png"] },
      { name: "Beige", thumbnail: "toyota-land-cruiser-79-beige-thumbnail.png", gallery: ["toyota-land-cruiser-79-beige-1.png", "toyota-land-cruiser-79-beige-2.png", "toyota-land-cruiser-79-beige-3.png", "toyota-land-cruiser-79-beige-4.png", "toyota-land-cruiser-79-beige-5.png", "toyota-land-cruiser-79-beige-6.png", "toyota-land-cruiser-79-beige-7.png", "toyota-land-cruiser-79-beige-8.png", "toyota-land-cruiser-79-beige-9.png"] },
    ],
    availability: "TBD",
  },

  // VIP / LUXURY VEHICLES
  {
    id: "mercedes-benz-g63-amg",
    category: "VIP/LUXURY",
    year: 0,
    make: "Mercedes-Benz",
    model: "G63 AMG",
    body: "SUV",
    slug: "mercedes-benz-g63-amg",
    thumbnail: "/images/vehicles/vip-luxury/mercedes-benz-g63-amg/thumbnail.png",
    images: [
      "/images/vehicles/vip-luxury/mercedes-benz-g63-amg/image-1.png",
      "/images/vehicles/vip-luxury/mercedes-benz-g63-amg/image-2.png",
      "/images/vehicles/vip-luxury/mercedes-benz-g63-amg/image-3.png",
      "/images/vehicles/vip-luxury/mercedes-benz-g63-amg/image-4.png",
      "/images/vehicles/vip-luxury/mercedes-benz-g63-amg/image-5.png",
      "/images/vehicles/vip-luxury/mercedes-benz-g63-amg/image-6.png",
      "/images/vehicles/vip-luxury/mercedes-benz-g63-amg/image-7.png"
    ],
    availability: "TBD",
  },
  {
    id: "range-rover",
    category: "VIP/LUXURY",
    year: 0,
    make: "Land Rover",
    model: "Range Rover",
    body: "SUV",
    slug: "range-rover",
    thumbnail: "/images/vehicles/vip-luxury/range-rover/Rangerover_thumbnail.png",
    images: [],
    availability: "TBD",
  },
  {
    id: "land-rover",
    category: "VIP/LUXURY",
    year: 0,
    make: "Land Rover",
    model: "",
    body: "SUV",
    slug: "land-rover",
    thumbnail: "/images/vehicles/vip-luxury/land-rover/thumbnail.png",
    images: [],
    availability: "TBD",
  },
  {
    id: "mercedes-maybach-s450",
    category: "VIP/LUXURY",
    year: 2024,
    make: "Mercedes-Maybach",
    model: "S450",
    body: "Sedan",
    slug: "mercedes-maybach-s450",
    thumbnail: "/images/vehicles/vip-luxury/mercedes-maybach-s450/thumbnail.png",
    images: [
      "/images/vehicles/vip-luxury/mercedes-maybach-s450/gallery-1.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s450/gallery-2.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s450/gallery-3.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s450/gallery-4.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s450/gallery-5.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s450/gallery-6.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s450/gallery-7.png",
    ],
    shortDescription: "Ultra-luxury sedan with VIP-focused protection and refinement.",
    availability: "TBD",
  },
  {
    id: "mercedes-maybach-s580",
    category: "VIP/LUXURY",
    year: 2024,
    make: "Mercedes-Maybach",
    model: "S580",
    body: "Sedan",
    slug: "mercedes-maybach-s580",
    thumbnail: "/images/vehicles/vip-luxury/mercedes-maybach-s580/thumbnail.png",
    images: [
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-1.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-2.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-3.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-4.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-5.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-6.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-7.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-8.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-9.png",
      "/images/vehicles/vip-luxury/mercedes-maybach-s580/gallery-10.png",
    ],
    shortDescription: "Flagship ultra-luxury sedan with VIP-focused protection and refinement.",
    availability: "TBD",
  },
]

// Reuse the detailed Vehicle type defined at the top of this file.
// The top-level `Vehicle` export includes all fields used across the codebase.

export const CATEGORIES = [
  "SUV",
  "Sedan",
  "OFF-ROAD & PICK-UP",
  "CASH-IN-TRANSIT (CIT)",
  "VIP/LUXURY",
] as const

export const VEHICLES: Vehicle[] = [
  {
    id: "suv-1",
    category: "SUV",
    body: "SUV",
    make: "Atlas",
    model: "X1",
    year: 2022,
    slug: "atlas-x1-2022",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-1.svg"],
    shortDescription: "Compact performance SUV",
    description: "Full description for Atlas X1.",
    specs: { engine: "2.0L Turbo", mileage: "10,000 km" },
  },
  {
    id: "suv-2",
    category: "SUV",
    body: "SUV",
    make: "Rangefire",
    model: "ZX",
    year: 2021,
    slug: "rangefire-zx-2021",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-2.svg"],
    shortDescription: "Premium SUV with robust features",
    description: "Full description for Rangefire ZX.",
    specs: { engine: "3.0L V6", mileage: "25,000 km" },
  },
  {
    id: "suv-3",
    category: "SUV",
    body: "SUV",
    make: "Summit",
    model: "R",
    year: 2020,
    slug: "summit-r-2020",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-3.svg"],
    shortDescription: "Adventure-ready SUV",
    description: "Full description for Summit R.",
    specs: { engine: "2.7L", mileage: "40,000 km" },
  },

  {
    id: "sedan-1",
    category: "Sedan",
    body: "Sedan",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    slug: "toyota-camry",
    thumbnail: "/images/vehicles/sedan/toyota-camry/thumbnail.png",
    images: [
      "/images/vehicles/sedan/toyota-camry/gallery-1.png",
      "/images/vehicles/sedan/toyota-camry/gallery-2.png",
      "/images/vehicles/sedan/toyota-camry/gallery-3.png",
      "/images/vehicles/sedan/toyota-camry/gallery-4.png",
      "/images/vehicles/sedan/toyota-camry/gallery-5.png",
      "/images/vehicles/sedan/toyota-camry/gallery-6.png",
      "/images/vehicles/sedan/toyota-camry/gallery-7.png",
      "/images/vehicles/sedan/toyota-camry/gallery-8.png"
    ],
    shortDescription: "Reliable midsize sedan",
    description: "Full description for Toyota Camry.",
    specs: { engine: "On request", mileage: "On request" },
  },

  {
    id: "or-1",
    category: "OFF-ROAD & PICK-UP",
    body: "Pickup Truck",
    make: "Trailblazer",
    model: "4x4",
    year: 2023,
    slug: "trailblazer-4x4-2023",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-4.svg"],
    shortDescription: "Heavy-duty off-road pickup",
    description: "Full description for Trailblazer 4x4.",
    specs: { engine: "3.5L V6", mileage: "5,000 km" },
  },
  {
    id: "or-2",
    category: "OFF-ROAD & PICK-UP",
    body: "Pickup Truck",
    make: "Ranger",
    model: "Pro",
    year: 2022,
    slug: "ranger-pro-2022",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-5.svg"],
    shortDescription: "Durable pickup for work and play",
    description: "Full description for Ranger Pro.",
    specs: { engine: "3.2L", mileage: "30,000 km" },
  },
  {
    id: "or-3",
    category: "OFF-ROAD & PICK-UP",
    body: "Pickup Truck",
    make: "Desert",
    model: "Hawk",
    year: 2021,
    slug: "desert-hawk-2021",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-6.svg"],
    shortDescription: "Built for extreme terrains",
    description: "Full description for Desert Hawk.",
    specs: { engine: "4.0L", mileage: "18,000 km" },
  },

  {
    id: "cit-1",
    category: "CASH-IN-TRANSIT (CIT)",
    body: "Armored Van",
    make: "SecureTrans",
    model: "300",
    year: 2019,
    slug: "securetrans-300-2019",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-7.svg"],
    shortDescription: "Armored cash-in-transit vehicle",
    description: "Full description for SecureTrans 300.",
    specs: { capacity: "2t", armour: "Level B6" },
  },
  {
    id: "cit-2",
    category: "CASH-IN-TRANSIT (CIT)",
    body: "Armored Van",
    make: "ArmourVan",
    model: "X",
    year: 2020,
    slug: "armourvan-x-2020",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-8.svg"],
    shortDescription: "Secure transport for high-value assets",
    description: "Full description for ArmourVan X.",
    specs: { capacity: "1.5t", armour: "Level B7" },
  },

  {
    id: "vip-1",
    category: "VIP/LUXURY",
    body: "SUV",
    make: "Mercedes-Benz",
    model: "G63 AMG",
    year: 2021,
    slug: "mercedes-benz-g63-amg-2021",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-9.svg", "/placeholders/vehicle-10.svg"],
    shortDescription: "High-performance luxury SUV",
    description: "Full description for Mercedes-Benz G63 AMG.",
    specs: { engine: "4.0L V8", mileage: "12,000 km" },
  },
  {
    id: "vip-2",
    category: "VIP/LUXURY",
    body: "Sedan",
    make: "Opulence",
    model: "S",
    year: 2022,
    slug: "opulence-s-2022",
    thumbnail: "/placeholders/vehicle-thumb.svg",
    images: ["/placeholders/vehicle-11.svg"],
    shortDescription: "Flagship luxury sedan",
    description: "Full description for Opulence S.",
    specs: { engine: "3.8L", mileage: "8,000 km" },
  },
]

export function getVehiclesByCategory(category: string) {
  return VEHICLES.filter((v) => v.category === category)
}

export default {
  CATEGORIES,
  VEHICLES,
  getVehiclesByCategory,
}

