"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";

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
      setMessage("Profile saved successfully!");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const initials = fullName ? fullName.charAt(0).toUpperCase() : "?";

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-black transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-black text-black text-lg">Your Profile</h1>
      </nav>

      <div className="max-w-md mx-auto px-6 py-10">
        {/* Avatar Preview */}
        <div className="flex justify-center mb-8">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-400">
              {initials}
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
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
              className={`text-sm text-center ${message.includes("success") ? "text-green-500" : "text-red-500"}`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !fullName.trim()}
            className="flex items-center justify-center gap-2 bg-black text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 mt-2"
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
