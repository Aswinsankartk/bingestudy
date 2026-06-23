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
  LogOut,
  Download,
  ExternalLink,
  FolderOpen,
  Reply,
  Sparkles,
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
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState(null);

  const isInitialLoad = useRef(true);
  const isInitialAiLoad = useRef(true);

  useEffect(() => {
    let channel;
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
      channel = subscribeToMessages();
    };
    init();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [id]);

  useEffect(() => {
    const container = document.getElementById("messages-container");
    if (!container) return;

    if (isInitialLoad.current && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
      isInitialLoad.current = false;
    } else if (!isInitialLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const container = document.getElementById("ai-container");
    if (!container) return;

    if (isInitialAiLoad.current && aiMessages.length > 0) {
      container.scrollTop = container.scrollHeight;
      isInitialAiLoad.current = false;
    } else if (!isInitialAiLoad.current) {
      aiEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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
    const { data: msgs, error } = await supabase
      .from("messages")
      .select("*")
      .eq("group_id", id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });

    if (error || !msgs) {
      setMessages([]);
      return;
    }

    const senderIds = [
      ...new Set(msgs.map((m) => m.sender_id).filter(Boolean)),
    ];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .in("id", senderIds);

    const profileMap = {};
    profiles?.forEach((p) => {
      profileMap[p.id] = p;
    });

    const messageMap = {};
    msgs.forEach((m) => {
      messageMap[m.id] = m;
    });

    const messagesWithProfiles = msgs.map((msg) => ({
      ...msg,
      profiles: profileMap[msg.sender_id] || null,
      replyToMessage: msg.reply_to
        ? {
            ...messageMap[msg.reply_to],
            profiles: profileMap[messageMap[msg.reply_to]?.sender_id] || null,
          }
        : null,
    }));

    setMessages(messagesWithProfiles);
  };

  const fetchMembers = async () => {
    const res = await fetch(`/api/groups/${id}/members`);
    const data = await res.json();
    if (data.members) setMembers(data.members);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`group-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${id}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name, email, avatar_url")
            .eq("id", payload.new.sender_id)
            .single();

          let replyToMessage = null;
          if (payload.new.reply_to) {
            const { data: original } = await supabase
              .from("messages")
              .select("*")
              .eq("id", payload.new.reply_to)
              .single();
            if (original) {
              const { data: originalProfile } = await supabase
                .from("profiles")
                .select("id, full_name, email, avatar_url")
                .eq("id", original.sender_id)
                .single();
              replyToMessage = {
                ...original,
                profiles: originalProfile || null,
              };
            }
          }

          setMessages((prev) => [
            ...prev,
            { ...payload.new, profiles: profile || null, replyToMessage },
          ]);
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
      );

    channel.subscribe();
    return channel;
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
      reply_to: replyingTo?.id || null,
    });
    setNewMessage("");
    setReplyingTo(null);
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );
    if (!confirmed) return;

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

  const handleLeaveGroup = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this group?",
    );
    if (!confirmed) return;

    const res = await fetch(`/api/groups/${id}/members`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert(data.error);
    }
  };

  const fetchAiHistory = async () => {
    const res = await fetch(`/api/chat?groupId=${id}`);
    const data = await res.json();
    if (data.history) setAiMessages(data.history);
  };

  const fetchMedia = async () => {
    setMediaLoading(true);
    const res = await fetch(`/api/groups/${id}/media`);
    const data = await res.json();
    if (data.media) setMediaFiles(data.media);
    setMediaLoading(false);
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
    const utcTimestamp = timestamp.endsWith("Z") ? timestamp : timestamp + "Z";
    const date = new Date(utcTimestamp);
    const now = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    });

    if (date.toDateString() === now.toDateString()) {
      return timeStr;
    }

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
    if (msg.type === "text") {
      const content = msg.content || "";
      const words = content.split(" ");

      return (
        <p
          className="text-sm leading-relaxed"
          style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
        >
          {words.map((word, i) => {
            const isUrl =
              word.startsWith("http://") || word.startsWith("https://");
            return (
              <span key={`${word}-${i}`}>
                {isUrl ? (
                  <a
                    href={word}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline opacity-80 hover:opacity-100 transition-colors duration-200"
                    style={{ wordBreak: "break-all" }}
                  >
                    {word}
                  </a>
                ) : (
                  word
                )}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      );
    }

    if (msg.type === "image")
      return (
        <div className="flex flex-col gap-1.5">
          <img
            src={msg.file_url}
            alt={msg.content}
            className="max-w-xs rounded-xl border border-white/10"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs opacity-60 truncate">{msg.content}</p>
            <a
              href={msg.file_url}
              download={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200"
              title="Download"
            >
              <Download size={13} />
            </a>
          </div>
        </div>
      );

    if (msg.type === "audio")
      return (
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-2 rounded-lg">
              <Music size={14} />
            </div>
            <p className="text-xs opacity-70 truncate flex-1">{msg.content}</p>
            <a
              href={msg.file_url}
              download={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200"
              title="Download"
            >
              <Download size={13} />
            </a>
          </div>
          <audio controls className="w-full max-w-xs h-8">
            <source src={msg.file_url} />
          </audio>
        </div>
      );

    if (msg.type === "pdf")
      return (
        <div className="flex items-center gap-3 min-w-[180px]">
          <div className="bg-white/10 p-2.5 rounded-lg shrink-0">
            <FileText size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{msg.content}</p>
            <p className="text-xs opacity-50 mt-0.5">PDF Document</p>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <a
              href={msg.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity duration-200"
              title="Open"
            >
              <ExternalLink size={13} />
            </a>
            <a
              href={msg.file_url}
              download={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity duration-200"
              title="Download"
            >
              <Download size={13} />
            </a>
          </div>
        </div>
      );

    return (
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="bg-white/10 p-2.5 rounded-lg shrink-0">
          <File size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{msg.content}</p>
          <p className="text-xs opacity-50 mt-0.5">Document</p>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <a
            href={msg.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity duration-200"
            title="Open"
          >
            <ExternalLink size={13} />
          </a>
          <a
            href={msg.file_url}
            download={msg.content}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity duration-200"
            title="Download"
          >
            <Download size={13} />
          </a>
        </div>
      </div>
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
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 hover:text-black active:scale-90 transition-all duration-150 shrink-0"
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
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-mono bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
            {group.code}
          </span>

          <button
            onClick={() => setShowMembers(true)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full active:scale-95 transition duration-200 ease-out ${
              myRole === "admin"
                ? "bg-black text-white hover:bg-gray-800"
                : "border border-gray-200 text-black hover:border-black"
            }`}
          >
            <Users size={13} />
            <span className="hidden sm:inline">
              {myRole === "admin" ? "Manage" : "Members"}
            </span>
          </button>

          {myRole !== "admin" && (
            <button
              onClick={handleLeaveGroup}
              className="flex items-center gap-1.5 text-xs font-semibold border border-red-200 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 transition duration-200 ease-out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Leave</span>
            </button>
          )}
        </div>
      </nav>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-4 md:px-6 shrink-0">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-1.5 py-2.5 px-3 text-sm font-semibold border-b-2 transition duration-200 ease-out ${
            activeTab === "chat"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-black hover:border-gray-200"
          }`}
        >
          <MessageCircle
            size={15}
            className={`transition-transform duration-200 ${activeTab === "chat" ? "scale-110" : ""}`}
          />
          Chat
        </button>
        <button
          onClick={() => {
            setActiveTab("media");
            fetchMedia();
          }}
          className={`flex items-center gap-1.5 py-2.5 px-3 text-sm font-semibold border-b-2 transition duration-200 ease-out ${
            activeTab === "media"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-black hover:border-gray-200"
          }`}
        >
          <FolderOpen
            size={15}
            className={`transition-transform duration-200 ${activeTab === "media" ? "scale-110" : ""}`}
          />
          Media
        </button>
        <button
          onClick={() => {
            setActiveTab("ai");
            fetchAiHistory();
          }}
          className={`flex items-center gap-1.5 py-2.5 px-3 text-sm font-semibold border-b-2 transition duration-200 ease-out ${
            activeTab === "ai"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-black hover:border-gray-200"
          }`}
        >
          <Bot
            size={15}
            className={`transition-transform duration-200 ${activeTab === "ai" ? "scale-110" : ""}`}
          />
          AI Assistant
        </button>
      </div>

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <>
          <div
            id="messages-container"
            className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-3"
          >
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <div className="bg-gray-50 p-4 rounded-2xl mb-3 animate-float">
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
              messages.map((msg, index) => {
                const isMe = msg.sender_id === user?.id;
                const canDelete = isMe || myRole === "admin";
                const isLastMessage = index === messages.length - 1;
                const senderName =
                  msg.profiles?.full_name || msg.profiles?.email || "Unknown";
                const senderAvatar = msg.profiles?.avatar_url;
                const senderInitials = senderName.charAt(0).toUpperCase();

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${isLastMessage ? "animate-fade-in-up" : ""}`}
                  >
                    {!isMe && (
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        {senderAvatar ? (
                          <img
                            src={senderAvatar}
                            alt={senderName}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {senderInitials}
                          </div>
                        )}
                        <span className="text-xs text-gray-400">
                          {senderName}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 group">
                      {isMe && (
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => setReplyingTo(msg)}
                            className="text-gray-300 hover:text-black active:scale-90 transition-all duration-150"
                            title="Reply"
                          >
                            <Reply size={13} />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-gray-200 hover:text-red-400 active:scale-90 transition-all duration-150"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[75vw] md:max-w-md px-4 py-2.5 rounded-2xl transition-transform duration-150 hover:scale-[1.01] ${
                          isMe
                            ? "bg-black text-white rounded-br-sm"
                            : "bg-gray-100 text-black rounded-bl-sm"
                        }`}
                      >
                        {msg.replyToMessage && (
                          <div
                            className={`mb-2 pl-2.5 border-l-2 ${
                              isMe ? "border-white/30" : "border-gray-300"
                            }`}
                          >
                            <p
                              className={`text-xs font-semibold ${isMe ? "text-white/70" : "text-gray-500"}`}
                            >
                              {msg.replyToMessage.profiles?.full_name ||
                                msg.replyToMessage.profiles?.email ||
                                "Unknown"}
                            </p>
                            <p
                              className={`text-xs truncate max-w-[200px] ${isMe ? "text-white/50" : "text-gray-400"}`}
                            >
                              {msg.replyToMessage.type === "text"
                                ? msg.replyToMessage.content
                                : `📎 ${msg.replyToMessage.content}`}
                            </p>
                          </div>
                        )}
                        {renderMessage(msg)}
                      </div>

                      {!isMe && (
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-gray-200 hover:text-red-400 active:scale-90 transition-all duration-150"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => setReplyingTo(msg)}
                            className="text-gray-300 hover:text-black active:scale-90 transition-all duration-150"
                            title="Reply"
                          >
                            <Reply size={13} />
                          </button>
                        </div>
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
            {replyingTo && (
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-2 animate-fade-in-up">
                <div className="flex items-center gap-2 min-w-0">
                  <Reply size={14} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-600">
                      Replying to{" "}
                      {replyingTo.profiles?.full_name ||
                        replyingTo.profiles?.email ||
                        "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {replyingTo.type === "text"
                        ? replyingTo.content
                        : `📎 ${replyingTo.content}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-black active:scale-90 transition-all duration-150 shrink-0 ml-2"
                >
                  <X size={14} />
                </button>
              </div>
            )}

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
                className="border border-gray-200 text-gray-400 px-3 py-2.5 rounded-full hover:border-black hover:text-black active:scale-90 transition duration-200 ease-out disabled:opacity-40 shrink-0"
              >
                <Paperclip size={16} />
              </button>
              <form onSubmit={sendMessage} className="flex gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-black transition duration-200 ease-out"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-black text-white px-4 py-2.5 rounded-full hover:bg-gray-800 active:scale-90 transition duration-150 ease-out disabled:opacity-40 disabled:active:scale-100 shrink-0"
                >
                  <Send size={16} className={sending ? "animate-pulse" : ""} />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Media Tab */}
      {activeTab === "media" && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b border-gray-100 shrink-0 overflow-x-auto">
            {["all", "image", "pdf", "audio", "doc"].map((filter) => (
              <button
                key={filter}
                onClick={() => setMediaFilter(filter)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize active:scale-90 transition duration-200 ease-out ${
                  mediaFilter === filter
                    ? "bg-black text-white scale-105"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {filter === "all"
                  ? "All Files"
                  : filter === "image"
                    ? "Images"
                    : filter === "pdf"
                      ? "PDFs"
                      : filter === "audio"
                        ? "Audio"
                        : "Docs"}
              </button>
            ))}
          </div>

          <div className="flex-1 px-4 md:px-6 py-4">
            {mediaLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              (() => {
                const filtered =
                  mediaFilter === "all"
                    ? mediaFiles
                    : mediaFiles.filter((f) =>
                        mediaFilter === "doc"
                          ? f.type === "doc"
                          : f.type === mediaFilter,
                      );

                if (filtered.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                      <div className="bg-gray-50 p-4 rounded-2xl mb-3 animate-float">
                        <FolderOpen size={28} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-sm font-medium">
                        No files yet
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        Share files in the chat to see them here.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {(mediaFilter === "all" || mediaFilter === "image") && (
                      <>
                        {filtered.filter((f) => f.type === "image").length >
                          0 && (
                          <div>
                            {mediaFilter === "all" && (
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                                Images
                              </p>
                            )}
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                              {filtered
                                .filter((f) => f.type === "image")
                                .map((file) => (
                                  <div
                                    key={file.id}
                                    className="relative group aspect-square"
                                  >
                                    <img
                                      src={file.file_url}
                                      alt={file.content}
                                      className="w-full h-full object-cover rounded-xl border border-gray-100"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
                                      <a
                                        href={file.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/90 p-1.5 rounded-full hover:bg-white active:scale-90 transition-all duration-150"
                                        title="Open"
                                      >
                                        <ExternalLink
                                          size={13}
                                          className="text-black"
                                        />
                                      </a>
                                      <a
                                        href={file.file_url}
                                        download={file.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/90 p-1.5 rounded-full hover:bg-white active:scale-90 transition-all duration-150"
                                        title="Download"
                                      >
                                        <Download
                                          size={13}
                                          className="text-black"
                                        />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {(mediaFilter === "all" || mediaFilter === "audio") && (
                      <>
                        {filtered.filter((f) => f.type === "audio").length >
                          0 && (
                          <div>
                            {mediaFilter === "all" && (
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-4">
                                Audio
                              </p>
                            )}
                            <div className="flex flex-col gap-2">
                              {filtered
                                .filter((f) => f.type === "audio")
                                .map((file) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 transition-colors duration-200"
                                  >
                                    <div className="bg-gray-100 p-2.5 rounded-lg shrink-0">
                                      <Music
                                        size={16}
                                        className="text-gray-600"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-black truncate">
                                        {file.content}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-0.5">
                                        {formatTime(file.created_at)}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <a
                                        href={file.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-black active:scale-90 transition-all duration-150"
                                        title="Open"
                                      >
                                        <ExternalLink size={14} />
                                      </a>
                                      <a
                                        href={file.file_url}
                                        download={file.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-black active:scale-90 transition-all duration-150"
                                        title="Download"
                                      >
                                        <Download size={14} />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {(mediaFilter === "all" ||
                      mediaFilter === "pdf" ||
                      mediaFilter === "doc") && (
                      <>
                        {filtered.filter(
                          (f) => f.type === "pdf" || f.type === "doc",
                        ).length > 0 && (
                          <div>
                            {mediaFilter === "all" && (
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-4">
                                Documents
                              </p>
                            )}
                            <div className="flex flex-col gap-2">
                              {filtered
                                .filter(
                                  (f) => f.type === "pdf" || f.type === "doc",
                                )
                                .map((file) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 transition-colors duration-200"
                                  >
                                    <div className="bg-gray-100 p-2.5 rounded-lg shrink-0">
                                      {file.type === "pdf" ? (
                                        <FileText
                                          size={16}
                                          className="text-gray-600"
                                        />
                                      ) : (
                                        <File
                                          size={16}
                                          className="text-gray-600"
                                        />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-black truncate">
                                        {file.content}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-gray-400 uppercase font-mono">
                                          {file.type}
                                        </span>
                                        <span className="text-gray-200">·</span>
                                        <span className="text-xs text-gray-400">
                                          {formatTime(file.created_at)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <a
                                        href={file.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-black active:scale-90 transition-all duration-150"
                                        title="Open"
                                      >
                                        <ExternalLink size={14} />
                                      </a>
                                      <a
                                        href={file.file_url}
                                        download={file.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-black active:scale-90 transition-all duration-150"
                                        title="Download"
                                      >
                                        <Download size={14} />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* AI Tab */}
      {activeTab === "ai" && (
        <>
          <div
            id="ai-container"
            className="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col gap-3"
          >
            {aiMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <div className="bg-gray-50 p-4 rounded-2xl mb-3 animate-float">
                  <Bot size={28} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  Ask me anything
                </p>
                <p className="text-gray-300 text-sm mt-1 flex items-center gap-1.5">
                  <Sparkles size={12} /> Powered by Google Gemini 2.5 Flash
                </p>
              </div>
            ) : (
              aiMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75vw] md:max-w-lg px-4 py-2.5 rounded-2xl text-sm prose prose-sm max-w-none leading-relaxed ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-br-sm"
                        : "bg-gray-100 text-black rounded-bl-sm"
                    }`}
                  >
                    <ReactMarkdown
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
              <div className="flex items-start animate-fade-in-up">
                <div className="bg-gray-100 px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing-dot"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing-dot"
                    style={{ animationDelay: "160ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing-dot"
                    style={{ animationDelay: "320ms" }}
                  />
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
                className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-black transition duration-200 ease-out"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                className="bg-black text-white px-4 py-2.5 rounded-full hover:bg-gray-800 active:scale-90 transition duration-150 ease-out disabled:opacity-40 shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </>
      )}

      {/* Members Panel Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-black">
                Members ({members.length})
              </h3>
              <button
                onClick={() => setShowMembers(false)}
                className="text-gray-400 hover:text-black active:scale-90 transition-all duration-150"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {members.map((member, index) => {
                const isCurrentUser = member.user_id === user?.id;
                const name =
                  member.profiles?.full_name ||
                  member.profiles?.email ||
                  "Unknown User";
                const avatar = member.profiles?.avatar_url;
                const initials = name.charAt(0).toUpperCase();

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 transition-colors duration-200 animate-fade-in-down"
                    style={{
                      animationDelay: `${Math.min(index * 30, 150)}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                          {initials}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-black">
                          {name}
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
                    </div>

                    {myRole === "admin" && !isCurrentUser && (
                      <div className="flex gap-2">
                        {member.role === "member" ? (
                          <button
                            onClick={() =>
                              handleMemberAction(member.user_id, "make_admin")
                            }
                            className="text-xs border border-black text-black px-2.5 py-1 rounded-full hover:bg-black hover:text-white active:scale-95 transition duration-200 ease-out"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleMemberAction(member.user_id, "remove_admin")
                            }
                            className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full hover:bg-gray-100 active:scale-95 transition duration-200 ease-out"
                          >
                            Remove Admin
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleMemberAction(member.user_id, "remove")
                          }
                          className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-full hover:bg-red-600 active:scale-95 transition duration-200 ease-out"
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
