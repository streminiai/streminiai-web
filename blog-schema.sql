-- Stremini Blog Database Schema
-- Run this in your Supabase SQL Editor

-- Create the blog_posts table
create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  author text default 'Stremini Team',
  featured_image_url text,
  tags text[] default '{}',
  is_published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create indexes for better performance
create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_published on public.blog_posts(is_published, published_at desc);
create index if not exists idx_blog_posts_tags on public.blog_posts using gin(tags);

-- Enable Row Level Security
alter table public.blog_posts enable row level security;

-- Policy: Allow public to read published posts
create policy "Allow public read published posts" on public.blog_posts
  for select
  using (is_published = true);

-- Policy: Allow authenticated users to read all posts
create policy "Allow authenticated read all" on public.blog_posts
  for select
  using (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert posts
create policy "Allow authenticated insert" on public.blog_posts
  for insert
  with check (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update posts
create policy "Allow authenticated update" on public.blog_posts
  for update
  using (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete posts
create policy "Allow authenticated delete" on public.blog_posts
  for delete
  using (auth.role() = 'authenticated');

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select on public.blog_posts to anon;
grant all on public.blog_posts to authenticated;

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to call the function before update
create trigger on_blog_post_updated
  before update on public.blog_posts
  for each row
  execute procedure public.handle_updated_at();
