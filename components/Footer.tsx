"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/router"
import { contactInfo } from "../data/contact"

export default function Footer() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  async function onNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setSubmitError("")

    const formData = new FormData(event.currentTarget)
    const body = new URLSearchParams()
    formData.forEach((value, key) => {
      if (typeof value === "string") body.append(key, value)
    })
    // Netlify honeypot must be present and empty on AJAX submits
    if (!body.has("bot-field")) body.append("bot-field", "")

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      })

      if (!response.ok) {
        throw new Error("Newsletter submission failed")
      }

      await router.push("/thank-you")
    } catch {
      setSubmitError("Could not submit right now. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-black text-white mt-16">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-16">
          {/* Newsletter */}
          <div className="lg:pr-4">
            <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">
              Stay updated
            </h3>
            <p className="text-[14px] text-white/70 leading-relaxed max-w-sm">
              By enrolling in our corporate newsletter, you will consistently stay informed about our most recent promotions, exclusive deals, and updated vehicle inventory.
            </p>

            <form
              name="newsletter"
              method="post"
              action="/__forms.html"
              onSubmit={onNewsletterSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input type="hidden" name="form-name" value="newsletter" />
              <input
                type="hidden"
                name="subject"
                value="Newsletter signup — %{siteName} (%{submissionId})"
              />
              <input type="hidden" name="bot-field" value="" />
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 min-w-0 px-4 py-3 text-[14px] bg-white/5 border border-white/15 rounded focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-[13px] font-medium tracking-wider bg-white text-black rounded hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors shrink-0 disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting ? "SUBMITTING..." : "SUBSCRIBE"}
              </button>
            </form>
            {submitError && (
              <p className="mt-3 text-[13px] text-red-300">{submitError}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {contactInfo.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="inline-flex items-center gap-3 text-[14px] text-white/85 hover:text-white transition-colors">
                    <svg className="w-4 h-4 shrink-0 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={contactInfo.email.href} className="inline-flex items-center gap-3 text-[14px] text-white/85 hover:text-white transition-colors">
                  <svg className="w-4 h-4 shrink-0 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {contactInfo.email.label}
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">
              Address
            </h3>
            <address className="not-italic text-[14px] text-white/70 leading-relaxed">
              WAREHOUSE No (4)<br />
              JABEL ALI MAXI MIX PHASE 2,<br />
              Plot No. 599-737<br />
              Jabel Ali Industrial First,<br />
              Post Box 261141
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar: Logo + Socials */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <img src="/logo.svg" alt="Sentinel Titans" className="h-9 w-auto opacity-95" />

          <div className="flex items-center gap-6">
            <a href="#" aria-label="Facebook" className="text-white/60 hover:text-white transition-colors">
              <img src="/images/social-media/facebook.svg" alt="" className="h-5 w-5" style={{ filter: "invert(1)" }} />
            </a>
            <a href="#" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors">
              <img src="/images/social-media/instagram.svg" alt="" className="h-5 w-5" style={{ filter: "invert(1)" }} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-white/60 hover:text-white transition-colors">
              <img src="/images/social-media/linkedin.svg" alt="" className="h-5 w-5" style={{ filter: "invert(1)" }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
