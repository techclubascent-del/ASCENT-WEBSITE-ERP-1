-- Migration 003: Audit Logs for System Observability

create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource text,
  metadata jsonb default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.audit_logs enable row level security;

-- Only super admins can read audit logs
create policy "Super Admins can read all audit logs"
  on public.audit_logs for select
  using ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin' );

-- Anyone (or the backend acting as a service role) can insert audit logs
create policy "Anyone can insert audit logs"
  on public.audit_logs for insert
  with check (true);

-- Enable realtime for audit_logs
alter publication supabase_realtime add table public.audit_logs;
