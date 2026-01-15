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
drop policy if exists "Users can read own role" on public.user_roles;
create policy "Users can read own role" on public.user_roles
  for select
  using (auth.uid() = user_id);

-- Policy: Superadmins can manage all roles
drop policy if exists "Superadmins can manage roles" on public.user_roles;
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

-- Function to get current user's role
create or replace function public.get_my_role()
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  return (
    select role from public.user_roles
    where user_id = auth.uid()
    limit 1
  );
end;
$$;

-- Update RLS policies for other tables to use roles

-- Blog Posts
drop policy if exists "Allow authenticated manage" on public.blog_posts;
drop policy if exists "Allow superadmin and blog_editor manage" on public.blog_posts;
create policy "Allow superadmin and blog_editor manage" on public.blog_posts
  for all
  using (public.is_superadmin() or public.has_role('blog_editor'));

-- Team Members
drop policy if exists "Allow authenticated manage" on public.team_members;
drop policy if exists "Allow superadmin and team_editor manage" on public.team_members;
create policy "Allow superadmin and team_editor manage" on public.team_members
  for all
  using (public.is_superadmin() or public.has_role('team_editor'));

-- Site Settings
drop policy if exists "Allow authenticated manage" on public.site_settings;
drop policy if exists "Allow superadmin manage settings" on public.site_settings;
create policy "Allow superadmin manage settings" on public.site_settings
  for all
  using (public.is_superadmin());

-- Waitlist
drop policy if exists "Allow authenticated users to manage waitlist" on public.waitlist;
drop policy if exists "Allow superadmin and waitlist_viewer manage" on public.waitlist;
create policy "Allow superadmin and waitlist_viewer manage" on public.waitlist
  for all
  using (public.is_superadmin() or public.has_role('waitlist_viewer'));

-- Function to list users and their roles (accessible only to superadmins)
create or replace function public.get_all_user_roles()
returns table (
    user_id uuid,
    email text,
    role text,
    created_at timestamptz,
    updated_at timestamptz
) 
language plpgsql
security definer
set search_path = public
as $$
begin
    -- Check if the caller is a superadmin
    if not public.is_superadmin() then
        return;
    end if;

    return query
    select 
        au.id,
        au.email::text,
        ur.role,
        ur.created_at,
        ur.updated_at
    from auth.users au
    left join public.user_roles ur on au.id = ur.user_id;
end;
$$;

-- Drop the insecure view if it exists
drop view if exists public.user_roles_view;

-- Note: To manually assign superadmin from SQL:
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'superadmin') ON CONFLICT (user_id) DO UPDATE SET role = 'superadmin';
