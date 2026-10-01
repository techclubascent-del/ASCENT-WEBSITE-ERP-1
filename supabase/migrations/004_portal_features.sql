-- Add missing tables for portal features

-- 5. POSTS
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  video_url text,
  github_url text,
  demo_url text,
  tech_stack text[],
  is_archived boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for posts
alter table public.posts enable row level security;

create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Users can insert their own posts" on public.posts for insert with check (auth.uid() IN (select user_id from public.profiles where id = author_id));
create policy "Users can update their own posts" on public.posts for update using (auth.uid() IN (select user_id from public.profiles where id = author_id));
create policy "Users can delete their own posts" on public.posts for delete using (auth.uid() IN (select user_id from public.profiles where id = author_id));


-- 6. POST LIKES
create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;
create policy "Post likes are viewable by everyone" on public.post_likes for select using (true);
create policy "Users can insert their own likes" on public.post_likes for insert with check (auth.uid() IN (select user_id from public.profiles where id = user_id));
create policy "Users can delete their own likes" on public.post_likes for delete using (auth.uid() IN (select user_id from public.profiles where id = user_id));


-- 7. POST COMMENTS
create table public.post_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.post_comments enable row level security;
create policy "Post comments are viewable by everyone" on public.post_comments for select using (true);
create policy "Users can insert their own comments" on public.post_comments for insert with check (auth.uid() IN (select user_id from public.profiles where id = author_id));
create policy "Users can update their own comments" on public.post_comments for update using (auth.uid() IN (select user_id from public.profiles where id = author_id));
create policy "Users can delete their own comments" on public.post_comments for delete using (auth.uid() IN (select user_id from public.profiles where id = author_id));


-- 8. CERTIFICATES
create table public.certificates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text not null,
  issuer text not null,
  description text,
  verification_code text unique not null,
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.certificates enable row level security;
create policy "Certificates are viewable by everyone" on public.certificates for select using (true);
create policy "Admins can insert certificates" on public.certificates for insert with check ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );
create policy "Admins can update certificates" on public.certificates for update using ( (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'organizer') );


-- 9. MESSAGES
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;
create policy "Users can view messages they sent or received" on public.messages for select 
using (
  auth.uid() IN (select user_id from public.profiles where id = sender_id) OR 
  auth.uid() IN (select user_id from public.profiles where id = receiver_id)
);
create policy "Users can insert messages they send" on public.messages for insert 
with check (auth.uid() IN (select user_id from public.profiles where id = sender_id));
create policy "Users can update read status of messages they received" on public.messages for update 
using (auth.uid() IN (select user_id from public.profiles where id = receiver_id));
