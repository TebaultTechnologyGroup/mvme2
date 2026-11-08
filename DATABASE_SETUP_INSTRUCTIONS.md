# Database Setup Instructions

## Quick Setup (Recommended)

### Option 1: Using Supabase Dashboard (Easiest)

1. **Log in to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Run the Migration**
   - Copy the SQL from `supabase/migrations/20261107_create_master_resumes.sql`
   - Paste it into the SQL editor
   - Click "Run"
   - Wait for success message

4. **Verify the Table**
   - Go to "Table Editor" in the left sidebar
   - You should see `master_resumes` in the list
   - Click on it to see the columns and data

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Run the migration
supabase migration up
```

## Manual SQL Setup

If you prefer to run the SQL directly, execute the following in your Supabase SQL Editor:

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

-- Enable RLS (Row Level Security)
alter table public.master_resumes enable row level security;

-- Create RLS policy: Users can access their own resumes
create policy "Users can access their own master resumes"
  on public.master_resumes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_master_resumes_user_id on public.master_resumes(user_id);
create index if not exists idx_master_resumes_created_at on public.master_resumes(created_at desc);
create index if not exists idx_master_resumes_updated_at on public.master_resumes(updated_at desc);

-- Add master_resume_id column to uploaded_resumes if it doesn't exist
alter table public.uploaded_resumes 
add column if not exists master_resume_id uuid references public.master_resumes(id) on delete set null;

-- Create index for uploaded_resumes to master_resumes relationship
create index if not exists idx_uploaded_resumes_master_id on public.uploaded_resumes(master_resume_id);
```

## Verification Checklist

After running the migration, verify everything is set up correctly:

### ✓ Table Exists
```sql
select * from information_schema.tables 
where table_name = 'master_resumes';
```
Should return 1 row.

### ✓ Columns Are Correct
```sql
select column_name, data_type 
from information_schema.columns 
where table_name = 'master_resumes'
order by ordinal_position;
```
Should show:
- id (uuid)
- user_id (uuid)
- title (text)
- work_experience (jsonb)
- education (jsonb)
- skills (jsonb)
- projects (jsonb)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

### ✓ RLS is Enabled
```sql
select tablename, rowsecurity 
from pg_tables 
where tablename = 'master_resumes';
```
Should show `rowsecurity = true`.

### ✓ RLS Policy Exists
```sql
select policyname, qual, with_check 
from pg_policies 
where tablename = 'master_resumes';
```
Should show the "Users can access their own master resumes" policy.

### ✓ Indexes Are Created
```sql
select indexname 
from pg_indexes 
where tablename = 'master_resumes';
```
Should show:
- idx_master_resumes_user_id
- idx_master_resumes_created_at
- idx_master_resumes_updated_at
- pk_master_resumes (primary key)

### ✓ Master Resume ID Column in uploaded_resumes
```sql
select column_name 
from information_schema.columns 
where table_name = 'uploaded_resumes' 
and column_name = 'master_resume_id';
```
Should return 1 row.

## Troubleshooting

### "Table already exists" Error
This is fine - the migration uses `if not exists` clauses. Just run it again.

### "Column already exists" Error
This is also fine - the migration uses `if not exists`. Just run it again.

### "Permission denied" Error
You may need the service role key. Contact your Supabase project admin.

### RLS Policy Not Working
Make sure:
1. RLS is enabled on the table
2. The policy uses `auth.uid()` correctly
3. Users are authenticated before accessing the table

## Testing the Setup

After setup, test by creating a resume via the API:

```bash
# Using curl
curl -X POST http://localhost:5173/api/parse-resume \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"resumeId": "test-resume-id"}'
```

Or test in TypeScript:

```typescript
import { supabase } from '@/lib/supabase';

async function testMasterResume() {
  const { data, error } = await supabase
    .from('master_resumes')
    .insert({
      user_id: 'your-user-id',
      title: 'Test Resume',
      work_experience: [],
      education: [],
      skills: [],
      projects: []
    })
    .select()
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

testMasterResume();
```

## Next Steps

1. **Run the migration** using one of the methods above
2. **Verify all tables and policies** using the verification checklist
3. **Test resume upload** via the GettingStarted component
4. **Confirm resume appears** in ResumeBuilder

## Important Notes

- The `master_resumes` table uses JSONB for flexible storage
- RLS ensures users can only access their own resumes
- Indexes improve query performance
- `master_resume_id` in `uploaded_resumes` tracks which resume was created from which upload

## Rolling Back (If Needed)

If you need to remove the table:

```sql
drop table if not exists public.master_resumes cascade;
```

⚠️ **Warning**: This will delete all resume data. Only use if absolutely necessary.

## Reference

- [Supabase PostgreSQL Documentation](https://supabase.com/docs/guides/database)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)

---

**Status**: Setup Required  
**Estimated Time**: 5 minutes  
**Difficulty**: Easy
