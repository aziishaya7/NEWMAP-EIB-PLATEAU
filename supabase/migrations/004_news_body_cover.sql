-- News full article body + optional cover image (gallery bucket path, e.g. news/...).
alter table public.news_posts
  add column if not exists body text not null default '',
  add column if not exists cover_image_path text;
