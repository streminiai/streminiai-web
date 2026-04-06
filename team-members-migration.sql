-- Team Members Migration — Add profile editing fields
-- Run this in your Supabase SQL Editor AFTER the initial team_members table exists

-- Add new columns
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'linear-gradient(135deg,#0071e3,#34aadc)',
  ADD COLUMN IF NOT EXISTS color_key TEXT DEFAULT 'blue',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS website_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT false;

-- Create index on username for fast login lookups
CREATE INDEX IF NOT EXISTS idx_team_members_username ON public.team_members(username);

-- Allow public read of non-sensitive fields (existing policy should cover this)
-- Members update their own rows via the API route (server-side with service role key)
-- So no additional RLS policy is needed for self-edit — the API uses the admin client.

-- Seed initial usernames/passwords for existing members
-- Replace these hashes with actual bcrypt hashes before deploying.
-- You can generate them at https://bcrypt-generator.com/ or via the API.
--
-- Example (password: kyzor2026):
-- UPDATE public.team_members SET username = 'kyzor', password_hash = '$2a$10$...' WHERE name = 'KRISHNA ARORA';
