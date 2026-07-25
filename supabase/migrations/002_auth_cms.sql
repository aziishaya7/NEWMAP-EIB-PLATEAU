-- NEWMAP-EIB Plateau — auth, profiles, CMS
-- Run after 001_gallery.sql in Supabase SQL Editor

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(split_part(new.email, '@', 1), ''), 'User')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for existing users
insert into public.profiles (id, display_name)
select
  u.id,
  coalesce(nullif(split_part(u.email, '@', 1), ''), 'User')
from auth.users u
on conflict (id) do nothing;

alter table public.profiles enable row level security;

drop policy if exists "Anyone can read profiles" on public.profiles;
create policy "Anyone can read profiles"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Gallery ownership
-- ---------------------------------------------------------------------------
alter table public.gallery_items
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists gallery_items_user_id_created_at_idx
  on public.gallery_items (user_id, created_at desc);

drop policy if exists "Public can read approved gallery items" on public.gallery_items;
create policy "Public can read approved gallery items"
  on public.gallery_items for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Owners can read own gallery items" on public.gallery_items;
create policy "Owners can read own gallery items"
  on public.gallery_items for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Admins can read all gallery items" on public.gallery_items;
create policy "Admins can read all gallery items"
  on public.gallery_items for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated can insert own gallery items" on public.gallery_items;
create policy "Authenticated can insert own gallery items"
  on public.gallery_items for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Admins can update gallery items" on public.gallery_items;
create policy "Admins can update gallery items"
  on public.gallery_items for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete gallery items" on public.gallery_items;
create policy "Admins can delete gallery items"
  on public.gallery_items for delete
  to authenticated
  using (public.is_admin());

grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;

-- ---------------------------------------------------------------------------
-- Projects CMS
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status_label text not null default '',
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create index if not exists projects_published_sort_idx
  on public.projects (published, sort_order, created_at desc);

alter table public.projects enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admins can read all projects" on public.projects;
create policy "Admins can read all projects"
  on public.projects for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

insert into public.projects (title, description, status_label, progress, published, sort_order)
select * from (values
  (
    'Jos North Flood Control Project',
    'Construction of primary and secondary storm water drains to mitigate severe flooding affecting over 500 households.',
    '75% Completed',
    75,
    true,
    1
  ),
  (
    'Shendam Watershed Stabilization',
    'Restoration of degraded lands through afforestation and the implementation of soil bioengineering techniques to control gullies.',
    '60% Completed',
    60,
    true,
    2
  ),
  (
    'Community Environmental Awareness Program',
    'Sensitizing local communities on solid waste management and sustainable land use practices.',
    'Ongoing',
    40,
    true,
    3
  )
) as v(title, description, status_label, progress, published, sort_order)
where not exists (select 1 from public.projects limit 1);

-- ---------------------------------------------------------------------------
-- News CMS
-- ---------------------------------------------------------------------------
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  published_at date not null default current_date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists news_posts_set_updated_at on public.news_posts;
create trigger news_posts_set_updated_at
  before update on public.news_posts
  for each row execute function public.set_updated_at();

create index if not exists news_posts_published_at_idx
  on public.news_posts (published, published_at desc);

alter table public.news_posts enable row level security;

drop policy if exists "Public can read published news" on public.news_posts;
create policy "Public can read published news"
  on public.news_posts for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admins can read all news" on public.news_posts;
create policy "Admins can read all news"
  on public.news_posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert news" on public.news_posts;
create policy "Admins can insert news"
  on public.news_posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update news" on public.news_posts;
create policy "Admins can update news"
  on public.news_posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete news" on public.news_posts;
create policy "Admins can delete news"
  on public.news_posts for delete
  to authenticated
  using (public.is_admin());

grant select on public.news_posts to anon, authenticated;
grant insert, update, delete on public.news_posts to authenticated;

insert into public.news_posts (title, summary, published_at, published)
select * from (values
  (
    'NEWMAP-EIB Launches New Flood Mitigation Initiative in Plateau State',
    'In a collaborative effort with the State Government and the European Investment Bank, a new flagship program has been launched to construct comprehensive drainage networks in prone areas.',
    '2026-03-10'::date,
    true
  ),
  (
    'Community Stakeholder Engagement Held in Jos South',
    'Local leaders, civil society organizations, and community members gathered to discuss the integration of sustainable land use practices.',
    '2026-02-24'::date,
    true
  ),
  (
    'Erosion Control Measures See Positive Results in Shendam',
    'Recent data shows a significant reduction in topsoil loss following the implementation of vegetative barriers and structural engineering solutions last year.',
    '2026-01-15'::date,
    true
  )
) as v(title, summary, published_at, published)
where not exists (select 1 from public.news_posts limit 1);

-- ---------------------------------------------------------------------------
-- App settings (registration toggle)
-- ---------------------------------------------------------------------------
create table if not exists public.app_settings (
  id int primary key default 1 check (id = 1),
  registration_open boolean not null default true,
  updated_at timestamptz not null default now()
);

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

insert into public.app_settings (id, registration_open)
values (1, true)
on conflict (id) do nothing;

alter table public.app_settings enable row level security;

drop policy if exists "Anyone can read app settings" on public.app_settings;
create policy "Anyone can read app settings"
  on public.app_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can update app settings" on public.app_settings;
create policy "Admins can update app settings"
  on public.app_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.app_settings to anon, authenticated;
grant update on public.app_settings to authenticated;
