# Stremini Team Page — Drop-in Integration Guide

## Files to add to your Next.js project

```
your-project/
├── data/
│   └── team.json              ← team data (auto-updated on profile saves)
├── pages/
│   ├── team.jsx               ← team page (replaces current /team)
│   └── api/
│       └── team/
│           ├── index.js       ← GET all members / POST login
│           └── [id].js        ← PUT update member profile
```

## Step-by-step setup

### 1. Copy files
Drop all 4 files into your project exactly as the structure above.

### 2. Update passwords in data/team.json
Change the default passwords before deploying:
```json
{ "username": "kyzor", "password": "YOUR_SECURE_PASSWORD" }
```

### 3. Make data/ writable on server
On Vercel: data/team.json writes won't persist between deployments.
**Recommended for Vercel**: replace file-based storage with a free DB.

#### Option A — Firebase Realtime DB (free, you already know it)
In both API files, replace `readTeam()` and `writeTeam()` with:
```js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
// use your existing Firebase config from the project
```

#### Option B — Supabase (free, PostgreSQL)
```js
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
// GET: const { data } = await supabase.from('team').select('*');
// PUT: await supabase.from('team').update(updates).eq('id', id);
```

#### Option C — MongoDB Atlas (free 512MB)
Already popular with Next.js projects.

### 4. If you're on Vercel — set env vars
Add to your Vercel project settings:
```
FIREBASE_API_KEY=...
FIREBASE_DB_URL=...
```

### 5. Update nav links in team.jsx
The nav uses Next.js `<Link>` pointing to your existing routes.
Make sure routes match your current site:
- `/` Home
- `/features` Features  
- `/gallery` Gallery
- `/blog` Blog
- `/about` About
- `/careers` Careers
- `/waitlist` Get in Touch CTA

### 6. Deploy
```bash
git add .
git commit -m "feat: team page with staff profile editing"
git push
```

## Staff Login
Footer → "Staff Login" → enter username + password → edit panel opens.

| Member  | Username | Default Password |
|---------|----------|-----------------|
| Kyzor   | kyzor    | kyzor2026       |
| CIPHER  | cipher   | cipher2026      |
| Member2 | member2  | member2026      |
| Member3 | member3  | member3026      |

**Change passwords in data/team.json before going live.**

## How profile editing works
1. Staff member clicks "Staff Login" in footer
2. Enters their username + password → hits `/api/team` (POST)
3. On success → edit panel opens
4. They edit name, bio, role, photo, skills, socials
5. Save → hits `/api/team/[id]` (PUT) with their credentials
6. Server verifies credentials again, updates data/team.json
7. Page re-renders with new data instantly
