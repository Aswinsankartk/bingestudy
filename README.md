# 📚 BingeStudy

### A Collaborative Note Sharing Platform for Students

BingeStudy is a real-time, web-based study platform where students can create private groups, share study materials, and get instant answers from an AI chatbot — all in one place.

> Final Year Project | Full Stack Web Application

---

## 🌐 Live Demo

🔗 **[bingestudy.vercel.app](https://bingestudy.vercel.app)** *(update this link after deployment)*

---

## 🖼️ Screenshots

> *(Add screenshots here after building the UI)*

---

## 💡 The Problem It Solves

Students today share notes on WhatsApp, store files on Google Drive, and ask doubts on random Telegram groups. Everything is scattered, unorganized, and impossible to find later.

**BingeStudy** brings it all into one structured platform — private study groups, real-time file sharing, and an AI assistant that actually understands your subject.

---

## ✨ Features

- 🔐 **Authentication** — Google OAuth and Email/Password login via Supabase Auth
- 👥 **Study Groups** — Create a group and get an auto-generated invite code (e.g. `BNG-4X2`). Share the code, others join instantly
- 💬 **Real-Time Chat** — Messages appear live for all group members without refreshing
- 📁 **Multi-Format File Sharing** — Share Images, PDFs, Audio recordings, Text notes, Documents, and URLs
- 🛡️ **Role-Based Access Control** — Admins can delete messages, remove members, and promote others. Members manage only their own messages
- 🤖 **AI Chatbot** — Built-in assistant powered by Google Gemini 1.5 Flash for instant doubt resolution
- 📱 **Fully Responsive** — Works seamlessly on mobile, tablet, and desktop
- 🎨 **Clean B&W UI** — Minimal, distraction-free design built for studying

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Real-Time | Supabase Realtime |
| AI Chatbot | Google Gemini 1.5 Flash API |
| Deployment | Vercel + Supabase |

---

## 🗂️ Project Structure

```
bingestudy/
├── app/
│   ├── (auth)/
│   │   └── login/          # Login page
│   ├── dashboard/          # User dashboard (all groups)
│   ├── group/
│   │   └── [id]/           # Group chat room
│   └── api/
│       ├── groups/         # Group CRUD API routes
│       ├── messages/       # Message API routes
│       └── chat/           # Gemini AI chatbot route
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── chat/               # Chat UI components
│   └── groups/             # Group-related components
├── lib/
│   ├── supabase/           # Supabase client setup
│   └── utils.js            # Utility functions
└── public/                 # Static assets
```

---

## 🗃️ Database Schema

```sql
-- Groups table
groups (id, name, subject, code, created_by, created_at)

-- Group Members with roles
group_members (id, group_id, user_id, role, joined_at)

-- Messages (text + files)
messages (id, group_id, sender_id, type, content, file_url, is_deleted, created_at)

-- AI Chat history
ai_chats (id, group_id, user_id, role, content, created_at)
```

---

## ⚙️ Getting Started (Run Locally)

### Prerequisites

- Node.js v18 or above
- A Supabase account (free) — [supabase.com](https://supabase.com)
- A Google AI Studio account (free) — [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/bingestudy.git
cd bingestudy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

> Get Supabase credentials from: Project Settings → API
> Get Gemini API key from: aistudio.google.com → Get API Key

### 4. Set up the database

Go to your Supabase project → SQL Editor and run the schema from `/lib/supabase/schema.sql`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

This project is deployed on **Vercel**.

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables in Vercel's project settings
4. Click Deploy

Every push to the `main` branch auto-deploys.

---

## 🔐 Role-Based Access Control

| Permission | Member | Admin |
|---|---|---|
| Send messages | ✅ | ✅ |
| Delete own messages | ✅ | ✅ |
| Delete any message | ❌ | ✅ |
| Remove members | ❌ | ✅ |
| Promote to Admin | ❌ | ✅ |
| Leave group | ✅ | ✅ |

> The group creator is assigned Super Admin and cannot be removed.

---

## 🤖 AI Chatbot

The built-in AI assistant is powered by **Google Gemini 1.5 Flash**. Students can ask subject-related doubts directly inside the group room without switching apps.

**Free tier limits:**
- 1,500 requests/day
- No credit card required

---

## 📋 Roadmap

- [x] Google OAuth + Email authentication
- [x] Group creation with invite codes
- [x] Real-time chat
- [x] File sharing (images, PDFs, audio, docs)
- [x] Role-based access control
- [x] AI chatbot (Gemini)
- [ ] Document-aware AI (RAG — V2)
- [ ] Pin important messages
- [ ] Group search and discovery
- [ ] Notifications
- [ ] Dark mode

---

## 👨‍💻 Author

**Aswin Sankar TK**
BCA Final Year Student

🔗 [LinkedIn](https://linkedin.com/in/aswinsankartk) | 🐙 [GitHub](https://github.com/aswinsankartk)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ as a BCA Final Year Project</p>
