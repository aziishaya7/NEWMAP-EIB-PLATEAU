-- Public staff directory managed from the admin console.
create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  email text not null default '',
  phone text not null default '',
  image_path text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_members_name_not_blank check (char_length(btrim(name)) > 0),
  constraint staff_members_role_not_blank check (char_length(btrim(role)) > 0),
  constraint staff_members_sort_order_nonneg check (sort_order >= 0)
);

drop trigger if exists staff_members_set_updated_at on public.staff_members;
create trigger staff_members_set_updated_at
  before update on public.staff_members
  for each row execute function public.set_updated_at();

create index if not exists staff_members_public_order_idx
  on public.staff_members (sort_order, name)
  where published;

alter table public.staff_members enable row level security;

drop policy if exists "Public can read published staff" on public.staff_members;
create policy "Public can read published staff"
  on public.staff_members for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admins can read all staff" on public.staff_members;
create policy "Admins can read all staff"
  on public.staff_members for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can insert staff" on public.staff_members;
create policy "Admins can insert staff"
  on public.staff_members for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update staff" on public.staff_members;
create policy "Admins can update staff"
  on public.staff_members for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete staff" on public.staff_members;
create policy "Admins can delete staff"
  on public.staff_members for delete
  to authenticated
  using ((select public.is_admin()));

grant select on public.staff_members to anon, authenticated;
grant insert, update, delete on public.staff_members to authenticated;

insert into public.staff_members (name, role, email, phone, image_path, published, sort_order)
select * from (values
  ('Amina Yusuf', 'State Project Coordinator', 'amina.yusuf@newmapeibplateau.example', '+234 803 000 0001', '/staff/staff-1.jpg', true, 1),
  ('Chinedu Okonkwo', 'Environmental Specialist', 'chinedu.okonkwo@newmapeibplateau.example', '+234 803 000 0002', '/staff/staff-2.jpg', true, 2),
  ('Grace Pam', 'Community Liaison Officer', 'grace.pam@newmapeibplateau.example', '+234 803 000 0003', '/staff/staff-3.jpg', true, 3),
  ('Ibrahim Danladi', 'Civil Engineer', 'ibrahim.danladi@newmapeibplateau.example', '+234 803 000 0004', '/staff/staff-4.jpg', true, 4),
  ('Sarah Dung', 'Monitoring and Evaluation Officer', 'sarah.dung@newmapeibplateau.example', '+234 803 000 0005', '/staff/staff-5.jpg', true, 5),
  ('Peter Gyang', 'Communications Officer', 'peter.gyang@newmapeibplateau.example', '+234 803 000 0006', '/staff/staff-6.jpg', true, 6)
) as v(name, role, email, phone, image_path, published, sort_order)
where not exists (select 1 from public.staff_members limit 1);
