"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    posthog.capture("google_login_clicked");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // Email Login or Signup
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email for a confirmation link!");
        if (data?.user) {
          posthog.identify(data.user.id, { email: data.user.email });
          posthog.capture("user_signed_up", { method: "email" });
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        if (data?.user) {
          posthog.identify(data.user.id, { email: data.user.email });
          posthog.capture("user_logged_in", { method: "email" });
        }
        router.push("/dashboard");
      }
    }

    setLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background texture — dot grid + ambient glow */}
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_40%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-b from-gray-100 to-transparent rounded-full blur-3xl opacity-50 animate-drift pointer-events-none" />

      {/* Back to home */}
      <a
        href="/"
        className="absolute top-6 left-6 text-xs font-semibold text-gray-400 hover:text-black active:scale-95 transition-all duration-200"
      >
        ← BingeStudy
      </a>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-xl shadow-gray-100/50 animate-scale-in">
        {/* Logo */}
        <span
          className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 animate-fade-in-up"
          style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
        >
          For Students, By Students
        </span>
        <h1
          className="text-2xl font-black text-black text-center tracking-tight mb-1 animate-fade-in-up"
          style={{ animationDelay: "60ms", animationFillMode: "backwards" }}
        >
          BingeStudy
        </h1>
        <p
          key={isSignUp ? "signup-label" : "login-label"}
          className="text-gray-400 text-sm text-center mb-8 animate-fade-in"
        >
          {isSignUp ? "Create your account" : "Welcome back"}
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-3 text-sm font-semibold text-black hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition duration-200 ease-out mb-6 disabled:opacity-60 animate-fade-in-up"
          style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              />
              <path
                fill="#34A853"
                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
              />
              <path
                fill="#FBBC05"
                d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"
              />
              <path
                fill="#EA4335"
                d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
              />
            </svg>
          )}
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div
          className="flex items-center gap-3 mb-6 animate-fade-in-up"
          style={{ animationDelay: "160ms", animationFillMode: "backwards" }}
        >
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email/Password Form */}
        <form
          onSubmit={handleEmailAuth}
          className="flex flex-col gap-4 animate-fade-in-up"
          style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:shadow-sm transition duration-200 ease-out"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:shadow-sm transition duration-200 ease-out"
          />

          {/* Error / Success Message */}
          {message && (
            <p className="text-sm text-center text-gray-500 animate-fade-in-down">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-full py-3 text-sm font-semibold shadow-lg shadow-black/10 hover:bg-gray-800 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition duration-200 ease-out disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg disabled:active:scale-100"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
          </button>
        </form>

        {/* Toggle Sign Up / Login */}
        <p
          className="text-center text-sm text-gray-400 mt-6 animate-fade-in-up"
          style={{ animationDelay: "240ms", animationFillMode: "backwards" }}
        >
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
            className="text-black font-semibold hover:underline active:opacity-60 transition-opacity duration-150"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </main>
  );
}
