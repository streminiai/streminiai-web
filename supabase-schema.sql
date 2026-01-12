-- Stremini Waitlist Database Schema
-- Run this in your Supabase SQL Editor

-- Create the waitlist table
create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  status text default 'pending' check (status in ('pending', 'approved', 'removed')),
  source text default 'website',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  approved_at timestamp with time zone,
  notes text
);

-- Create an index for faster email lookups
create index if not exists idx_waitlist_email on public.waitlist(email);

-- Create an index for status filtering
create index if not exists idx_waitlist_status on public.waitlist(status);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Drop existing policies to make the script idempotent
drop policy if exists "Allow public insert" on public.waitlist;
drop policy if exists "Allow public select" on public.waitlist;
drop policy if exists "Allow authenticated read" on public.waitlist;
drop policy if exists "Allow authenticated update" on public.waitlist;
drop policy if exists "Allow authenticated delete" on public.waitlist;

-- Policy: Allow anyone to insert (for waitlist signups)
create policy "Allow public insert" on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- Policy: Allow anyone to check if they are already on the list (by email)
-- This is needed because PostgREST often checks for existing records or returns the inserted row
create policy "Allow public select" on public.waitlist
  for select
  to anon, authenticated
  using (true);

-- Policy: Allow authenticated users to update entries
create policy "Allow authenticated update" on public.waitlist
  for update
  to authenticated
  using (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete entries
create policy "Allow authenticated delete" on public.waitlist
  for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant insert, select on public.waitlist to anon;
grant all on public.waitlist to authenticated;
