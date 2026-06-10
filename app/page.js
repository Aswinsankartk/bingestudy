import Link from "next/link";
import { BookOpen, Zap, Bot, Share2 } from "lucide-react";

export default function LandingPage() {
  return (
    <meta name="google-site-verification" content="8nizk4PobkHiKBE9GgCFJ5d59-ROmBkVepPiuQY0hzc" />
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
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 animate-fade-in">
          For Students, By Students
        </span>
        <h1 className="text-4xl md:text-7xl font-black text-black leading-tight mb-6">
          Study Together.
          <br />
          <span className="text-gray-400">Study Smarter.</span>
        </h1>
        <p className="text-gray-500 text-base md:text-xl max-w-xl mb-10">
          Create private study groups, share notes and materials in real time,
          and get instant answers from an AI assistant — all in one place.
        </p>
        <Link
          href="/login"
          className="bg-black text-white text-base font-semibold px-8 py-4 rounded-xl hover:bg-gray-800 hover:scale-105 transition-all duration-200"
        >
          Get Started — It's Free
        </Link>
      </section>

      {/* Features Row */}
      <section className="border-t border-gray-100 px-6 md:px-8 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="flex justify-center mb-3">
              <div className="bg-gray-50 p-3 rounded-xl">
                <Share2 size={22} className="text-black" />
              </div>
            </div>
            <h3 className="font-bold text-black mb-1">Share Anything</h3>
            <p className="text-gray-400 text-sm">
              PDFs, images, audio, docs, URLs — all in one group chat.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="flex justify-center mb-3">
              <div className="bg-gray-50 p-3 rounded-xl">
                <Zap size={22} className="text-black" />
              </div>
            </div>
            <h3 className="font-bold text-black mb-1">Real-Time</h3>
            <p className="text-gray-400 text-sm">
              Messages and files appear instantly for everyone in the group.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="flex justify-center mb-3">
              <div className="bg-gray-50 p-3 rounded-xl">
                <Bot size={22} className="text-black" />
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
      <footer className="border-t border-gray-100 px-6 py-4 text-center text-gray-400 text-sm">
        © 2025 BingeStudy. Built for students.
      </footer>
    </main>
  );
}
