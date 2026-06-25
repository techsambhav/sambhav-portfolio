# Supabase Setup Guide

Follow these steps to configure your Supabase backend for the portfolio admin panel.

---

## 1. Database Table Setup

Go to your Supabase Dashboard, open the **SQL Editor**, click **New query**, paste the following SQL, and click **Run**:

```sql
-- =========================================================
-- 1. Create the media table for designs/videos
-- =========================================================
create table public.media (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  type text not null check (type in ('image', 'video')),
  src text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for media
alter table public.media enable row level security;

-- Policies for media
create policy "Allow public read access" on public.media for select to public using (true);
create policy "Allow authenticated admin CRUD" on public.media for all to authenticated using (true) with check (true);

-- =========================================================
-- 2. Create the projects table for Selected Work grid
-- =========================================================
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  initials text not null,
  cat text not null,
  name text not null,
  description text not null,
  featured boolean default false not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for projects
alter table public.projects enable row level security;

-- Policies for projects
create policy "Allow public projects read access" on public.projects for select to public using (true);
create policy "Allow authenticated admin projects CRUD" on public.projects for all to authenticated using (true) with check (true);
```

---

## 2. Storage Bucket Setup

To store uploaded designs (images) and videos:

1. Navigate to **Storage** in the left sidebar of the Supabase Dashboard.
2. Click **New bucket**.
3. Name the bucket `media`.
4. **Important**: Toggle the **Public** switch to **ON** (so anyone can view your images/videos).
5. Click **Save**.

### Configure Storage Policies

Next, click on **Policies** (or **Configuration** -> **Policies**) under Storage:

1. Look for the `media` bucket under **Storage Policies**.
2. Click **New Policy** and choose **For full customization**.
3. Create a policy for **Public Read Access**:
   - **Policy Name**: `Allow public download`
   - **Allowed operations**: `SELECT`
   - **Target roles**: `public`
   - **Expression (using SQL editor)**: `true`
4. Create a policy for **Admin Access** (to upload/delete files):
   - **Policy Name**: `Allow authenticated uploads and deletions`
   - **Allowed operations**: `INSERT`, `UPDATE`, `DELETE`
   - **Target roles**: `authenticated`
   - **Expression (using SQL editor)**: `true`

---

## 3. Create Admin User

To create a login account for your admin page:

1. Go to **Authentication** -> **Users** in the Supabase Dashboard.
2. Click **Add User** -> **Create User**.
3. Enter the email and password you want to use to log in to the admin panel.
4. Uncheck **Auto-confirm User** if you want to confirm via email, or leave it checked to immediately enable the login. (Recommended: keep it checked).
5. Click **Create User**.

---

## 4. Environment Variables

Create a file named `.env` in the root of your project directory (this file should be added to `.gitignore` so your secrets aren't exposed).

Add the following environment variables (you can find these in **Project Settings** -> **API** in the Supabase Dashboard):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

When deploying to Vercel, add these exact same environment variables under your Vercel Project Settings -> **Environment Variables**.
