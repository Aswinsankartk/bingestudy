"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, UserPlus, Trash2, Users, LogOut, BookOpen } from "lucide-react";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingGroupId, setDeletingGroupId] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupSubject, setGroupSubject] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

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
      await fetchGroups();
    };
    init();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    const res = await fetch("/api/groups");
    const data = await res.json();
    if (data.memberships) setGroups(data.memberships);
    setLoading(false);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName, subject: groupSubject }),
    });
    const data = await res.json();

    if (!res.ok) {
      setCreateError(data.error);
      setCreateLoading(false);
      return;
    }

    setShowCreate(false);
    setGroupName("");
    setGroupSubject("");
    setCreateLoading(false);
    await fetchGroups();
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setJoinLoading(true);
    setJoinError("");

    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode }),
    });
    const data = await res.json();

    if (!res.ok) {
      setJoinError(data.error);
      setJoinLoading(false);
      return;
    }

    setShowJoin(false);
    setJoinCode("");
    setJoinLoading(false);
    await fetchGroups();
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${groupName}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingGroupId(groupId);
    const res = await fetch(`/api/groups/${groupId}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      await fetchGroups();
    } else {
      alert(data.error);
    }
    setDeletingGroupId(null);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <main className="relative min-h-screen bg-white">
      {/* Ambient background texture */}
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_30%,transparent_100%)] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative flex items-center justify-between px-6 md:px-8 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <span className="text-xl font-black tracking-tight text-black">
          BingeStudy
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/profile")}
            className="text-sm font-semibold text-gray-500 hover:text-black active:scale-95 transition-all duration-200"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {logoutLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            <span className="hidden sm:inline">
              {logoutLoading ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 md:px-8 py-10">
        <div
          className="flex items-center justify-between mb-8 animate-fade-in-up"
          style={{ animationFillMode: "backwards" }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">
              Dashboard
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight mb-1">
              Your Groups
            </h2>
            <p className="text-gray-400 text-sm">
              Create a new group or join one with an invite code.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex gap-3 mb-10 animate-fade-in-up"
          style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
        >
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-black/10 transition duration-200 ease-out hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
          >
            <Plus size={16} />
            Create Group
          </button>
          <button
            onClick={() => setShowJoin(true)}
            className="flex items-center gap-2 border border-gray-200 text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:border-black active:scale-[0.97] transition-all duration-200"
          >
            <UserPlus size={16} />
            Join Group
          </button>
        </div>

        {/* Groups List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-6">
                <div className="h-4 rounded mb-3 w-3/4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer" />
                <div className="h-3 rounded w-1/2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer" />
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-gray-200 rounded-2xl animate-fade-in">
            <div className="bg-gray-50 p-4 rounded-2xl mb-4 animate-float">
              <BookOpen size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm font-semibold">No groups yet</p>
            <p className="text-gray-300 text-sm mt-1">
              Create one or ask a friend for their invite code.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((membership, index) => (
              <div
                key={membership.groups.id}
                className="border border-gray-200 rounded-2xl p-6 hover:border-gray-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative group animate-fade-in-up"
                style={{
                  animationDelay: `${Math.min(index * 60, 300)}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div
                  onClick={() => router.push(`/group/${membership.groups.id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2 pr-6">
                    <h3 className="font-bold text-black text-base leading-snug">
                      {membership.groups.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2 shrink-0 ${
                        membership.role === "admin"
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {membership.role}
                    </span>
                  </div>
                  {membership.groups.subject && (
                    <p className="text-gray-400 text-sm mb-3">
                      {membership.groups.subject}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Users size={11} className="text-gray-300" />
                    <p className="text-xs text-gray-300 font-mono">
                      {membership.groups.code}
                    </p>
                  </div>
                </div>

                {membership.role === "admin" && (
                  <button
                    onClick={() =>
                      handleDeleteGroup(
                        membership.groups.id,
                        membership.groups.name,
                      )
                    }
                    disabled={deletingGroupId === membership.groups.id}
                    className="absolute top-4 right-4 text-gray-200 hover:text-red-400 active:scale-90 transition-all duration-200 disabled:opacity-40"
                    title="Delete group"
                  >
                    {deletingGroupId === membership.groups.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl animate-scale-in">
            <h3 className="text-xl font-black text-black mb-5">
              Create a Group
            </h3>
            <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Group name (e.g. DBMS Study Group)"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all duration-200"
              />
              <input
                type="text"
                placeholder="Subject (e.g. Database Management)"
                value={groupSubject}
                onChange={(e) => setGroupSubject(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all duration-200"
              />
              {createError && (
                <p className="text-sm text-red-500 animate-fade-in-down">
                  {createError}
                </p>
              )}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setCreateError("");
                  }}
                  className="flex-1 border border-gray-200 text-black rounded-full py-3 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-black text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl animate-scale-in">
            <h3 className="text-xl font-black text-black mb-5">Join a Group</h3>
            <form onSubmit={handleJoinGroup} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter invite code (e.g. BNG4X2)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all duration-200 uppercase"
              />
              {joinError && (
                <p className="text-sm text-red-500 animate-fade-in-down">
                  {joinError}
                </p>
              )}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoin(false);
                    setJoinError("");
                  }}
                  className="flex-1 border border-gray-200 text-black rounded-full py-3 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joinLoading}
                  className="flex-1 bg-black text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                >
                  {joinLoading ? "Joining..." : "Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
