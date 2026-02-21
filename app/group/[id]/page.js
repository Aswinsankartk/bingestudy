'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

export default function GroupRoom() {
  const supabase = createClient()
  const router = useRouter()
  const { id } = useParams()

  const [user, setUser] = useState(null)
  const [group, setGroup] = useState(null)
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [myRole, setMyRole] = useState('member')
  const [showMembers, setShowMembers] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const [aiMessages, setAiMessages] = useState([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const aiEndRef = useRef(null)
  

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      await fetchGroup(user)
      await fetchMessages()
      await fetchMembers()
      subscribeToMessages()
    }
    init()
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
  aiEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  const fetchGroup = async (currentUser) => {
    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single()
    setGroup(group)

    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', id)
      .eq('user_id', currentUser.id)
      .single()

    if (!membership) { router.push('/dashboard'); return }
    setMyRole(membership.role)
  }

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const fetchMembers = async () => {
    const res = await fetch(`/api/groups/${id}/members`)
    const data = await res.json()
    if (data.members) setMembers(data.members)
  }

  const subscribeToMessages = () => {
    supabase
      .channel(`group-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${id}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${id}`
      }, () => {
        fetchMessages()
      })
      .subscribe()
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setSending(true)

    await supabase.from('messages').insert({
      group_id: id,
      sender_id: user.id,
      type: 'text',
      content: newMessage.trim()
    })

    setNewMessage('')
    setSending(false)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('groupId', id)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    if (!res.ok) alert(data.error)

    setUploading(false)
    e.target.value = ''
  }

  const handleDeleteMessage = async (messageId) => {
    const res = await fetch(`/api/messages/${messageId}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
    } else {
        const data=await res.json()
        alert(data.error)
    }
  }

  const handleMemberAction = async (targetUserId, action) => {
    const res = await fetch(`/api/groups/${id}/members`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, action })
    })

    if (res.ok) {
      await fetchMembers()
    } else {
      const data = await res.json()
      alert(data.error)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const fetchAiHistory = async () => {
  const res = await fetch(`/api/chat?groupId=${id}`)
  const data = await res.json()
  if (data.history) setAiMessages(data.history)
    }

    const sendAiMessage = async (e) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    setAiLoading(true)

    const userMessage = aiInput.trim()
    setAiInput('')

    setAiMessages((prev) => [...prev, { role: 'user', content: userMessage }])

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        message: userMessage,
        groupId: id,
        history: aiMessages
        })
    })

    const data = await res.json()

    if (res.ok) {
    setAiMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } else {
        setAiMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
    }
    setAiLoading(false)
    }

  const renderMessage = (msg) => {
    if (msg.type === 'text') {
      return <p className="text-sm">{msg.content}</p>
    }
    if (msg.type === 'image') {
      return (
        <div>
          <img src={msg.file_url} alt={msg.content} className="max-w-xs rounded-xl" />
          <p className="text-xs mt-1 opacity-70">{msg.content}</p>
        </div>
      )
    }
    if (msg.type === 'audio') {
      return (
        <div>
          <audio controls className="max-w-xs">
            <source src={msg.file_url} />
          </audio>
          <p className="text-xs mt-1 opacity-70">{msg.content}</p>
        </div>
      )
    }
    if (msg.type === 'pdf') {
      return (
        <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline text-sm">
          📄 {msg.content}
        </a>
      )
    }
    return (
      <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline text-sm">
        📎 {msg.content}
      </a>
    )
  }

  if (!group) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-black transition-all text-sm"
          >
            ← Back
          </button>
          <div>
            <h1 className="font-bold text-black text-base leading-tight">{group.name}</h1>
            {group.subject && <p className="text-xs text-gray-400">{group.subject}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
            Code: {group.code}
          </span>
          {myRole === 'admin' && (
            <button
              onClick={() => setShowMembers(true)}
              className="text-xs font-semibold bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-all"
            >
              Manage Members
            </button>
          )}
        </div>
      </nav>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-6">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'chat' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          💬 Chat
        </button>
        <button
            onClick={() => { setActiveTab('ai'); fetchAiHistory() }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'ai' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}
            >
            🤖 AI Assistant
        </button>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <>
          <div
            className="overflow-y-auto px-6 py-6 flex flex-col gap-4"
            style={{ height: 'calc(100vh - 180px)' }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <p className="text-3xl mb-3">👋</p>
                <p className="text-gray-400 text-sm">No messages yet.</p>
                <p className="text-gray-300 text-sm">Be the first to say something!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id
                const canDelete = isMe || myRole === 'admin'
                 return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2">

                    {/* Delete button on LEFT for my messages */}
                    {canDelete && isMe && (
                        <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-xs text-gray-300 hover:text-red-500 transition-all"
                        >
                        🗑️
                        </button>
                    )}

                    <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                        isMe ? 'bg-black text-white rounded-br-sm' : 'bg-gray-100 text-black rounded-bl-sm'
                    }`}>
                        {renderMessage(msg)}
                    </div>

                    {/* Delete button on RIGHT for others messages (admin only) */}
                    {canDelete && !isMe && (
                        <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-xs text-gray-300 hover:text-red-500 transition-all"
                        >
                        🗑️
                </button>
      )}

    </div>
    <span className="text-xs text-gray-300 mt-1 px-1">
      {formatTime(msg.created_at)}
    </span>
  </div>
)
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-100 px-6 py-4">
            {uploading && <p className="text-xs text-gray-400 mb-2">Uploading file...</p>}
            <div className="flex gap-3">
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
                className="border border-gray-200 text-gray-400 px-4 py-3 rounded-xl hover:border-black hover:text-black transition-all disabled:opacity-40"
              >
                📎
              </button>
              <form onSubmit={sendMessage} className="flex gap-3 flex-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* AI Tab */}
    {activeTab === 'ai' && (
    <>
        <div
        className="overflow-y-auto px-6 py-6 flex flex-col gap-4"
        style={{ height: 'calc(100vh - 180px)' }}
        >
        {aiMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
            <p className="text-3xl mb-3">🤖</p>
            <p className="text-gray-400 text-sm">Ask me anything about your subject.</p>
            <p className="text-gray-300 text-sm mt-1">I'm powered by Google Gemini.</p>
            </div>
        ) : (
            aiMessages.map((msg, index) => (
            <div
                key={index}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
                <div className={`max-w-xs md:max-w-lg px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user'
                    ? 'bg-black text-white rounded-br-sm'
                    : 'bg-gray-100 text-black rounded-bl-sm'
                }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-xs text-gray-300 mt-1 px-1">
                {msg.role === 'user' ? 'You' : '🤖 Gemini'}
                </span>
            </div>
            ))
        )}
        {aiLoading && (
            <div className="flex items-start">
            <div className="bg-gray-100 text-black px-4 py-3 rounded-2xl rounded-bl-sm text-sm">
                Thinking...
            </div>
            </div>
        )}
        <div ref={aiEndRef} />
        </div>

    {/* AI Input */}
    <div className="border-t border-gray-100 px-6 py-4">
      <form onSubmit={sendAiMessage} className="flex gap-3">
        <input
          type="text"
          placeholder="Ask a study doubt..."
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-all"
        />
        <button
          type="submit"
          disabled={aiLoading || !aiInput.trim()}
          className="bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-40"
        >
          Ask
        </button>
      </form>
    </div>
  </>
)}

      {/* Members Panel Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-black">Members ({members.length})</h3>
              <button
                onClick={() => setShowMembers(false)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {members.map((member) => {
                const isCurrentUser = member.user_id === user?.id
                return (
                  <div key={member.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-black">
                        {member.user_id.slice(0, 8)}...
                        {isCurrentUser && <span className="text-gray-400 ml-1">(you)</span>}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                    </div>

                    {/* Admin controls — don't show for current user */}
                    {myRole === 'admin' && !isCurrentUser && (
                      <div className="flex gap-2">
                        {member.role === 'member' ? (
                          <button
                            onClick={() => handleMemberAction(member.user_id, 'make_admin')}
                            className="text-xs border border-black text-black px-3 py-1 rounded-lg hover:bg-black hover:text-white transition-all"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMemberAction(member.user_id, 'remove_admin')}
                            className="text-xs border border-gray-300 text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-100 transition-all"
                          >
                            Remove Admin
                          </button>
                        )}
                        <button
                          onClick={() => handleMemberAction(member.user_id, 'remove')}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

    </main>
  )
}