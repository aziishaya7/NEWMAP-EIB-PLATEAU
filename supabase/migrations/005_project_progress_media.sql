-- Link gallery progress photos to projects and store % at capture time.
alter table public.gallery_items
  add column if not exists project_id uuid references public.projects(id) on delete set null,
  add column if not exists progress_pct int not null default 0
    check (progress_pct >= 0 and progress_pct <= 100);

create index if not exists gallery_items_project_created_idx
  on public.gallery_items (project_id, created_at desc);
