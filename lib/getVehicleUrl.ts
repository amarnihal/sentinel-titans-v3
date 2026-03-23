export function categoryToSlug(category: string) {
  // Remove parenthetical annotations (e.g. "CASH-IN-TRANSIT (CIT)") so folder
  // names like "cash-in-transit" continue to match generated slugs.
  const cleaned = category.replace(/\s*\(.*?\)\s*/g, "");
  return cleaned.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getVehicleUrl(category: string, slug: string) {
  const cat = categoryToSlug(category);
  return `/vehicles/${cat}/${slug}`;
}

export function getVehicleLabel(make?: string, model?: string) {
  if (!make) return model || "";
  if (!model || model.trim() === "" || model.trim().toLowerCase() === make.trim().toLowerCase()) return make;
  return `${make} ${model}`;
}

/** Split make/model for display. Brand first, model below. Model omitted when empty or same as brand. */
export function getBrandAndModel(make?: string, model?: string): { brand: string; model: string } {
  const brand = make || "";
  const hasModel =
    model &&
    model.trim() !== "" &&
    model.trim().toLowerCase() !== (make || "").trim().toLowerCase();
  return { brand, model: hasModel ? model.trim() : "" };
}

