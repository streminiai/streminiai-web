# Stremini AI

> The #1 Floating AI Assistant for Digital Security & Productivity

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)

## 🌟 Overview

Stremini AI is an intelligent floating assistant that enhances your digital security and productivity. **Our platform is now officially launched**, providing smart protection and automation across all your digital tasks.

## ✨ Features

- **🛡️ Scam Detection** - Real-time protection against phishing and fraud
- **🤖 AI Chatbot** - Smart assistant for everyday tasks
- **⌨️ AI Keyboard** - Context-aware typing suggestions
- **🔄 Smart Automation** - Automate repetitive workflows

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/streminiai/streminiai-web.git

# Navigate to project
cd streminiai-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── team/              # Team page
│   ├── gallery/           # Gallery with Focus Cards
│   ├── wishlist/          # Waitlist signup
│   └── admin/             # Admin dashboard
├── components/
│   ├── ui/                # Reusable UI components
│   └── sections/          # Page sections
├── lib/                   # Utilities & Supabase client
└── public/                # Static assets
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| Supabase | Database & Auth |
| Lucide React | Icons |

## 📝 License

© 2025 Stremini AI. All rights reserved.

---

<p align="center">
  Made with ❤️ by the <a href="https://stremini.site/team">Stremini Team</a>
</p>
