-- Team Members Table
-- Run this in your Supabase SQL Editor

create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  category text not null check (category in ('founder', 'co-founder', 'developer', 'marketing', 'research')),
  image_url text,
  linkedin_url text,
  twitter_url text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create indexes
create index if not exists idx_team_members_category on public.team_members(category);
create index if not exists idx_team_members_order on public.team_members(display_order);

-- Enable RLS
alter table public.team_members enable row level security;

-- Allow public read access
create policy "Allow public read" on public.team_members
  for select
  using (is_active = true);

-- Allow authenticated users full access
create policy "Allow authenticated full access" on public.team_members
  for all
  using (auth.role() = 'authenticated');

-- Grant permissions
grant select on public.team_members to anon;
grant all on public.team_members to authenticated;

-- Insert initial team data
insert into public.team_members (name, role, category, display_order) values
-- Founder
('KRISHNA ARORA', 'Founder', 'founder', 1),

-- Co-Founders
('Mehridin Yo''ldoshev', 'Co-Founder', 'co-founder', 1),
('Vishwajeet', 'Co-Founder', 'co-founder', 2),
('Vector', 'Co-Founder', 'co-founder', 3),
('Energy', 'Co-Founder', 'co-founder', 4),

-- Developers
('Vishwajeet', 'Lead Dev 1', 'developer', 1),
('Vector', 'Lead Dev 2', 'developer', 2),
('Abhinanda Raghav', 'Developer', 'developer', 3),
('Arnav Sen', 'Developer', 'developer', 4),
('Tushar', 'Developer', 'developer', 5),
('Uday Preet Singh', 'Developer', 'developer', 6),
('Sanju', 'Developer', 'developer', 7),
('Sulaymon', 'Developer', 'developer', 8),

-- Marketing
('Restant', 'Marketing Head', 'marketing', 1),
('Edmund Mylliem Umlong', 'Marketing', 'marketing', 2),
('Khushi Kumari', 'Marketing', 'marketing', 3),
('Sanchita Barua', 'Marketing', 'marketing', 4),
('Elysian', 'Marketing', 'marketing', 5),
('Salifa', 'Marketing', 'marketing', 6),

-- Research & Operations
('Mehridin Yo''ldoshev', 'Head of Research', 'research', 1),
('Arnav Sen', 'Research', 'research', 2),
('Pankaj', 'Research', 'research', 3),
('Uday Preet Singh', 'Operations', 'research', 4),
('Elysian', 'Research', 'research', 5),
('Sanchita Barua', 'Research', 'research', 6),
('Auroja Peshin', 'Research', 'research', 7),
('Gurvit Daga', 'Research', 'research', 8),
('Riddhi', 'Research', 'research', 9);
