-- Migration 002: Role System Refactor & Schema Enhancements

-- 1. DROP OLD POLICIES
drop policy if exists "Admins and Organizers can read all opportunities" on public.opportunities;
drop policy if exists "Admins and Organizers can insert opportunities" on public.opportunities;
drop policy if exists "Admins and Organizers can update opportunities" on public.opportunities;

drop policy if exists "Admins and Organizers can view all applications" on public.applications;
drop policy if exists "Admins and Organizers can update all applications" on public.applications;

drop policy if exists "Admins and Organizers can insert events" on public.events;
drop policy if exists "Admins and Organizers can update events" on public.events;

-- 2. CREATE NEW ROLE POLICIES (admin & super_admin)
-- Opportunities
create policy "Admins and Super Admins can read all opportunities"
  on public.opportunities for select
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );

create policy "Admins and Super Admins can insert opportunities"
  on public.opportunities for insert
  with check ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );

create policy "Admins and Super Admins can update opportunities"
  on public.opportunities for update
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );

-- Applications
create policy "Admins and Super Admins can view all applications"
  on public.applications for select
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );

create policy "Admins and Super Admins can update all applications"
  on public.applications for update
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );

-- Events
create policy "Admins and Super Admins can insert events"
  on public.events for insert
  with check ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );

create policy "Admins and Super Admins can update events"
  on public.events for update
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );

-- Profiles (Admins can manage all profiles now)
create policy "Admins and Super Admins can update all profiles"
  on public.profiles for update
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );


-- 3. SCHEMA ENHANCEMENTS
-- Add scheduled_at to opportunities
alter table public.opportunities add column published_at timestamp with time zone;

-- Create Certificates table
create table public.certificates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  issued_by text,
  issued_at timestamp with time zone not null,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.certificates enable row level security;

create policy "Users can view their own certificates"
  on public.certificates for select
  using (auth.uid() = user_id);

create policy "Admins and Super Admins can manage all certificates"
  on public.certificates for all
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );


-- Create Attendance table
create table public.attendance (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  event_id uuid references public.events(id) on delete cascade not null,
  attended boolean default false not null,
  marked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, event_id)
);

alter table public.attendance enable row level security;

create policy "Users can view their own attendance"
  on public.attendance for select
  using (auth.uid() = user_id);

create policy "Admins and Super Admins can manage all attendance"
  on public.attendance for all
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'super_admin') );
