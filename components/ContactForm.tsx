import React, { useState } from "react";

type FormState = {
  name: string;
  phone: string;
  email: string;
  destination: string;
  lookingFor: string;
  details: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  lookingFor: "",
  details: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.phone.trim()) e.phone = "Please enter a phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    setSubmitError("");

    const body = new URLSearchParams();
    body.append("form-name", "vehicles-contact");
    body.append(
      "subject",
      "Vehicles page contact — %{siteName} (%{submissionId})"
    );
    body.append("name", form.name.trim());
    body.append("phone", form.phone.trim());
    body.append("email", form.email.trim());
    body.append("destination", form.destination);
    body.append("looking_for", form.lookingFor);
    body.append("details", form.details.trim());
    body.append("bot-field", "");

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) throw new Error("submit failed");

      setSent(true);
      setForm({ ...emptyForm });
    } catch {
      setSubmitError("Could not submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="w-full max-w-md bg-page border border-gray-200 p-4 rounded-md shadow-sm text-[14px]">
      <h3 className="text-xl font-semibold mb-3">CONTACT US</h3>
      <p className="text-sm text-gray-600 mb-4">
        For more information about available armored vehicles, please fill out
        the form below
      </p>

      {sent && (
        <div className="mb-4 p-3 bg-green-50 text-green-800 rounded">
          Thank you — your request was received.
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor="cf-name">
          Name
        </label>
        <input
          id="cf-name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Name"
          className={`w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <div className="text-red-600 text-sm mb-2">{errors.name}</div>
        )}

        <label className="sr-only" htmlFor="cf-phone">
          Phone
        </label>
        <input
          id="cf-phone"
          name="phone"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Phone Number"
          type="tel"
          className={`w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone && (
          <div className="text-red-600 text-sm mb-2">{errors.phone}</div>
        )}

        <label className="sr-only" htmlFor="cf-email">
          Email
        </label>
        <input
          id="cf-email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email"
          type="email"
          className={`w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <div className="text-red-600 text-sm mb-2">{errors.email}</div>
        )}

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="sr-only" htmlFor="cf-destination">
              Destination Country
            </label>
            <select
              id="cf-destination"
              name="destination"
              value={form.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] border-gray-300"
            >
              <option value="">Destination Country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="UAE">UAE</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="sr-only" htmlFor="cf-lookingfor">
              I&apos;m looking for...
            </label>
            <select
              id="cf-lookingfor"
              name="looking_for"
              value={form.lookingFor}
              onChange={(e) => handleChange("lookingFor", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] border-gray-300"
            >
              <option value="">I&apos;m looking for...</option>
              <option value="Armored Vehicle Purchase">
                Armored Vehicle Purchase
              </option>
              <option value="Armored Vehicle Rental">
                Armored Vehicle Rental
              </option>
              <option value="Spare Parts">Spare Parts</option>
              <option value="Media Enquiry/Marketing">
                Media Enquiry/Marketing
              </option>
            </select>
          </div>
        </div>

        <label className="sr-only" htmlFor="cf-details">
          Additional Details
        </label>
        <textarea
          id="cf-details"
          name="details"
          value={form.details}
          onChange={(e) => handleChange("details", e.target.value)}
          placeholder="Additional Details"
          rows={5}
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] border-gray-300 resize-vertical"
        />

        {submitError && (
          <p className="text-red-600 text-sm mb-3" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#8B0000] hover:bg-[#6d0000] text-white font-medium text-[14px] py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-60 disabled:pointer-events-none transition-colors"
        >
          {submitting ? "SUBMITTING…" : "GET A QUOTE"}
        </button>
      </form>
    </aside>
  );
}
