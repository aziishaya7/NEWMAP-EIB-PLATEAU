# Supabase setup (NEWMAP-EIB Plateau)

## Already done in code

- Supabase JS clients (`src/lib/supabase/*`)
- Auth (email/password) with middleware session refresh
- Profiles, protected uploads, admin CMS
- API routes for uploads, gallery, and admin CRUD
- Gallery / projects / news read from Postgres + Storage

## You must do once in the Supabase Dashboard

### 1. Confirm keys in `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SEED_ADMIN_PASSWORD=your-strong-password
```

(Project Settings → API)

### 2. Run SQL migrations (in order)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Go to **SQL Editor** → **New query**
3. Paste and run [`supabase/migrations/001_gallery.sql`](migrations/001_gallery.sql)
4. Paste and run [`supabase/migrations/002_auth_cms.sql`](migrations/002_auth_cms.sql)

This creates:

- `gallery_items` (+ `user_id` ownership)
- `profiles`, `projects`, `news_posts`, `app_settings`
- RLS policies and seed projects/news
- Storage `gallery` bucket (from migration 001)

### 3. Auth provider settings

1. **Authentication → Providers → Email** — enabled
2. For local testing you may turn **off** “Confirm email” (Authentication → Providers → Email)
3. Add site URL / redirect: `http://localhost:3000` and callback `http://localhost:3000/auth/callback`

### 4. Seed the super admin (recommended)

1. Edit [`supabase/seed-admin.config.js`](seed-admin.config.js) if you want a different email / display name.
2. Add to `.env.local`:

```env
SEED_ADMIN_PASSWORD=your-strong-password
```

3. Run:

```bash
npm run seed:admin
```

This creates (or updates) the account with `app_metadata.role = admin` and `super_admin = true`. Sign in at `/login` with that email and password.

To change the super admin later: update the config and/or `SEED_ADMIN_PASSWORD`, then run `npm run seed:admin` again. The seeded account cannot be demoted in the UI; only the super admin can create other admins or promote users.

Optional env overrides: `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME` (see [`.env.example`](../.env.example)).

### 5. Verify

- **Table Editor** → `profiles`, `projects`, `news_posts`, `app_settings`, `gallery_items`
- **Storage** → `gallery` bucket
- App smoke test:

```bash
npm run dev
```

| Check | Expected |
|-------|----------|
| `/login` with seeded admin | Access `/admin` |
| `/admin/users` | Create users / admins |
| `/upload` (logged in) | Upload → pending (user) or approved (admin) |
| `/profile` | Display name + my uploads |
| `/admin/settings` | Toggle open registration |
| `/projects`, `/news`, `/gallery` | CMS / moderated public content |

### Invite-only later

In **Admin → Settings**, turn **Open registration** off. Create accounts from **Admin → Users** instead.
