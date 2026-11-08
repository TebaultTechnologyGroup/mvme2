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
