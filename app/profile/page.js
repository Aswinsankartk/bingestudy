"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";
import posthog from "posthog-js";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setEmail(profile.email || user.email || "");
        setAvatarUrl(profile.avatar_url || "");
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      email: email,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.log("Profile save error:", error);
      setMessage(`Error: ${error.message}`);
    } else {
      posthog.capture("profile_saved");
      setMessage("Profile saved successfully!");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border-2 border-gray-100 rounded-full" />
          <div className="absolute inset-0 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  const initials = fullName ? fullName.charAt(0).toUpperCase() : "?";

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Background texture — dot grid + ambient glow */}
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_70%_50%_at_50%_15%,#000_40%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-gray-100 to-transparent rounded-full blur-3xl opacity-50 animate-drift pointer-events-none" />

      {/* Navbar */}
      <nav className="relative flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-black active:scale-90 transition-all duration-150"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-black text-black text-lg tracking-tight">
          Your Profile
        </h1>
      </nav>

      <div className="relative max-w-md mx-auto px-6 py-12">
        {/* Avatar Preview */}
        <div
          className="flex justify-center mb-8 animate-scale-in"
          style={{ animationFillMode: "backwards" }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-400 shadow-sm">
              {initials}
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "60ms", animationFillMode: "backwards" }}
          >
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black focus:shadow-sm transition duration-200 ease-out"
            />
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
          >
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-300 mt-1">
              Email cannot be changed here.
            </p>
          </div>

          {message && (
            <p
              className={`text-sm text-center animate-fade-in-down ${message.includes("success") ? "text-green-500" : "text-red-500"}`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !fullName.trim()}
            className="flex items-center justify-center gap-2 bg-black text-white rounded-full py-3 text-sm font-semibold shadow-lg shadow-black/10 hover:bg-gray-800 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition duration-200 ease-out disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg disabled:active:scale-100 mt-2 animate-fade-in-up"
            style={{ animationDelay: "180ms", animationFillMode: "backwards" }}
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
