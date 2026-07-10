"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Github, Linkedin, Instagram, Twitter } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ============ NAVBAR ============ */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100">
        <Link href="/" className="text-xl font-black tracking-tight text-black">
          BingeStudy
        </Link>
        <Link
          href="/login"
          className="text-sm font-semibold text-black border border-gray-200 px-5 py-2 rounded-full hover:border-black transition-all duration-200"
        >
          Login
        </Link>
      </nav>

      {/* ============ HEADER ============ */}
      <section className="px-6 md:px-10 pt-16 pb-10 max-w-3xl mx-auto">
        <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
          Get In Touch
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-gray-400 text-sm max-w-md">
          Questions, feedback, or just want to say hi? Send a message below or
          reach out directly.
        </p>
      </section>

      {/* ============ FORM + INFO ============ */}
      <section className="px-6 md:px-10 pb-20 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5 block"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5 block"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5 block"
            >
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
            <Send size={15} />
          </button>

          {status === "sent" && (
            <p className="text-sm text-green-600 font-medium">
              Message sent — we'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 font-medium">
              Something went wrong. Try again or email us directly.
            </p>
          )}
        </form>

        {/* Info / Socials */}
        <div className="bg-black rounded-2xl p-7 h-fit">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">
            Direct Contact
          </span>
          <a
            href="mailto:bingestudy.app@gmail.com"
            className="text-white font-semibold text-sm mb-6 block hover:text-lime-300 transition-colors"
          >
            bingestudy.app@gmail.com
          </a>

          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">
            Find Us
          </span>
          <div className="flex items-center gap-3">
            <SocialIcon href="https://github.com/aswinsankartk/" label="GitHub">
              <Github size={18} />
            </SocialIcon>
            <SocialIcon
              href="https://linkedin.com/in/aswinsankartk"
              label="LinkedIn"
            >
              <Linkedin size={18} />
            </SocialIcon>
            <SocialIcon
              href="https://instagram.com/bingestudyapp"
              label="Instagram"
            >
              <Instagram size={18} />
            </SocialIcon>
            {/* <SocialIcon href="https://x.com/bingestudyapp" label="X">
              <Twitter size={18} />
            </SocialIcon> */}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-10 py-6 bg-black">
        <Link href="/" className="text-sm font-black text-white">
          BingeStudy
        </Link>
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
        <span className="text-xs text-gray-500">
          © 2026 BingeStudy. Built for students.
        </span>
      </footer>
    </main>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-xl flex items-center justify-center text-white hover:border-lime-300 hover:text-lime-300 transition-colors"
    >
      {children}
    </a>
  );
}
