import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { vehicles as canonicalVehicles, Vehicle } from "../data/vehicles"
import { contactInfo } from "../data/contact"
import MegaMenuVehicleCard from "./MegaMenuVehicleCard"

export default function Header() {
  const [visible, setVisible] = useState(true) // header visibility (revealed)
  const lastY = useRef(0)
  const [vehiclesOpen, setVehiclesOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("SUV")
  const menuRef = useRef<HTMLDivElement | null>(null)
  const vehiclesButtonRef = useRef<HTMLButtonElement | null>(null)
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // derive categories from canonical data; keep this order for tabs
  const categoriesOrder = ["SUV", "Sedan", "OFF-ROAD & PICK-UP", "CASH-IN-TRANSIT (CIT)", "VIP/LUXURY"]
  const categories: Record<string, Vehicle[]> = categoriesOrder.reduce((acc, key) => {
    acc[key] = canonicalVehicles.filter(v => v.category === key)
    return acc
  }, {} as Record<string, Vehicle[]>)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      if (y < lastY.current) {
        // scrolling up -> show
        setVisible(true)
      } else if (y > lastY.current) {
        // scrolling down -> hide
        setVisible(false)
      }
      lastY.current = y
    }

    // initialize lastY
    lastY.current = typeof window !== "undefined" ? window.scrollY : 0
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mega menu on outside click or ESC
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (vehiclesOpen && menuRef.current && !menuRef.current.contains(e.target as Node) && vehiclesButtonRef.current && !vehiclesButtonRef.current.contains(e.target as Node)) {
        setVehiclesOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setVehiclesOpen(false)
    }
    document.addEventListener("click", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("click", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [vehiclesOpen])

  // Close mobile menu on ESC; lock body scroll when open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-black text-white transition-transform transition-opacity duration-300 ${
        visible ? "translate-y-0 opacity-100 pointer-events-auto bg-black/95" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.svg" alt="Sentinel Titans" className="h-[42px] w-auto" />
        </Link>

        {/* Desktop nav: visible from md up */}
        <nav className="hidden md:flex items-center gap-10 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-300 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-white/40 btn"
            aria-label="Home"
          >
            HOME
          </Link>

          <button
            ref={vehiclesButtonRef}
            aria-haspopup="true"
            aria-expanded={vehiclesOpen}
            aria-controls="mega-vehicles"
            onClick={() => setVehiclesOpen(v => !v)}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-300 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-white/40"
            type="button"
          >
            VEHICLES
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-300 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label="Contact"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              CONTACT
            </button>
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-black/95 border border-white/15 min-w-[220px] py-3 shadow-xl">
                <ul className="space-y-1">
                  {contactInfo.phones.map((p) => (
                    <li key={p.href}>
                      <a
                        href={p.href}
                        className="block px-4 py-2 text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {p.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={contactInfo.email.href}
                      className="block px-4 py-2 text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {contactInfo.email.label}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile: hamburger + call icon */}
        <div className="flex md:hidden items-center gap-3">
          <a
            href={contactInfo.phones[0].href}
            className="p-2 text-gray-300 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            aria-label="Call us"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(m => !m)}
            className="p-2 text-gray-300 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu panel (Home + Vehicles) */}
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`fixed inset-0 top-16 z-30 md:hidden bg-black/95 transition-opacity duration-200 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={(e) => e.target === e.currentTarget && setMobileMenuOpen(false)}
        >
          <nav className="flex flex-col p-6 gap-1" onClick={(e) => e.stopPropagation()}>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-[14px] font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              HOME
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                setVehiclesOpen(true)
              }}
              className="w-full text-left px-4 py-3 text-[14px] font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded focus:outline-none focus:ring-2 focus:ring-white/40 flex items-center justify-between"
            >
              VEHICLES
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </nav>
        </div>

          {/* Mega menu */}
          <div
            id="mega-vehicles"
            ref={menuRef}
            role="dialog"
            aria-modal="false"
            className={`fixed left-0 right-0 top-16 z-40 transform transition-all duration-200 ${vehiclesOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
          >
            {/* Background spans full viewport width */}
            <div className="w-full bg-page text-black shadow-lg border-t border-gray-200">
              <div className="w-full px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-full mx-auto">
                  {/* Close button (top-right of mega menu) */}
                  <button
                    onClick={() => setVehiclesOpen(false)}
                    aria-label="Close vehicles menu"
                    className="absolute right-4 top-4 z-50 text-gray-600 hover:text-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {/* ALL VEHICLES button (top-right, next to close) */}
                  <div className="absolute right-20 top-3 z-40">
                    <Link href="/vehicles" onClick={() => setVehiclesOpen(false)} className="inline-flex items-center px-4 py-2 border border-black text-black hover:bg-black hover:text-white rounded-sm text-[14px] btn">
                      ALL VEHICLES
                    </Link>
                  </div>
                  {/* Desktop tabs (visible sm+) */}
                  <div className="hidden sm:block border-b">
                    <div role="tablist" aria-label="Vehicle categories" className="flex gap-4 p-4 overflow-x-auto">
                        {Object.keys(categories).map(cat => (
                        <button
                          key={cat}
                          role="tab"
                          aria-selected={activeTab === cat}
                          aria-controls={`panel-${cat}`}
                          onClick={() => setActiveTab(cat)}
                          className={`px-3 py-2 text-[14px] ${activeTab === cat ? "border-b-2 border-red-800 text-red-800" : "text-gray-700 hover:text-red-800"} focus:outline-none`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile accordion (visible on small screens) */}
                  <div className="sm:hidden">
                    {Object.keys(categories).map(cat => (
                      <div key={cat} className="border-b">
                        <button
                          aria-expanded={openMobileCategory === cat}
                          onClick={() => setOpenMobileCategory(openMobileCategory === cat ? null : cat)}
                          className="w-full text-left px-4 py-3 flex items-center justify-between text-[14px] font-medium"
                        >
                          <span className="text-gray-800">{cat}</span>
                          <svg className={`w-5 h-5 text-gray-600 transform ${openMobileCategory === cat ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <div className={`${openMobileCategory === cat ? "block" : "hidden"} px-4 pb-4`}>
                          <div className="grid grid-cols-2 gap-4 items-stretch">
                            {categories[cat].map(vehicle => (
                              <div key={vehicle.id} className="flex flex-col min-h-0">
                                <MegaMenuVehicleCard
                                  vehicle={vehicle}
                                  category={cat}
                                  variant="mobile"
                                  onExploreClick={() => setVehiclesOpen(false)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Panels for desktop */}
                  <div className="hidden sm:block p-6">
                    {Object.keys(categories).map(cat => (
                      <div
                        key={cat}
                        id={`panel-${cat}`}
                        role="tabpanel"
                        aria-hidden={activeTab !== cat}
                        className={`${activeTab === cat ? "block" : "hidden"}`}
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-stretch">
                          {categories[cat].map(vehicle => (
                            <div key={vehicle.id} className="flex flex-col items-stretch min-h-0">
                              <MegaMenuVehicleCard
                                vehicle={vehicle}
                                category={cat}
                                variant="desktop"
                                onExploreClick={() => setVehiclesOpen(false)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </header>
  )
}

