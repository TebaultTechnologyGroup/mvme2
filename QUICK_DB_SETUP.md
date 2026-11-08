# Quick Database Setup - Copy & Paste Solution

## The Fastest Way to Set Up

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New query**

### Step 2: Copy This Entire SQL Block

```sql
-- Create master_resumes table
create table if not exists public.master_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text default 'Master Resume',
  work_experience jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.master_resumes enable row level security;

create policy "Users can access their own master resumes"
  on public.master_resumes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_master_resumes_user_id on public.master_resumes(user_id);
create index if not exists idx_master_resumes_created_at on public.master_resumes(created_at desc);
create index if not exists idx_master_resumes_updated_at on public.master_resumes(updated_at desc);

alter table public.uploaded_resumes 
add column if not exists master_resume_id uuid references public.master_resumes(id) on delete set null;

create index if not exists idx_uploaded_resumes_master_id on public.uploaded_resumes(master_resume_id);
```

### Step 3: Paste & Run
1. Paste the SQL into the editor
2. Click **Run** button (or press Ctrl+Enter)
3. Wait for **Success** message

### Step 4: Done! ✅

Your database is now ready for the resume builder.

---

## Verify It Worked

In the same SQL Editor, run this to confirm:

```sql
-- Should return: CREATE TABLE
\d public.master_resumes
```

Or check the Table Editor:
1. Click **Table Editor** (left sidebar)
2. Look for `master_resumes` in the list
3. Should see 8 columns

---

## Troubleshooting

### I got an error about the table already existing
**Solution**: That's fine! Just try running the SQL again. The `if not exists` prevents errors.

### I don't see the table in Table Editor
**Solution**: 
1. Refresh the page (F5)
2. Or scroll down in the table list
3. Make sure you're in the right project

### I got a permission error
**Solution**: 
1. Make sure you're logged in with the right account
2. You should be the project owner or have admin role
3. Try logging out and back in

---

## Next Steps

1. ✅ Database is set up
2. Go back to your application
3. Try uploading a resume in the Getting Started page
4. The resume will be parsed and stored in `master_resumes`
5. Navigate to Resume Builder to edit it

---

## What Got Created

| Item | Purpose |
|------|---------|
| `master_resumes` table | Stores all resume data |
| `user_id` column | Links resume to user |
| 4 JSONB columns | Stores work_experience, education, skills, projects |
| RLS Policy | Users can only see their own resumes |
| 3 Indexes | Makes queries fast |
| `master_resume_id` | Links uploaded files to parsed resumes |

---

**Time to Complete**: < 1 minute  
**Difficulty**: 🟢 Very Easy  
**Status**: Ready to use after setup!
