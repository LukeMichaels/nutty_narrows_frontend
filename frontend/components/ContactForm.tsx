"use client";

import { useState, type FormEvent } from "react";

const SUBJECTS = [
  "General Question",
  "Artist Submission",
  "Press/Media",
  "Other",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<
    "idle" | "submitting" | "sent" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "sent") {
    return (
      <p className="contact-form__success">
        Thanks for reaching out — we&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="contact-form__honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <label className="contact-form__field">
        <span>Name*</span>
        <input
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="contact-form__field">
        <span>Email Address*</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="contact-form__field">
        <span>Subject</span>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select a subject (optional)</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="contact-form__field">
        <span>Message</span>
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      {error && <p className="contact-form__error">{error}</p>}

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
