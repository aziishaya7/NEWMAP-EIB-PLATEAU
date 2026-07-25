-- NEWMAP-EIB Plateau — gallery foundation
-- Run once in Supabase Dashboard → SQL Editor → New query → Run

-- 1) Gallery metadata table
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_path text not null,
  status text not null default 'approved'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists gallery_items_status_created_at_idx
  on public.gallery_items (status, created_at desc);

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read approved gallery items" on public.gallery_items;
create policy "Public can read approved gallery items"
  on public.gallery_items
  for select
  to anon, authenticated
  using (status = 'approved');

-- Inserts/updates go through the Next.js API with the service role (bypasses RLS).

-- 2) Public storage bucket for gallery images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read of gallery objects
drop policy if exists "Public read gallery images" on storage.objects;
create policy "Public read gallery images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gallery');

-- Optional: allow authenticated uploads later; for now signed uploads use service role.
drop policy if exists "Authenticated upload gallery images" on storage.objects;
create policy "Authenticated upload gallery images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery');
