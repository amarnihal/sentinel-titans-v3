/** Public asset: place your brochure PDF at `public/brochure/sentinel-titans-catalogue.pdf` */

export const CATALOGUE_BROCHURE_URL = "/brochure/sentinel-titans-catalogue.pdf"
export const CATALOGUE_BROCHURE_FILENAME = "Sentinel-Titans-Catalogue.pdf"

/**
 * Triggers a browser download of the catalogue PDF (same-origin).
 * Returns false if the file is missing or fetch fails — form success can still be shown.
 */
export async function downloadCatalogueBrochure(): Promise<boolean> {
  try {
    const res = await fetch(CATALOGUE_BROCHURE_URL)
    if (!res.ok) return false
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = CATALOGUE_BROCHURE_FILENAME
    a.rel = "noopener"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    return true
  } catch {
    return false
  }
}
