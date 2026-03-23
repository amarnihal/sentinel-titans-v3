import fs from "fs";
import path from "path";
import React, { useEffect, useMemo, useRef, useState } from "react";
import VehicleCard from "../../../components/VehicleCard";
import ColorSelector from "../../../components/ColorSelector";
import { vehicles as canonicalVehicles } from "../../../data/vehicles";
import { categoryToSlug } from "../../../lib/getVehicleUrl";
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
  seatingCapacity?: string;
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

/** Shown when a vehicle has no specs in data.json (replace with real data per vehicle). */
const DUMMY_BASE_VEHICLE_SPECS: Array<{ label: string; value: string | number }> = [
  { label: "Year", value: "On request" },
  { label: "Make", value: "On request" },
  { label: "Model", value: "On request" },
  { label: "Armor Level", value: "On request" },
  { label: "Transmission", value: "On request" },
  { label: "Engine", value: "On request" },
  { label: "Horsepower", value: "On request" },
  { label: "Drivetrain", value: "On request" },
  { label: "Dimensions (mm)", value: "On request" },
  { label: "Wheelbase (mm)", value: "On request" },
  { label: "Seating Capacity", value: "On request" },
  { label: "Fuel Capacity", value: "On request" },
];

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
  const effectiveColors = getEffectiveColorsForPage(vehicle);
  const hasExplicitColors = Boolean(vehicle.colors && vehicle.colors.length > 0);
  const selectedColor = effectiveColors[selectedColorIndex] ?? null;

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

  const specRowsFromData: Array<{ label: string; value: string | number }> = [
    { label: "Year", value: vehicle.year as number },
    { label: "Make", value: vehicle.make as string },
    { label: "Model", value: vehicle.model as string },
    { label: "Armor Level", value: vehicle.armorLevel as string },
    { label: "Transmission", value: vehicle.transmission as string },
    { label: "Engine", value: vehicle.engine as string },
    { label: "Horsepower", value: vehicle.horsepower as string },
    { label: "Drivetrain", value: vehicle.drivetrain as string },
    { label: "Dimensions (mm)", value: vehicle.dimensions as string },
    { label: "Wheelbase (mm)", value: vehicle.wheelbase as string },
    { label: "Seating Capacity", value: vehicle.seatingCapacity as string },
    { label: "Fuel Capacity", value: vehicle.fuelCapacity as string },
  ].filter((row) => row.value !== undefined && row.value !== null && String(row.value).trim() !== "");

  const specRows = specRowsFromData.length > 0 ? specRowsFromData : DUMMY_BASE_VEHICLE_SPECS;

  return (
    <main className="max-w-7xl mx-auto p-6">
      <nav className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:underline">Home</a> / <a href="/vehicles" className="hover:underline">Vehicles</a> / <span className="capitalize">{category}</span> / <span className="font-semibold">{vehicle.title || slug}</span>
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
              href="#inquiry"
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

      <section id="inquiry" className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Contact about this vehicle</h3>
        <p className="text-sm text-gray-600 mb-4">We'll add a full contact form later. For now use the inquiry CTA.</p>
      </section>
      {similarVehicles && similarVehicles.length > 0 && (
        <section className="mt-12 max-w-7xl mx-auto p-6">
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

