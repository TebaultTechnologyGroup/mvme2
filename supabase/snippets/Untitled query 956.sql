alter table public.master_resumes 
add column if not exists name text,
add column if not exists email text,
add column if not exists phone text,
add column if not exists location text,
add column if not exists summary text;