-- Core Schema for ASCENT

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select 
  using (true);

create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = user_id);

-- Trigger to create a profile automatically when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. OPPORTUNITIES TABLE
create type opportunity_status as enum ('draft', 'published', 'closed');

create table public.opportunities (
  id uuid default uuid_generate_v4() primary key,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  description text not null,
  status opportunity_status default 'draft'::opportunity_status not null,
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for opportunities
alter table public.opportunities enable row level security;

-- Opportunities Policies
create policy "Anyone can read published opportunities" 
  on public.opportunities for select 
  using (status = 'published');

create policy "Admins and Organizers can read all opportunities"
  on public.opportunities for select
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );

create policy "Admins and Organizers can insert opportunities"
  on public.opportunities for insert
  with check ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );

create policy "Admins and Organizers can update opportunities"
  on public.opportunities for update
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );


-- 3. APPLICATIONS TABLE
create type application_status as enum ('draft', 'submitted', 'under_review', 'accepted', 'rejected');

create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  status application_status default 'draft'::application_status not null,
  answers jsonb default '{}'::jsonb not null,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, opportunity_id) -- One application per opportunity per user
);

-- Turn on RLS for applications
alter table public.applications enable row level security;

-- Applications Policies
create policy "Users can view their own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Admins and Organizers can view all applications"
  on public.applications for select
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );

create policy "Users can insert their own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own draft applications"
  on public.applications for update
  using (auth.uid() = user_id and status = 'draft');

create policy "Admins and Organizers can update all applications"
  on public.applications for update
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );


-- 4. EVENTS TABLE
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  description text not null,
  event_date timestamp with time zone not null,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for events
alter table public.events enable row level security;

-- Events Policies
create policy "Anyone can read events"
  on public.events for select
  using (true);

create policy "Admins and Organizers can insert events"
  on public.events for insert
  with check ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );

create policy "Admins and Organizers can update events"
  on public.events for update
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );
