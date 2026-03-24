"use client"

import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export default function CatalogueRequestModal() {
  const titleId = useId()
  const emailInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const close = useCallback(() => {
    setOpen(false)
    setEmail("")
    setError("")
    setSent(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, close])

  useEffect(() => {
    if (open && !sent) {
      const t = window.setTimeout(() => emailInputRef.current?.focus(), 0)
      return () => window.clearTimeout(t)
    }
  }, [open, sent])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setError("")
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setSubmitting(true)
    try {
      const body = new URLSearchParams()
      body.append("form-name", "catalogue")
      body.append("email", email.trim())
      body.append("bot-field", "")

      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      })

      if (!response.ok) throw new Error("submit failed")

      setSent(true)
      setEmail("")
    } catch {
      setError("Could not submit right now. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          setSent(false)
          setError("")
        }}
        className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium text-white bg-transparent border border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors"
        style={{
          fontFamily:
            "'Saira', Inter, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        }}
      >
        REQUEST CATALOGUE
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70"
          role="presentation"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) close()
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-md rounded-md border border-gray-200 bg-page p-6 shadow-xl text-[14px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/20"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <h2 id={titleId} className="text-xl font-semibold mb-2 pr-10">
              Request catalogue
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email and we&apos;ll send you our product catalogue.
            </p>

            {sent ? (
              <div className="p-3 bg-green-50 text-green-800 rounded text-sm">
                Thank you — we&apos;ll send the catalogue to your inbox shortly.
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <label htmlFor="catalogue-email" className="sr-only">
                  Email address
                </label>
                <input
                  ref={emailInputRef}
                  id="catalogue-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  placeholder="you@example.com"
                  className={`w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black/20 text-[14px] ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {error && (
                  <p className="text-red-600 text-sm mb-3" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded text-[14px] font-medium text-white bg-[#8B0000] hover:bg-[#6d0000] focus:outline-none focus:ring-2 focus:ring-black/30 disabled:opacity-60 disabled:pointer-events-none transition-colors"
                >
                  {submitting ? "SUBMITTING…" : "SUBMIT"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
