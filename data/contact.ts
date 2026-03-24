/** Canonical contact info used across the site (Header dropdown, Footer) */
export type ContactPhone = {
  label: string
  href: string
  /** Company / main line uses a briefcase icon; default is handset. */
  icon?: "phone" | "briefcase"
}

export const contactInfo = {
  phones: [
    { label: "+971 54 563 7533", href: "tel:+971545637533" },
    { label: "+971 50 706 7439", href: "tel:+971507067439" },
    {
      label: "+971 43 43 4772",
      href: "tel:+97143434772",
      icon: "briefcase" as const,
    },
  ] satisfies ContactPhone[],
  email: { label: "info@sentinel-titans.com", href: "mailto:info@sentinel-titans.com" },
}
