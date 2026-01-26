-- Create user_roles table
create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  roles text[] not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Drop dependent policies before migration to allow dropping the 'role' column
drop policy if exists "Users can read own role" on public.user_roles;
drop policy if exists "Superadmins can manage roles" on public.user_roles;

-- Migration: If role column exists, convert to roles array
do $$
begin
  if exists (select 1 from information_schema.columns where table_name='user_roles' and column_name='role') then
    alter table public.user_roles add column if not exists roles_new text[] default '{}';
    update public.user_roles set roles_new = array[role];
    alter table public.user_roles drop column role;
    alter table public.user_roles rename column roles_new to roles;
    alter table public.user_roles alter column roles set not null;
  end if;
end $$;

-- Policy: Users can read their own role
create policy "Users can read own role" on public.user_roles
  for select
  using (auth.uid() = user_id);

-- Policy: Superadmins can manage all roles
create policy "Superadmins can manage roles" on public.user_roles
  for all
  using (public.is_superadmin());

-- Function to check if user has a specific role
create or replace function public.has_role(required_role text)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and required_role = any(roles)
  );
end;
$$ language plpgsql security definer;

-- Function to check if user is superadmin
create or replace function public.is_superadmin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and 'superadmin' = any(roles)
  );
end;
$$ language plpgsql security definer;

-- Function to get current user's roles
drop function if exists public.get_my_role();
create or replace function public.get_my_role()
returns text[]
language plpgsql
security definer
set search_path = public
as $$
begin
  return (
    select roles from public.user_roles
    where user_id = auth.uid()
    limit 1
  );
end;
$$;

-- Function to list users and their roles (accessible only to superadmins)
drop function if exists public.get_all_user_roles();
create or replace function public.get_all_user_roles()
returns table (
    user_id uuid,
    email text,
    roles text[],
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
        ur.roles,
        ur.created_at,
        ur.updated_at
    from auth.users au
    left join public.user_roles ur on au.id = ur.user_id;
end;
$$;

-- Function to add/update user roles by email
create or replace function public.add_user_role_by_email(target_email text, new_roles text[])
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    target_user_id uuid;
begin
    -- Check if the caller is a superadmin
    if not public.is_superadmin() then
        raise exception 'Unauthorized';
    end if;

    -- Find the user ID by email
    select id into target_user_id from auth.users where email = target_email;

    if target_user_id is null then
        raise exception 'User not found';
    end if;

    -- Upsert the roles
    insert into public.user_roles (user_id, roles, updated_at)
    values (target_user_id, new_roles, now())
    on conflict (user_id) do update
    set roles = new_roles, updated_at = now();

    return true;
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

-- Drop the insecure view if it exists
drop view if exists public.user_roles_view;

-- Note: To manually assign the FIRST superadmin (bypasses the function's security check):
-- INSERT INTO public.user_roles (user_id, roles)
-- SELECT id, array['superadmin'] FROM auth.users WHERE email = 'your-email@example.com'
-- ON CONFLICT (user_id) DO UPDATE SET roles = array['superadmin'];

-- Note: To add/update roles for other users (requires you to be a superadmin already):
-- SELECT public.add_user_role_by_email('other-user@example.com', array['blog_editor', 'team_editor']);
