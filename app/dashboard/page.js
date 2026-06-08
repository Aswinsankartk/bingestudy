"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingGroupId, setDeletingGroupId] = useState(null);

  // Create Group Modal
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupSubject, setGroupSubject] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Join Group Modal
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
    if (data.memberships) {
      setGroups(data.memberships);
    }
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

    const res = await fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      await fetchGroups();
    } else {
      alert(data.error);
    }

    setDeletingGroupId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-black">BingeStudy</span>
        <div className="flex items-center gap-4">
          {/* <span className="text-sm text-gray-400">{user.email}</span> */}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-black text-black mb-2">Your Groups</h2>
        <p className="text-gray-400 mb-8">
          Create a new group or join one with an invite code.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setShowCreate(true)}
            className="bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-200"
          >
            + Create Group
          </button>
          <button
            onClick={() => setShowJoin(true)}
            className="border border-black text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all duration-200"
          >
            Join Group
          </button>
        </div>

        {/* Groups List */}
        {loading ? (
          <p className="text-gray-400 text-sm">Loading groups...</p>
        ) : groups.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-gray-400 text-sm">
              You haven't joined any groups yet.
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Create one or ask a friend for their invite code.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((membership) => (
              <div
                key={membership.groups.id}
                className="border border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-200 relative group"
              >
                {/* Clickable area */}
                <div
                  onClick={() => router.push(`/group/${membership.groups.id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-black text-lg">
                      {membership.groups.name}
                    </h3>
                    <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                      {membership.role}
                    </span>
                  </div>
                  {membership.groups.subject && (
                    <p className="text-gray-400 text-sm mb-3">
                      {membership.groups.subject}
                    </p>
                  )}
                  <p className="text-xs text-gray-300 font-mono">
                    Code: {membership.groups.code}
                  </p>
                </div>

                {/* Delete button — only for group creator (admin) */}
                {membership.role === "admin" && (
                  <button
                    onClick={() =>
                      handleDeleteGroup(
                        membership.groups.id,
                        membership.groups.name,
                      )
                    }
                    disabled={deletingGroupId === membership.groups.id}
                    className="absolute top-4 right-4 text-xs text-gray-300 hover:text-red-500 transition-all disabled:opacity-40"
                    title="Delete group"
                  >
                    {deletingGroupId === membership.groups.id ? "..." : "🗑️"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h3 className="text-xl font-black text-black mb-6">
                Create a Group
              </h3>
              <form
                onSubmit={handleCreateGroup}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Group name (e.g. DBMS Study Group)"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all"
                />
                <input
                  type="text"
                  placeholder="Subject (e.g. Database Management)"
                  value={groupSubject}
                  onChange={(e) => setGroupSubject(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all"
                />
                {createError && (
                  <p className="text-sm text-red-500">{createError}</p>
                )}
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreate(false);
                      setCreateError("");
                    }}
                    className="flex-1 border border-gray-200 text-black rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 bg-black text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {createLoading ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showJoin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h3 className="text-xl font-black text-black mb-6">
                Join a Group
              </h3>
              <form onSubmit={handleJoinGroup} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter invite code (e.g. BNG4X2)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all uppercase"
                />
                {joinError && (
                  <p className="text-sm text-red-500">{joinError}</p>
                )}
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoin(false);
                      setJoinError("");
                    }}
                    className="flex-1 border border-gray-200 text-black rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joinLoading}
                    className="flex-1 bg-black text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {joinLoading ? "Joining..." : "Join"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
