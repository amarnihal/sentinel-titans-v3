import Image from "next/image"

const COMPANY_CARDS = [
  {
    id: "production",
    title: "Production",
    image: "/assets/company-production.png",
    body: "Sentinel Titans manufactures high-quality armored and law-enforcement vehicles in Dubai, UAE. Using advanced technology, precision engineering, and premium materials, we ensure durability, efficiency, and dependable protection for evolving security needs.",
  },
  {
    id: "wide-range",
    title: "Wide Range of Armored Vehicles",
    image: "/assets/company-wide-range.png",
    body: "We produce armored SUVs, luxury sedans, limousines, tactical vehicles, and cash-in-transit units, delivering customized security solutions for clients worldwide.",
  },
  {
    id: "performance",
    title: "Unique Performance & Features",
    image: "/assets/company-performance.png",
    body: "Our vehicles combine advanced protection with luxury and innovation—from custom interiors and electronics to extended limousine builds—designed to exceed performance and comfort expectations.",
  },
  {
    id: "quality",
    title: "Highest Quality Components",
    image: "/assets/company-quality.png",
    body: "Sentinel Titans vehicles use advanced metal plating and composite materials to protect against firearms, blunt force, and explosive threats, ensuring maximum safety for occupants.",
  },
]

export default function CompanyInfoSection() {
  return (
    <section className="py-28 md:py-40 bg-page w-full">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
        <h2
          className="text-2xl md:text-3xl font-bold mb-16 md:mb-20 text-center text-black"
          style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif" }}
        >
          ABOUT THE COMPANY
        </h2>

        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24">
          {COMPANY_CARDS.map((card) => (
            <article
              key={card.id}
              className="group relative aspect-[16/9] min-h-[220px] md:min-h-[300px] overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/75 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center select-none">
                <h3
                  className="text-xl md:text-2xl lg:text-3xl font-bold text-white uppercase"
                  style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif" }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-4 max-w-2xl text-[14px] md:text-[15px] text-white/95 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
