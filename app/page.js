import Link from "next/link";
import { BookOpen, Zap, Bot, Share2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-gray-100">
        <span className="text-xl font-black tracking-tight text-black">
          BingeStudy
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-200"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-gray-100 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
        <span
          className="relative text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 animate-fade-in-up"
          style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
        >
          For Students, By Students
        </span>

        <h1
          className="relative text-4xl md:text-7xl font-black text-black leading-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
        >
          Study Together.
          <br />
          <span className="text-gray-400">Study Smarter.</span>
        </h1>

        <p
          className="relative text-gray-500 text-base md:text-xl max-w-xl mb-10 animate-fade-in-up"
          style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
        >
          Create private study groups, share notes and materials in real time,
          and get instant answers from an AI assistant — all in one place.
        </p>

        <Link
          href="/login"
          className="relative bg-black text-white text-base font-semibold px-8 py-4 rounded-xl shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-200 animate-fade-in-up"
          style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
        >
          Get Started — It's Free
        </Link>
      </section>

      {/* Features Row */}
      <section className="border-t border-gray-100 px-6 md:px-8 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-3">
              <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                {" "}
                <Share2
                  size={22}
                  className="text-black group-hover:text-white transition-colors duration-300"
                />
              </div>
            </div>
            <h3 className="font-bold text-black mb-1">Share Anything</h3>
            <p className="text-gray-400 text-sm">
              PDFs, images, audio, docs, URLs — all in one group chat.
            </p>
          </div>
          <div className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300">
            {" "}
            <div className="flex justify-center mb-3">
              <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                {" "}
                <Zap
                  size={22}
                  className="text-black group-hover:text-white transition-colors duration-300"
                />
              </div>
            </div>
            <h3 className="font-bold text-black mb-1">Real-Time</h3>
            <p className="text-gray-400 text-sm">
              Messages and files appear instantly for everyone in the group.
            </p>
          </div>
          <div className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300">
            {" "}
            <div className="flex justify-center mb-3">
              <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                {" "}
                <Bot
                  size={22}
                  className="text-black group-hover:text-white transition-colors duration-300"
                />
              </div>
            </div>
            <h3 className="font-bold text-black mb-1">AI Assistant</h3>
            <p className="text-gray-400 text-sm">
              Ask subject doubts and get instant answers powered by Gemini.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-100 px-6 py-4 text-center text-gray-400 text-sm overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
        <span className="relative">© 2026 BingeStudy. Built for students.</span>
      </footer>
    </main>
  );
}
