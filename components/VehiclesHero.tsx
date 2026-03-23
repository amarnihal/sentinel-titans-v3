import Image from "next/image"

type VehiclesHeroProps = {
  src?: string
  alt?: string
}

export default function VehiclesHero({ src = "/images/vehicles-hero/vehicleshero1.jpeg", alt = "All vehicles" }: VehiclesHeroProps) {
  return (
    <section className="w-full relative overflow-hidden">
      <div className="w-full h-[29vh] md:h-[38vh] relative">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </section>
  )
}

