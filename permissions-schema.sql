-- Create user_roles table
create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null check (role in ('superadmin', 'blog_editor', 'team_editor', 'waitlist_viewer')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Policy: Users can read their own role
create policy "Users can read own role" on public.user_roles
  for select
  using (auth.uid() = user_id);

-- Policy: Superadmins can manage all roles
create policy "Superadmins can manage roles" on public.user_roles
  for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'superadmin'
    )
  );

-- Function to check if user has a specific role
create or replace function public.has_role(required_role text)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = required_role
  );
end;
$$ language plpgsql security definer;

-- Function to check if user is superadmin
create or replace function public.is_superadmin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'superadmin'
  );
end;
$$ language plpgsql security definer;

-- Update RLS policies for other tables to use roles

-- Blog Posts
drop policy if exists "Allow authenticated manage" on public.blog_posts;
create policy "Allow superadmin and blog_editor manage" on public.blog_posts
  for all
  using (public.is_superadmin() or public.has_role('blog_editor'));

-- Team Members
drop policy if exists "Allow authenticated manage" on public.team_members;
create policy "Allow superadmin and team_editor manage" on public.team_members
  for all
  using (public.is_superadmin() or public.has_role('team_editor'));

-- Site Settings
drop policy if exists "Allow authenticated manage" on public.site_settings;
create policy "Allow superadmin manage settings" on public.site_settings
  for all
  using (public.is_superadmin());

-- Waitlist
drop policy if exists "Allow superadmin and waitlist_viewer manage" on public.waitlist;
create policy "Allow superadmin and waitlist_viewer manage" on public.waitlist
  for all
  using (public.is_superadmin() or public.has_role('waitlist_viewer'));

-- View to list users and their roles (accessible only to superadmins)
create or replace view public.user_roles_view as
select 
    au.id as user_id,
    au.email,
    ur.role,
    ur.created_at,
    ur.updated_at
from auth.users au
left join public.user_roles ur on au.id = ur.user_id;

-- Grant access to the view
grant select on public.user_roles_view to authenticated;

-- Note: To manually assign superadmin from SQL:
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'superadmin') ON CONFLICT (user_id) DO UPDATE SET role = 'superadmin';
