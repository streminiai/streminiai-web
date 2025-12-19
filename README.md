# Stremini Waitlist Website

A modern Next.js 14 waitlist and download page with an admin panel for managing waitlist entries. Built with Framer Motion animations and Supabase backend.

## Features

- 🎨 **Beautiful UI** - Dark theme with glassmorphism, gradient effects, and floating particles
- ✨ **Framer Motion** - Smooth animations throughout the app
- 📧 **Waitlist Signup** - Email collection with validation and duplicate detection
- 👨‍💼 **Admin Panel** - Full waitlist management dashboard
- 🔐 **Authentication** - Secure admin access via Supabase Auth
- 📊 **Analytics** - Stats cards showing signup metrics
- 🔍 **Search & Filter** - Find entries by email, name, or status
- 📥 **CSV Export** - Download waitlist data for external use

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Auth**: Supabase Auth

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready

### 2. Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and run it
3. This creates the `waitlist` table with proper security policies

### 3. Create Admin User

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add user** → **Create new user**
3. Enter your admin email and password
4. You'll use these credentials to log into the admin panel

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Find these values in Supabase: **Settings** → **API**

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the waitlist page.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx      # Admin dashboard
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout with SEO
│   └── page.tsx          # Main waitlist page
└── lib/
    └── supabase.ts       # Supabase client
```

## Admin Panel Features

- **View all signups** with email, name, status, and date
- **Approve users** to grant them access
- **Remove users** from the waitlist
- **Delete users** permanently
- **Search** by email or name
- **Filter** by status (pending, approved, removed)
- **Export CSV** of all entries

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add these in your hosting platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## License

MIT License - feel free to use this for your own projects!
