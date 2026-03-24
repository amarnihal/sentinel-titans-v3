import VehiclesHero from "../../components/VehiclesHero"
import ContactForm from "../../components/ContactForm"
import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { vehicles as canonicalVehicles } from "../../data/vehicles"
import VehicleCard from "../../components/VehicleCard"

const CATEGORIES = ["All Vehicles", "SUV", "Sedan", "OFF-ROAD & PICK-UP", "CASH-IN-TRANSIT (CIT)", "VIP/LUXURY"]

export default function VehiclesPage() {
  const router = useRouter()

  const [filter, setFilter] = useState<string>("All Vehicles")
  const [query, setQuery] = useState<string>("")

  // Initialize filter from query param if provided (e.g. /vehicles?filter=VIP%2FLUXURY)
  useEffect(() => {
    if (!router.isReady) return
    const raw = router.query.filter
    const value = Array.isArray(raw) ? raw[0] : raw
    if (value && typeof value === "string") {
      // Only set if it's a known category (this file's CATEGORIES includes "All Vehicles")
      if (CATEGORIES.includes(value)) {
        setFilter(value)
      }
    }
  }, [router.isReady, router.query.filter])

  // Keep the URL in sync when the filter changes (so back/forward preserves state).
  useEffect(() => {
    if (!router.isReady) return
    const current = Array.isArray(router.query.filter) ? router.query.filter[0] : router.query.filter
    if (current === filter) return

    const newQuery = { ...router.query }
    if (filter === "All Vehicles") {
      delete newQuery.filter
    } else {
      newQuery.filter = filter
    }

    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true })
  }, [filter, router.isReady, router.query, router.pathname])

  const filtered = useMemo(() => {
    const byCategory = filter === "All Vehicles" ? canonicalVehicles : canonicalVehicles.filter(v => v.category === filter)
    if (!query) return byCategory
    const q = query.trim().toLowerCase()
    return byCategory.filter(v => {
      return `${v.make} ${v.model}`.toLowerCase().includes(q) || (v.slug && v.slug.toLowerCase().includes(q))
    })
  }, [filter, query])

  const title =
    filter === "All Vehicles" ? "All Armored vehicles" : `All Armored ${filter.toUpperCase()}`

  return (
    <div className="min-h-screen bg-page">
      <VehiclesHero />

      <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters */}
          <aside className="md:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold mb-3">Filters</h3>

              {/* Search */}
              <div className="mb-4">
                <label htmlFor="vehicle-search" className="sr-only">Search vehicles</label>
                <input
                  id="vehicle-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search make, model..."
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>

              <nav className="space-y-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="vehicle-filter"
                      checked={filter === cat}
                      onChange={() => setFilter(cat)}
                      className="w-4 h-4 border rounded-none appearance-none checked:bg-black checked:border-black"
                    />
                    <span className={`text-sm ${filter === cat ? 'font-medium' : ''}`}>{cat.toUpperCase()}</span>
                  </label>
                ))}
              </nav>

              {/* Contact form under filters (sticky group) */}
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="md:col-span-3">
            <h2
              style={{ fontFamily: "Saira, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontWeight: 600 }}
              className="text-[32px] md:text-5xl font-bold mb-6"
            >
              {title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-20">
              {filtered.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} category={vehicle.category} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

