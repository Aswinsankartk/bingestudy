"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Trash2,
  Paperclip,
  Send,
  X,
  Bot,
  MessageCircle,
  ChevronLeft,
  Users,
  FileText,
  Music,
  File,
} from "lucide-react";

export default function GroupRoom() {
  const supabase = createClient();
  const router = useRouter();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [myRole, setMyRole] = useState("member");
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiEndRef = useRef(null);

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
      await fetchGroup(user);
      await fetchMessages();
      await fetchMembers();
      subscribeToMessages();
    };
    init();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const fetchGroup = async (currentUser) => {
    const { data: group } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();
    setGroup(group);

    const { data: membership } = await supabase
      .from("group_members")
      .select("role")
      .eq("group_id", id)
      .eq("user_id", currentUser.id)
      .single();

    if (!membership) {
      router.push("/dashboard");
      return;
    }
    setMyRole(membership.role);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("group_id", id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const fetchMembers = async () => {
    const res = await fetch(`/api/groups/${id}/members`);
    const data = await res.json();
    if (data.members) setMembers(data.members);
  };

  const subscribeToMessages = () => {
    supabase
      .channel(`group-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${id}`,
        },
        () => {
          fetchMessages();
        },
      )
      .subscribe();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    await supabase.from("messages").insert({
      group_id: id,
      sender_id: user.id,
      type: "text",
      content: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupId", id);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    setUploading(false);
    e.target.value = "";
  };

  const handleDeleteMessage = async (messageId) => {
    const res = await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const handleMemberAction = async (targetUserId, action) => {
    const res = await fetch(`/api/groups/${id}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, action }),
    });
    if (res.ok) {
      await fetchMembers();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const fetchAiHistory = async () => {
    const res = await fetch(`/api/chat?groupId=${id}`);
    const data = await res.json();
    if (data.history) setAiMessages(data.history);
  };

  const sendAiMessage = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setAiLoading(true);
    const userMessage = aiInput.trim();
    setAiInput("");
    setAiMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        groupId: id,
        history: aiMessages,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } else {
      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${data.error}` },
      ]);
    }
    setAiLoading(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    });

    // If message is from today, show only time
    if (date.toDateString() === now.toDateString()) {
      return timeStr;
    }

    // If message is older, show date + time
    return (
      date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        timeZone,
      }) +
      " · " +
      timeStr
    );
  };

  const renderMessage = (msg) => {
    if (msg.type === "text")
      return <p className="text-sm leading-relaxed">{msg.content}</p>;
    if (msg.type === "image")
      return (
        <div>
          <img
            src={msg.file_url}
            alt={msg.content}
            className="max-w-xs rounded-xl"
          />
          <p className="text-xs mt-1 opacity-60">{msg.content}</p>
        </div>
      );
    if (msg.type === "audio")
      return (
        <div>
          <audio controls className="max-w-xs">
            <source src={msg.file_url} />
          </audio>
          <p className="text-xs mt-1 opacity-60">{msg.content}</p>
        </div>
      );
    if (msg.type === "pdf")
      return (
        <a
          href={msg.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 underline text-sm"
        >
          <FileText size={14} /> {msg.content}
        </a>
      );
    return (
      <a
        href={msg.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 underline text-sm"
      >
        <File size={14} /> {msg.content}
      </a>
    );
  };

  if (!group)
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );

  return (
    <main className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 hover:text-black transition-all shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-bold text-black text-sm md:text-base leading-tight truncate">
              {group.name}
            </h1>
            {group.subject && (
              <p className="text-xs text-gray-400 truncate">{group.subject}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-mono bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
            {group.code}
          </span>
          {myRole === "admin" && (
            <button
              onClick={() => setShowMembers(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-all"
            >
              <Users size={13} />
              <span className="hidden sm:inline">Members</span>
            </button>
          )}
        </div>
      </nav>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-4 md:px-6 shrink-0">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-1.5 py-2.5 px-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "chat"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-black"
          }`}
        >
          <MessageCircle size={15} /> Chat
        </button>
        <button
          onClick={() => {
            setActiveTab("ai");
            fetchAiHistory();
          }}
          className={`flex items-center gap-1.5 py-2.5 px-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "ai"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-black"
          }`}
        >
          <Bot size={15} /> AI Assistant
        </button>
      </div>

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <>
          {/* Messages — flex-1 + overflow-y-auto is the fix for the overflow issue */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <div className="bg-gray-50 p-4 rounded-2xl mb-3">
                  <MessageCircle size={28} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No messages yet
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Be the first to say something!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                const canDelete = isMe || myRole === "admin";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {canDelete && isMe && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-gray-200 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      <div
                        className={`max-w-[75vw] md:max-w-md px-4 py-2.5 rounded-2xl ${
                          isMe
                            ? "bg-black text-white rounded-br-sm"
                            : "bg-gray-100 text-black rounded-bl-sm"
                        }`}
                      >
                        {renderMessage(msg)}
                      </div>
                      {canDelete && !isMe && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-gray-200 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-300 mt-1 px-1">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-100 px-4 md:px-6 py-3 shrink-0">
            {uploading && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Uploading file...</p>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,audio/*,.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="border border-gray-200 text-gray-400 px-3 py-2.5 rounded-xl hover:border-black hover:text-black transition-all disabled:opacity-40 shrink-0"
              >
                <Paperclip size={16} />
              </button>
              <form onSubmit={sendMessage} className="flex gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-all"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-40 shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* AI Tab */}
      {activeTab === "ai" && (
        <>
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-3">
            {aiMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <div className="bg-gray-50 p-4 rounded-2xl mb-3">
                  <Bot size={28} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  Ask me anything
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Powered by Google Gemini 2.5 Flash
                </p>
              </div>
            ) : (
              aiMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75vw] md:max-w-lg px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-br-sm"
                        : "bg-gray-100 text-black rounded-bl-sm"
                    }`}
                  >
                    <ReactMarkdown
                      className="prose prose-sm max-w-none leading-relaxed"
                      components={{
                        p: ({ children }) => (
                          <p className="mb-1 last:mb-0">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-0.5">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-black/10 px-1 py-0.5 rounded text-xs font-mono">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-black/10 p-2 rounded-lg text-xs font-mono overflow-x-auto my-1">
                            {children}
                          </pre>
                        ),
                        h1: ({ children }) => (
                          <h1 className="font-bold text-base mb-1">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="font-bold text-sm mb-1">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="font-semibold text-sm mb-1">
                            {children}
                          </h3>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  <span className="text-xs text-gray-300 mt-1 px-1">
                    {msg.role === "user" ? "You" : "Gemini"}
                  </span>
                </div>
              ))
            )}
            {aiLoading && (
              <div className="flex items-start">
                <div className="bg-gray-100 text-black px-4 py-3 rounded-2xl rounded-bl-sm text-sm flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={aiEndRef} />
          </div>

          <div className="border-t border-gray-100 px-4 md:px-6 py-3 shrink-0">
            <form onSubmit={sendAiMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a study doubt..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-all"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                className="bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-40 shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </>
      )}

      {/* Members Panel Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-black">
                Members ({members.length})
              </h3>
              <button
                onClick={() => setShowMembers(false)}
                className="text-gray-400 hover:text-black transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {members.map((member) => {
                const isCurrentUser = member.user_id === user?.id;
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium text-black">
                        {member.user_id.slice(0, 8)}...
                        {isCurrentUser && (
                          <span className="text-gray-400 text-xs ml-1">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {member.role}
                      </p>
                    </div>
                    {myRole === "admin" && !isCurrentUser && (
                      <div className="flex gap-2">
                        {member.role === "member" ? (
                          <button
                            onClick={() =>
                              handleMemberAction(member.user_id, "make_admin")
                            }
                            className="text-xs border border-black text-black px-2.5 py-1 rounded-lg hover:bg-black hover:text-white transition-all"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleMemberAction(member.user_id, "remove_admin")
                            }
                            className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-all"
                          >
                            Remove Admin
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleMemberAction(member.user_id, "remove")
                          }
                          className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
