-- Run this once in Supabase SQL Editor: https://supabase.com/dashboard/project/hxvvigkrqlcdkzlcwkot/sql/new

create table if not exists public.departments (
  department text primary key,
  image_url text,
  updated_at timestamptz not null default now()
);

alter table public.departments enable row level security;

-- Anyone (including the public site, using the anon key) can read department images
create policy "Public can read departments"
  on public.departments for select
  using (true);

-- Only logged-in admin users (the admin dashboard) can add/edit department images
create policy "Authenticated can insert departments"
  on public.departments for insert
  to authenticated
  with check (true);

create policy "Authenticated can update departments"
  on public.departments for update
  to authenticated
  using (true)
  with check (true);
