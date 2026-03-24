import fs from "fs";
import path from "path";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import VehicleCard from "../../../components/VehicleCard";
import ColorSelector from "../../../components/ColorSelector";
import { vehicles as canonicalVehicles, CATEGORIES } from "../../../data/vehicles";
import { categoryToSlug } from "../../../lib/getVehicleUrl";
import { buildBaseVehicleSpecRows } from "../../../lib/baseVehicleSpecs";
import VehicleName from "../../../components/VehicleName";
import { GetStaticPaths, GetStaticProps } from "next";

export interface VehicleColor {
  name: string;
  thumbnail: string;
  gallery?: string[];
  hex?: string;
}

export interface Vehicle {
  slug: string;
  title: string;
  shortDescription?: string;
  longDescription?: string;
  year?: number;
  make?: string;
  model?: string;
  armorLevel?: string;
  transmission?: string;
  engine?: string;
  horsepower?: string;
  drivetrain?: string;
  dimensions?: string;
  wheelbase?: string;
  seatingCapacity?: string | number;
  fuelCapacity?: string;
  thumbnail?: string;
  gallery?: string[];
  colors?: VehicleColor[];
  specs?: Record<string, string | number>;
  meta?: {
    title?: string;
    description?: string;
  };
}

type Props = {
  vehicle: Vehicle;
  category: string;
  slug: string;
  images: string[];
  similarVehicles: Vehicle[];
};

const ASSETS_BASE = "/images/vehicles";
const CTA_COLOR = "#8B0000";
const VEHICLE_FAQS = [
  {
    question: "CAN SENTINEL TITANS ARMOR MY CAR FOR ME?",
    answer:
      "Yes, SENTINEL TITANS can armor client-owned vehicles as well as supply armored vehicles including the base chassis as a single package. Please refer to SENTINEL TITANS armored vehicle lineup to confirm we can armor your chassis.",
  },
  {
    question: "CAN CIVILIANS OWN ARMORED VEHICLES?",
    answer:
      "Definitely, SENTINEL TITANS actively ships armored vehicles to civilians all over the world. Please check with your local jurisdiction or speak to one of our armored vehicle specialists to confirm applicability in your region.",
  },
  {
    question: "ARE SENTINEL TITANS ARMORED VEHICLES IN STOCK OR BUILT TO ORDER?",
    answer:
      "Both. SENTINEL TITANS maintains a ready-to-purchase inventory of armored vehicles to meet immediate demands, alongside offering made-to-order solutions. The available stock is varied to cater to a range of security levels and client preferences, ensuring a fit for various protective needs.",
  },
  {
    question: "WHY SHOULD I GET MY CAR ARMORED?",
    answer:
      "Acquiring an armored car from SENTINEL TITANS offers enhanced protection against threats such as kidnapping, smash & grab and gun violence while on the road. Whether you are a high-profile individual, operate in a volatile region, or require secure transportation for valuables, SENTINEL TITANS vehicles provide ballistic protection during daily transportation.",
  },
];

/** Merge canonical `data/vehicles.ts` fields when `data.json` omits specification rows. */
function mergeCatalogVehicleSpecs(vehicle: Vehicle, slug: string): Vehicle {
  const canon = canonicalVehicles.find((v) => v.slug === slug);
  if (!canon) return vehicle;

  const merged: Vehicle = { ...vehicle };

  const y = merged.year;
  if (y === undefined || y === null || y === 0) {
    merged.year = canon.year && canon.year > 0 ? canon.year : 2024;
  }

  merged.make = merged.make ?? canon.make;
  merged.model = merged.model ?? canon.model;

  const empty = (s: unknown) => s === undefined || s === null || String(s).trim() === "";
  if (empty(merged.armorLevel)) merged.armorLevel = canon.armorLevel;
  if (empty(merged.transmission)) merged.transmission = canon.transmission;
  if (empty(merged.engine)) merged.engine = canon.engine;
  if (empty(merged.horsepower)) merged.horsepower = canon.horsepower;
  if (empty(merged.drivetrain)) merged.drivetrain = canon.drivetrain;
  if (empty(merged.dimensions) && canon.dimensionsMM) merged.dimensions = canon.dimensionsMM;
  if (empty(merged.wheelbase) && canon.wheelbaseMM) merged.wheelbase = canon.wheelbaseMM;
  if (empty(merged.fuelCapacity)) merged.fuelCapacity = canon.fuelCapacity;
  if (merged.seatingCapacity === undefined || merged.seatingCapacity === null || empty(merged.seatingCapacity)) {
    if (canon.seatingCapacity !== undefined) {
      merged.seatingCapacity = canon.seatingCapacity;
    }
  }

  return merged;
}

function resolveImagePath(category: string, slug: string, value: string): string {
  if (value.startsWith("/")) return value;
  return `${ASSETS_BASE}/${category}/${slug}/${value}`;
}

function getEffectiveColorsForPage(vehicle: Vehicle): VehicleColor[] {
  if (vehicle.colors && vehicle.colors.length > 0) return vehicle.colors;
  const thumb = vehicle.thumbnail || "thumbnail.jpg";
  return [{ name: "Default", thumbnail: thumb }];
}

const VehiclePage: React.FC<Props> = ({ vehicle, category, slug, images, similarVehicles }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const effectiveColors = getEffectiveColorsForPage(vehicle);
  const hasExplicitColors = Boolean(vehicle.colors && vehicle.colors.length > 0);
  const selectedColor = effectiveColors[selectedColorIndex] ?? null;
  const categoryLabel =
    CATEGORIES.find((c) => categoryToSlug(c) === category)?.toUpperCase() || category.toUpperCase();

  const imagesForColor = useMemo(() => {
    if (hasExplicitColors) {
      if (selectedColor?.gallery?.length) {
        return selectedColor.gallery.map((f) => resolveImagePath(category, slug, f));
      }
      if (selectedColor?.thumbnail) {
        return [resolveImagePath(category, slug, selectedColor.thumbnail)];
      }
      return [];
    }
    return images;
  }, [hasExplicitColors, selectedColor, images, category, slug]);

  const thumbnailForColor = useMemo(() => {
    if (selectedColor?.thumbnail) return resolveImagePath(category, slug, selectedColor.thumbnail);
    return vehicle.thumbnail ? resolveImagePath(category, slug, vehicle.thumbnail) : "";
  }, [selectedColor, vehicle.thumbnail, category, slug]);

  const thumbnailIndex = thumbnailForColor
    ? imagesForColor.findIndex((i) => i === thumbnailForColor || i.endsWith(thumbnailForColor.split("/").pop() || ""))
    : -1;
  const initialIndex = thumbnailIndex >= 0 ? thumbnailIndex : 0;
  const [current, setCurrent] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrent(0);
  }, [selectedColorIndex]);

  const hero = imagesForColor.length
    ? imagesForColor[current]
    : hasExplicitColors
    ? thumbnailForColor
    : vehicle.gallery && vehicle.gallery.length
    ? `${ASSETS_BASE}/${category}/${slug}/${vehicle.gallery[0]}`
    : thumbnailForColor
    ? thumbnailForColor
    : "";

  const next = () => setCurrent((c) => (imagesForColor.length ? (c + 1) % imagesForColor.length : c));
  const prev = () => setCurrent((c) => (imagesForColor.length ? (c - 1 + imagesForColor.length) % imagesForColor.length : c));
  const goTo = (i: number) => setCurrent(i);

  useEffect(() => {
    // autoplay every 5s when not paused
    if (imagesForColor.length <= 1) return;
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    if (!isPaused) {
      autoplayRef.current = window.setInterval(() => {
        setCurrent((c) => (c + 1) % imagesForColor.length);
      }, 5000);
    }
    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [imagesForColor.length, isPaused]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imagesForColor.length]);

  const specRows = useMemo(() => buildBaseVehicleSpecRows(vehicle), [vehicle]);

  return (
    <main className="max-w-7xl mx-auto p-6">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/vehicles" className="hover:underline">Vehicles</Link> / <span>{categoryLabel}</span> / <span className="font-semibold">{vehicle.title || slug}</span>
      </nav>

      <header className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <h1 className="mb-4">
              {(vehicle.make || vehicle.model) ? (
                <VehicleName make={vehicle.make} model={vehicle.model} size="lg" />
              ) : (
                vehicle.title || slug
              )}
            </h1>

          <div
            className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-100"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img src={hero} alt={vehicle.title || "vehicle"} className="absolute inset-0 w-full h-full rounded-md object-cover" loading="lazy" />

            {/* Left/Right arrows */}
            {imagesForColor.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  aria-label="Next image"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="mt-4">
            <span className="text-sm font-medium text-gray-600 block mb-2">Color</span>
            <ColorSelector
              colors={effectiveColors}
              selectedIndex={selectedColorIndex}
              onSelect={setSelectedColorIndex}
            />
          </div>

          <div className="flex gap-3 mt-3 overflow-x-auto">
            {(hasExplicitColors
              ? imagesForColor
              : imagesForColor.length
              ? imagesForColor
              : (vehicle.gallery || []).map((f) => `${ASSETS_BASE}/${category}/${slug}/${f}`)
            ).map((img, idx) => (
              <button
                key={img}
                onClick={() => goTo(idx)}
                aria-label={`Show image ${idx + 1}`}
                aria-current={current === idx}
                className={`w-24 h-16 rounded overflow-hidden flex-shrink-0 focus:outline-none ${current === idx ? "ring-2 ring-offset-1 ring-black" : ""}`}
              >
                <img src={img} alt={`${vehicle.title} thumb ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          {vehicle.longDescription && (
            <section className="mt-6 prose max-w-none">
              <p>{vehicle.longDescription}</p>
            </section>
          )}
        </div>

        <aside className="bg-white border rounded-md p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Base vehicle specifications</h2>
          <div className="w-full text-sm">
            {specRows.map((row) => (
              <div key={row.label} className="py-1 flex items-center justify-between gap-3">
                <span className="text-gray-600">{row.label}</span>
                <span className="text-right">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <a
              href="mailto:info@sentineltitans.com"
              style={{ fontFamily: "Saira, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontWeight: 600 }}
              className="group block text-center bg-white border border-black text-black py-2 rounded-none transition-colors duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/40 hover:bg-black hover:border-white hover:text-white disabled:opacity-50 disabled:pointer-events-none text-[14px] uppercase"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <img src="/images/icons/mail.svg" alt="Mail" className="inline-block w-5 h-5 brightness-0 group-hover:invert" />
                <span>SUBMIT AN INQUIRY</span>
              </span>
            </a>
            <a
              href="tel:"
              style={{ fontFamily: "Saira, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontWeight: 600 }}
              className="group block text-center bg-white border border-black text-black py-2 rounded-none transition-colors duration-150 hover:bg-black hover:border-white hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/40 disabled:opacity-50 disabled:pointer-events-none text-[14px] uppercase"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <img src="/images/icons/call.svg" alt="Call" className="inline-block w-5 h-5 brightness-0 group-hover:invert" />
                <span>CALL NOW</span>
              </span>
            </a>
            <a
              href="#"
              style={{ backgroundColor: "#43A700", border: `2px solid #43A700`, fontFamily: "Saira, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontWeight: 600 }}
              className="block text-center text-white py-2 rounded-none transition-colors duration-150 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40 disabled:opacity-50 disabled:pointer-events-none text-[14px] uppercase"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <img src="/images/icons/whatsapp.svg" alt="WhatsApp" className="inline-block w-4 h-4 align-middle" />
                <span>WHATSAPP</span>
              </span>
            </a>
          </div>
        </aside>
      </header>

      <section className="mt-20 px-6 py-8 text-center md:px-10">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-black uppercase">PRECISION ENGINEERED</p>
        <h2 className="mt-2 text-[32px] font-semibold uppercase tracking-wide text-[#8B0000] md:text-4xl">360° PROTECTION</h2>
        <p className="mx-auto mt-4 max-w-4xl text-[14px] leading-relaxed text-gray-700">
          Sentinel Titans expertly crafts armored vehicles using exclusively high-quality certified ballistic materials
          to provide comprehensive passenger protection.
        </p>
        <img
          src="/images/vehicle-detail/armoring.png"
          alt="Armored vehicle protection layers"
          className="mx-auto mt-6 w-full max-w-3xl h-auto opacity-75 [transform:scaleX(-1)]"
          loading="lazy"
        />
      </section>

      <section className="mt-16 px-6 md:px-10">
        <h2 className="text-center text-[32px] font-semibold uppercase tracking-wide text-[#8B0000] md:text-4xl">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <div className="mx-auto mt-8 max-w-4xl divide-y divide-gray-200 border-y border-gray-200">
          {VEHICLE_FAQS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            const panelId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;
            return (
              <div key={item.question} className="py-2">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between py-4 text-left text-[14px] font-semibold text-black uppercase focus:outline-none focus:ring-2 focus:ring-black/30"
                >
                  <span>{item.question}</span>
                  <span className="ml-4 text-xl leading-none">{isOpen ? "−" : "+"}</span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={`overflow-hidden pr-8 text-[14px] leading-relaxed text-gray-700 normal-case transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48 pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div id="inquiry" className="h-0" aria-hidden="true" />
      {similarVehicles && similarVehicles.length > 0 && (
        <section className="mt-24 max-w-7xl mx-auto p-6">
          <h3 className="text-2xl font-semibold mb-6">Similar Vehicles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVehicles.map((v) => (
              <VehicleCard key={v.slug} vehicle={v as any} category={category} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const vehiclesDir = path.join(process.cwd(), "public", "images", "vehicles");
  const paths: { params: { category: string; slug: string } }[] = [];

  if (fs.existsSync(vehiclesDir)) {
    const categories = fs.readdirSync(vehiclesDir);
    for (const category of categories) {
      const catPath = path.join(vehiclesDir, category);
      if (!fs.statSync(catPath).isDirectory()) continue;
      const slugs = fs.readdirSync(catPath);
      for (const slug of slugs) {
        const slugPath = path.join(catPath, slug);
        if (!fs.statSync(slugPath).isDirectory()) continue;
        paths.push({ params: { category, slug } });
        // Also add a legacy alias with "-cit" suffix for the cash-in-transit category
        // to support older links that used "cash-in-transit-cit".
        if (category === "cash-in-transit") {
          paths.push({ params: { category: `${category}-cit`, slug } });
        }
      }
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = String(params?.category || "");
  const slug = String(params?.slug || "");
  // Resolve base folder for images. Support legacy category slugs (e.g., "cash-in-transit-cit")
  // by falling back to a cleaned category name if the exact folder doesn't exist.
  let base = path.join(process.cwd(), "public", "images", "vehicles", category, slug);

  if (!fs.existsSync(base)) {
    // Try removing a trailing "-cit" (case-insensitive) from category and check again.
    const altCategory = category.replace(/-cit$/i, "");
    const altBase = path.join(process.cwd(), "public", "images", "vehicles", altCategory, slug);
    if (fs.existsSync(altBase)) {
      base = altBase;
    }
  }

  let vehicle: Vehicle = { slug, title: slug };
  let images: string[] = [];

  if (fs.existsSync(base)) {
    // Read image files but ignore macOS AppleDouble sidecar files (names starting with "._")
    const files = fs
      .readdirSync(base)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !f.startsWith("._") && !f.startsWith("."));
    files.sort();
    for (const f of files) {
      images.push(`/images/vehicles/${path.basename(path.dirname(base))}/${slug}/${f}`);
    }

    const dataJson = path.join(base, "data.json");
    if (fs.existsSync(dataJson)) {
      try {
        const raw = fs.readFileSync(dataJson, "utf8");
        const parsed = JSON.parse(raw);
        vehicle = { ...vehicle, ...parsed };
      } catch (e) {
        // ignore parse errors, use defaults
      }
    } else {
      // If no data.json, pick first image as thumbnail
      vehicle.thumbnail = files.length ? files[0] : undefined;
    }
    // Exclude the thumbnail file from the images array if specified in data.json
    if (vehicle.thumbnail) {
      images = images.filter((p) => !p.endsWith(`/${vehicle.thumbnail}`));
    }
  }
  vehicle = mergeCatalogVehicleSpecs(vehicle, slug);

  // Find up to 3 similar vehicles from the canonical vehicles list (exclude current slug)
  const allSameCategory = canonicalVehicles.filter((v) => v.category && categoryToSlug(v.category) === category);
  const similarVehicles = allSameCategory.filter((v) => v.slug !== slug).slice(0, 3);

  // Sanitize for JSON serialization (Next.js cannot serialize undefined)
  const sanitizedVehicle = JSON.parse(JSON.stringify(vehicle, (_, v) => (v === undefined ? null : v)));

  return {
    props: {
      vehicle: sanitizedVehicle,
      category,
      slug,
      images,
      similarVehicles,
    },
  };
};

export default VehiclePage;

