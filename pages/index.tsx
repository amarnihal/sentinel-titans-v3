import HeroSlideshow from "../components/HeroSlideshow"
import Image from "next/image"
import Link from "next/link"
import { CATEGORIES, VEHICLES } from "../data/vehicles"
import VehiclesSection from "../components/VehiclesSection"
import IndustryPartnersTicker from "../components/IndustryPartnersTicker"
import CompanyInfoSection from "../components/CompanyInfoSection"
import CatalogueRequestModal from "../components/CatalogueRequestModal"

export default function Home() {
  // Helper: pick a representative thumbnail for a category (fallback to placeholder)
  function thumbnailForCategory(category: string) {
    if (category === "SUV") return "/assets/SUV-d6cda032-5263-4789-a02d-135278819e8f.png"
    if (category === "VIP/LUXURY") return "/assets/vip_luxury-b44ce5b7-89a1-4ba4-b922-f980628130fc.png"
    if (category === "CASH-IN-TRANSIT (CIT)") return "/assets/cash-in-transit-43a26ed3-3496-4200-a5e5-dddce31595ca.png"
    if (category === "OFF-ROAD & PICK-UP") return "/assets/offroadpickup-bd3e3a5d-706c-4a51-87c2-028f6936f6c5.png"
    if (category === "Sedan") return "/assets/sedan-05170840-d528-4241-ae6d-ba5efd6b0bac.png"
    const match = VEHICLES.find((v) => v.category === category && v.thumbnail)
    return (match?.thumbnail) || "/placeholders/vehicle-thumb.svg"
  }

  return (
    <main className="min-h-screen bg-page">
      {/* Full-bleed hero with no horizontal padding; offset negative to start at top under fixed header */}
      <div className="-mt-16">
        <HeroSlideshow />
      </div>

      {/* Full-bleed categories section */}
      <section className="py-12 mt-0 bg-black w-full">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6 text-center text-white"
            style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif" }}
          >
            Armored Vehicles Ready To Protect
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => {
              const thumb = thumbnailForCategory(cat)
              return (
                <Link
                  key={cat}
                  href={`/vehicles?filter=${encodeURIComponent(cat)}`}
                  className="relative overflow-hidden shadow-md group h-72 md:h-80 lg:h-96 block"
                >
                  <Image src={thumb} alt={cat} fill className="object-cover object-center" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-white text-[18px] md:text-[20px] font-semibold px-4 text-center"
                      style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif", fontWeight: 700 }}
                    >
                      {cat.toUpperCase()}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <VehiclesSection />

        {/* Drive with Unmatched Confidence (full-bleed black background, text left, larger image right) */}
      </div>

      <section className="py-28 md:py-36 lg:py-44 bg-black w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-left">
              <h2
                id="drive-confidence-title"
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
                style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif" }}
              >
                Drive with Unmatched Confidence
              </h2>

              <p className="text-[12px] text-white/90 max-w-3xl mb-6">
                Sentinel Titans engineers high-performance armored SUVs, sedans, personnel carriers, and cash-in-transit vehicles built for uncompromising security. Trusted by banks, law enforcement, corporations, and private clients worldwide, our vehicles combine advanced design with proven protection. Request our catalogue to explore the full range of mission-ready solutions.
              </p>

              <CatalogueRequestModal />
            </div>

            <div className="w-full min-h-[280px] md:min-h-[360px] aspect-video overflow-hidden relative">
              <Image
                src="/assets/drive-with-unmatched-confidence.png"
                alt="Car key handover — drive with unmatched confidence"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <IndustryPartnersTicker />

      <CompanyInfoSection />
    </main>
  )
}
