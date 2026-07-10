import Link from "next/link";
import {
  FileText,
  Link2,
  Mic,
  Bot,
  Users,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Send,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Image from "next/image";

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BingeStudy",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "Create private study groups, share notes and materials in real time, and get instant answers from an AI assistant.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: "https://bingestudy.vercel.app",
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ============ NAVBAR ============ */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100 dark:border-gray-800 dark:bg-gray-950">
        <span className="text-xl font-black tracking-tight text-black dark:text-white">
          BingeStudy
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-black dark:text-white border border-gray-200 dark:border-gray-700 px-5 py-2 rounded-full hover:border-black dark:hover:border-white transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative px-6 md:px-10 pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_70%_60%_at_70%_20%,#000_40%,transparent_100%)] pointer-events-none dark:opacity-30" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-gray-100 dark:bg-gray-800 rounded-full blur-3xl opacity-50 animate-drift pointer-events-none" />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span
              className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5 animate-fade-in-up"
              style={{ animationFillMode: "backwards" }}
            >
              For Students, By Students
            </span>

            <h1
              className="text-[2.75rem] sm:text-6xl md:text-7xl font-black text-black dark:text-white leading-[0.95] tracking-tight mb-6 animate-fade-in-up"
              style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
            >
              STUDY
              <br />
              TOGETHER.
              <br />
              <span className="text-black dark:text-white">STUDY</span>
              <br />
              SMARTER.
            </h1>

            <p
              className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-md mb-8 animate-fade-in-up"
              style={{
                animationDelay: "160ms",
                animationFillMode: "backwards",
              }}
            >
              Create private study groups, share notes and materials in real
              time, and get instant answers from an AI assistant — all in one
              place.
            </p>

            <div
              className="flex items-center gap-6 animate-fade-in-up"
              style={{
                animationDelay: "240ms",
                animationFillMode: "backwards",
              }}
            >
              <Link
                href="/login"
                className="bg-black dark:bg-white text-white dark:text-black text-sm font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-200"
              >
                Get Started — It's Free
              </Link>
              <a
                href="#features"
                className="flex items-center gap-1.5 text-sm font-semibold text-black dark:text-white hover:gap-2.5 transition-all duration-200"
              >
                Learn More <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* Right: orbital diagram */}
          <div
            className="relative h-[420px] hidden md:block animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full animate-spin-slow"
              fill="none"
              style={{ transformOrigin: "center" }}
            >
              <circle
                cx="200"
                cy="200"
                r="165"
                stroke="#E5E5E5"
                strokeDasharray="3 6"
                strokeWidth="1.5"
              />
              <circle
                cx="200"
                cy="200"
                r="100"
                stroke="#E5E5E5"
                strokeDasharray="3 6"
                strokeWidth="1.5"
              />
              <circle
                cx="365"
                cy="60"
                r="2"
                fill="#D4D4D4"
                className="animate-pulse-soft"
              />
              <circle
                cx="40"
                cy="120"
                r="2"
                fill="#D4D4D4"
                className="animate-pulse-soft"
                style={{ animationDelay: "1s" }}
              />
              <circle
                cx="370"
                cy="300"
                r="2"
                fill="#D4D4D4"
                className="animate-pulse-soft"
                style={{ animationDelay: "0.5s" }}
              />
              <circle
                cx="60"
                cy="330"
                r="2"
                fill="#D4D4D4"
                className="animate-pulse-soft"
                style={{ animationDelay: "1.5s" }}
              />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black font-black text-2xl shadow-xl shadow-black/20">
              B
            </div>

            <OrbitNode
              icon={<FileText size={18} />}
              label="PDFs"
              style={{ top: "4%", left: "62%" }}
            />
            <OrbitNode
              icon={<Sparkles size={18} />}
              label="AI Assistant"
              style={{ top: "16%", left: "84%" }}
            />
            <OrbitNode
              icon={<Users size={18} />}
              label="Study Groups"
              style={{ top: "62%", left: "84%" }}
            />
            <OrbitNode
              icon={<MessageCircle size={18} />}
              label="Real-Time Chat"
              style={{ top: "78%", left: "58%" }}
            />
            <OrbitNode
              icon={<Mic size={18} />}
              label="Audio"
              style={{ top: "62%", left: "8%" }}
            />
            <OrbitNode
              icon={<Link2 size={18} />}
              label="Links & URLs"
              style={{ top: "16%", left: "8%" }}
            />
          </div>
        </div>
      </section>

      {/* ============ PROBLEM / SOLUTION SPLIT ============ */}
      <Reveal>
        <section className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-100 dark:border-gray-800">
          <div className="px-6 md:px-10 py-14 flex flex-col justify-center bg-white dark:bg-gray-950">
            <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white leading-tight mb-3">
              Students waste hours switching between apps.
            </h2>
            <p className="text-gray-400 text-sm">
              Too many tabs. Too many tools.
              <br />
              Not enough time to actually study.
            </p>
          </div>

          <div className="bg-black px-6 md:px-10 py-14 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <AppIcon label="Notes">
                <FileText size={20} />
              </AppIcon>
              <AppIcon label="WhatsApp">
                <WhatsAppIcon />
              </AppIcon>
              <AppIcon label="Drive">
                <DriveIcon />
              </AppIcon>
              <AppIcon label="Telegram">
                <TelegramIcon />
              </AppIcon>
              <AppIcon label="ChatGPT">
                <Bot size={20} />
              </AppIcon>
              <ArrowRight size={20} className="text-gray-500 mx-1 shrink-0" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              BingeStudy combines
              <br />
              <span className="text-lime-300">everything.</span>
            </h3>
          </div>
        </section>
      </Reveal>

      {/* ============ PRODUCT SHOWCASE ============ */}
      <Reveal>
        <section
          id="features"
          className="px-6 md:px-10 py-20 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.6fr_0.7fr] gap-8 items-center">
              <div className="flex flex-col gap-10 lg:text-right order-2 lg:order-1">
                <Annotation
                  number="01"
                  title="Share Notes"
                  description="Upload PDFs, images, audio, docs and links instantly."
                  align="right"
                />
                <Annotation
                  number="02"
                  title="Real-Time Chat"
                  description="Discuss, ask, and learn together in real time."
                  align="right"
                />
              </div>

              <div className="order-1 lg:order-2 animate-fade-in-up transition-transform duration-500 hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-2deg)_scale(1.02)]">
                <LaptopMockup />
              </div>

              <div className="flex flex-col gap-10 order-3">
                <Annotation
                  number="03"
                  title="AI Assistant"
                  description="Ask doubts. Get instant answers powered by Gemini."
                  align="left"
                />
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 w-fit">
                  <Sparkles size={13} /> Powered by Gemini
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ============ MARQUEE STRIP ============ */}
      <div className="bg-black overflow-hidden py-4 border-y border-gray-900 group">
        <div className="flex w-max animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] transition-all">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className="flex items-center text-sm font-bold text-white tracking-wide shrink-0"
              >
                {Array(4)
                  .fill([
                    "PDFS",
                    "AUDIO",
                    "LINKS",
                    "NOTES",
                    "AI",
                    "GROUPS",
                    "REAL-TIME",
                  ])
                  .flat()
                  .map((word, j) => (
                    <span key={j} className="flex items-center">
                      <span className="px-4">{word}</span>
                      <span className="text-lime-300">•</span>
                    </span>
                  ))}
              </span>
            ))}
        </div>
      </div>

      {/* ============ STATS ROW ============ */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <Reveal>
          <Stat
            number="01"
            label="Platform"
            description="All your study needs. One place."
          />
        </Reveal>
        <Reveal delay={100}>
          <Stat
            number="04+"
            label="Content Types"
            description="PDFs, audio, docs, links, and more."
            divider
          />
        </Reveal>
        <Reveal delay={200}>
          <Stat
            number="∞"
            label="Possibilities"
            description="Learn, collaborate, achieve together."
            divider
            isInfinity
          />
        </Reveal>
      </section>

      {/* ============ ASK ANYTHING ============ */}
      <section className="relative bg-black px-6 md:px-10 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.07] [mask-image:radial-gradient(circle_at_70%_50%,#000_0%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              ASK.
              <br />
              ANYTHING.
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mb-6">
              Your AI study assistant is always here to help.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 border border-gray-700 rounded-full px-4 py-2 w-fit">
              <Sparkles size={13} className="text-lime-300" /> Powered by Gemini
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-full px-4 py-3 mb-4">
              <span className="text-gray-300 text-sm flex-1">
                What is DBSCAN?
              </span>
              <Send size={15} className="text-gray-500" />
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-lime-300 text-black p-1.5 rounded-lg shrink-0 mt-0.5">
                <Sparkles size={13} />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                DBSCAN (Density-Based Spatial Clustering of Applications with
                Noise) is an unsupervised machine learning algorithm used for
                clustering. It groups points that are closely packed together
                and marks outliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURE GRID + BUILT BY STUDENTS ============ */}
      <section className="px-6 md:px-10 py-16 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Reveal delay={0}>
              <FeatureCard
                icon={<Sparkles size={18} />}
                title="AI Assistant"
                description="Instant answers to any academic doubt."
              />
            </Reveal>
            <Reveal delay={60}>
              <FeatureCard
                icon={<MessageCircle size={18} />}
                title="Real-Time Collaboration"
                description="Chat, discuss and solve together."
              />
            </Reveal>
            <Reveal delay={120}>
              <FeatureCard
                icon={<Users size={18} />}
                title="Private Groups"
                description="Learn in a focused, distraction-free space."
              />
            </Reveal>
            <Reveal delay={180}>
              <FeatureCard
                icon={<Mic size={18} />}
                title="Audio Support"
                description="Share and listen to audio files easily."
              />
            </Reveal>
            <Reveal delay={240}>
              <FeatureCard
                icon={<FileText size={18} />}
                title="PDFs & Docs"
                description="Upload and organize all your study materials."
              />
            </Reveal>
            <Reveal delay={300}>
              <FeatureCard
                icon={<Link2 size={18} />}
                title="Links & URLs"
                description="Share important links and resources."
              />
            </Reveal>
          </div>

          <div className="bg-black rounded-2xl p-7 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Built By a Student
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6">
              Built By Students.
              <br />
              For Students.
            </h3>
            <div className="flex items-center gap-3">
              <Avatar src="/aswin.webp" alt="Aswin Sankar" />
              <div>
                <p className="text-white text-sm font-semibold">Aswin Sankar</p>
                <p className="text-gray-500 text-xs">Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="px-6 md:px-10 py-16 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
              Ready?
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white leading-tight">
              STUDY TOGETHER.
              <br />
              STUDY SMARTER.
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <Link
              href="/login"
              className="relative bg-lime-300 text-black font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-lime-200 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-lime-300/30"
            >
              <span className="absolute inset-0 rounded-full bg-lime-300 animate-pulse-ring" />
              <span className="relative flex items-center gap-2">
                GET STARTED <ArrowUpRight size={18} />
              </span>
            </Link>
            <span className="text-xs text-gray-400">It's free. Forever.</span>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-10 py-6 bg-black">
        <span className="text-sm font-black text-white">BingeStudy</span>
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="/contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
        <span className="text-xs text-gray-500">
          © 2026 BingeStudy. Built for students.
        </span>
      </footer>
    </main>
  );
}

/* ============ Helper Components ============ */

function OrbitNode({ icon, label, style }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 animate-float"
      style={style}
    >
      <div className="w-12 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-black dark:text-white shadow-sm">
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-gray-500 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function AppIcon({ children, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <div className="w-11 h-11 bg-[#1a1a1a] border border-gray-800 rounded-xl flex items-center justify-center text-white">
        {children}
      </div>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}

function Annotation({ number, title, description, align }) {
  return (
    <div
      className={`flex flex-col ${align === "right" ? "items-end" : "items-start"}`}
    >
      <span className="text-3xl font-black text-gray-200 dark:text-gray-700 mb-1">
        {number}
      </span>
      <h4 className="font-bold text-black dark:text-white mb-1">{title}</h4>
      <p className="text-gray-400 text-sm max-w-[200px]">{description}</p>
    </div>
  );
}

function Stat({ number, label, description, divider, isInfinity }) {
  return (
    <div
      className={`px-6 md:px-10 py-12 ${divider ? "md:border-l border-gray-100 dark:border-gray-800" : ""}`}
    >
      <div
        className={`font-black text-black dark:text-white mb-3 ${isInfinity ? "text-5xl" : "text-4xl md:text-5xl"}`}
      >
        {number}
      </div>
      <h4 className="font-bold text-black dark:text-white mb-1">{label}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200 bg-white dark:bg-gray-900">
      <div className="text-black dark:text-white mb-3">{icon}</div>
      <h4 className="font-bold text-black dark:text-white text-sm mb-1">
        {title}
      </h4>
      <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
}

function Avatar({ src, alt }) {
  return (
    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-black shrink-0">
      <Image
        src={src}
        alt={alt}
        width={36}
        height={36}
        className="object-cover w-full h-full"
      />
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto px-2 sm:px-0">
      <div className="bg-[#1a1a1a] rounded-t-xl sm:rounded-t-2xl p-2 sm:p-3 shadow-2xl">
        <div className="bg-white rounded-md sm:rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border-b border-gray-100">
            <div className="flex gap-1 sm:gap-1.5">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300" />
            </div>
            <span className="text-[8px] sm:text-[10px] text-gray-400 ml-1 sm:ml-2">
              BingeStudy
            </span>
          </div>

          <div className="flex h-44 sm:h-56 overflow-hidden">
            <div className="w-1/3 border-r border-gray-100 p-2 hidden sm:block overflow-hidden">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide px-1 mb-1.5 truncate">
                Study Groups
              </p>
              {[
                "DBMS Study Group",
                "ML Study Circle",
                "OS Assignments",
                "Aptitude Prep",
                "College Notes",
              ].map((g, i) => (
                <div
                  key={g}
                  className={`text-[10px] px-2 py-1.5 rounded-md mb-1 truncate ${
                    i === 0
                      ? "bg-black text-white font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {g}
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-gray-100 shrink-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-black truncate">
                  DBMS Study Group
                </p>
                <p className="text-[7px] sm:text-[8px] text-gray-400">
                  12 members online
                </p>
              </div>
              <div className="flex-1 p-2 sm:p-2.5 flex flex-col gap-1.5 text-[8px] sm:text-[9px] overflow-hidden min-w-0">
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-gray-400 text-[7px] sm:text-[8px] mb-0.5">
                    Aswin · 10:30 AM
                  </span>
                  <div className="bg-gray-100 rounded-lg px-2 py-1.5 max-w-[85%] break-words">
                    Can someone explain normalization?
                  </div>
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-gray-400 text-[7px] sm:text-[8px] mb-0.5">
                    Abinav · 10:31 AM
                  </span>
                  <div className="bg-gray-100 rounded-lg px-2 py-1.5 max-w-[85%] break-words">
                    Sure! Here are my notes
                    <div className="mt-1 bg-white border border-gray-200 rounded-md px-1.5 py-1 flex items-center gap-1 min-w-0">
                      <FileText size={9} className="shrink-0" />
                      <span className="text-[7px] sm:text-[8px] truncate">
                        Normalization_Notes.pdf
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-0">
                  <div className="bg-black text-white rounded-lg px-2 py-1.5 max-w-[85%] break-words">
                    This example helped a lot!
                  </div>
                </div>
              </div>
              <div className="px-2 py-1.5 border-t border-gray-100 flex items-center gap-1 shrink-0">
                <div className="flex-1 bg-gray-50 rounded-full px-2 py-1 text-[7px] sm:text-[8px] text-gray-400 truncate">
                  Message the group...
                </div>
                <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center shrink-0">
                  <Send size={7} className="text-white" />
                </div>
              </div>
            </div>

            <div className="w-1/3 border-l border-gray-100 p-2 hidden md:flex flex-col overflow-hidden min-w-0">
              <p className="text-[9px] font-bold text-black flex items-center gap-1 mb-1">
                <Sparkles size={9} className="shrink-0" /> AI Assistant
              </p>
              <p className="text-[8px] text-gray-400 mb-2 line-clamp-2">
                Ask anything about your subjects or doubts.
              </p>
              <div className="bg-gray-50 rounded-md px-1.5 py-1 text-[8px] text-gray-500 mb-1.5 truncate">
                What is DBSCAN?
              </div>
              <div className="bg-black text-white rounded-md px-1.5 py-1.5 text-[7px] leading-snug overflow-hidden">
                <p className="line-clamp-4">
                  DBSCAN is a density-based clustering algorithm that groups
                  together points that are closely packed together, marking
                  points that lie alone in low-density regions as outliers.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1 min-w-0">
                <span className="text-[7px] text-gray-400 flex-1 truncate">
                  Ask a question...
                </span>
                <Send size={8} className="text-gray-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-2 sm:h-3 bg-[#2a2a2a] rounded-b-lg sm:rounded-b-xl mx-1 sm:mx-2" />
      <div className="h-1 sm:h-1.5 bg-[#1a1a1a] rounded-full mx-8 sm:mx-12 -mt-0.5" />
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.18-.47-4.49-1.28l-.32-.19-3 .78.8-2.93-.21-.32A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  );
}

function DriveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.71 3.5L1.15 15l3.43 6 6.56-11.5L7.71 3.5zM9.5 21l3.43-6H22l-3.43 6H9.5zm12.85-7.5L16.43 3.5h-6.85l5.93 10H22.35z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 4.5L2.5 12.1c-1 .4-1 1.9.1 2.2l4.7 1.5 1.8 5.8c.3.9 1.4 1.1 2 .4l2.6-2.9 4.9 3.6c.8.6 2 .2 2.2-.8l3-14.4c.2-1.1-.9-1.9-1.9-1.5z" />
    </svg>
  );
}
