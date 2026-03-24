import React, { useState } from "react";

type FormState = {
  name: string;
  phone: string;
  email: string;
  destination: string;
  lookingFor: string;
  details: string;
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    destination: "",
    lookingFor: "",
    details: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);

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
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // UI-only form for now — replace this with an API call later.
    // eslint-disable-next-line no-console
    console.log("Contact form submit:", form);
    setSent(true);
    setForm({
      name: "",
      phone: "",
      email: "",
      destination: "",
      lookingFor: "",
      details: "",
    });
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
              value={form.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] border-gray-300"
            >
              <option value="">Destination Country</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>UAE</option>
              <option>Saudi Arabia</option>
              <option>Other</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="sr-only" htmlFor="cf-lookingfor">
              I&apos;m looking for...
            </label>
            <select
              id="cf-lookingfor"
              value={form.lookingFor}
              onChange={(e) => handleChange("lookingFor", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] border-gray-300"
            >
              <option value="">I&apos;m looking for...</option>
              <option>Job/Career Opportunities</option>
              <option>Armored Vehicle Purchase</option>
              <option>Armored Vehicle Rental</option>
              <option>Spare Parts</option>
              <option>Media Enquiry/Marketing</option>
            </select>
          </div>
        </div>

        <label className="sr-only" htmlFor="cf-details">
          Additional Details
        </label>
        <textarea
          id="cf-details"
          value={form.details}
          onChange={(e) => handleChange("details", e.target.value)}
          placeholder="Additional Details"
          rows={5}
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/40 text-[14px] border-gray-300 resize-vertical"
        />

        <button
          type="submit"
          className="w-full bg-red-700 hover:bg-red-800 text-white font-medium text-[14px] py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          GET A QUOTE
        </button>
      </form>
    </aside>
  );
}

