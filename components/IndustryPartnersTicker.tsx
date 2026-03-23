const BRAND_LOGOS = [
  "audi-svgrepo-com.svg",
  "cadillac-svgrepo-com.svg",
  "chevrolet-svgrepo-com.svg",
  "ford-svgrepo-com.svg",
  "gmc-svgrepo-com.svg",
  "hyundai-svgrepo-com.svg",
  "infiniti-svgrepo-com.svg",
  "isuzu-svgrepo-com.svg",
  "iveco-svgrepo-com.svg",
  "jaguar-alt-svgrepo-com.svg",
  "jeep-alt-svgrepo-com.svg",
  "land-rover-svgrepo-com.svg",
  "lexus-svgrepo-com.svg",
  "man-svgrepo-com.svg",
  "mazda-alt-svgrepo-com.svg",
  "mercedes-benz-alt-svgrepo-com.svg",
  "mitsubishi-svgrepo-com.svg",
  "nissan-svgrepo-com.svg",
  "porsche-svgrepo-com.svg",
  "ram-svgrepo-com.svg",
  "rolls-royce-svgrepo-com.svg",
  "scania-svgrepo-com.svg",
  "toyota-svgrepo-com.svg",
  "volkswagen-svgrepo-com.svg",
  "volvo_logo_icon_145763.svg",
];

const LOGOS_BASE = "/images/brands";

export default function IndustryPartnersTicker() {
  return (
    <section className="py-24 md:py-32 bg-page w-full overflow-hidden">
      <h2
        className="text-2xl md:text-3xl font-bold mb-8 text-center text-black"
        style={{ fontFamily: "'Saira', Inter, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif" }}
      >
        OUR INDUSTRY PARTNERS
      </h2>

      <div className="relative overflow-hidden">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div
            className="flex items-center gap-24 md:gap-32 shrink-0 animate-ticker"
            aria-hidden="true"
          >
            {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) => (
              <div
                key={`${logo}-${i}`}
                className={`flex-shrink-0 flex items-center justify-center opacity-50 [filter:brightness(0)] ${
                  logo === "volvo_logo_icon_145763.svg" ? "w-28 h-28 md:w-36 md:h-36" : "w-20 h-20 md:w-24 md:h-24"
                }`}
              >
                <img
                  src={`${LOGOS_BASE}/${logo}`}
                  alt=""
                  className={`max-w-full max-h-full object-contain ${
                    logo === "volvo_logo_icon_145763.svg" ? "scale-150" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
