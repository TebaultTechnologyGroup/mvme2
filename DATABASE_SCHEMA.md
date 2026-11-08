# Resume Builder Database Schema

## Master Resumes Table

The core table for storing all resume data.

```sql
create table master_resumes (
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

-- Enable RLS
alter table master_resumes enable row level security;

-- Create policy for users to access their own resumes
create policy "Users can access their own resumes"
  on master_resumes
  for all
  using (auth.uid() = user_id);
```

## JSON Schema Documentation

### Work Experience Structure

```json
[
  {
    "id": "uuid-string",
    "company": "Acme Corporation",
    "title": "Senior Software Engineer",
    "description": "Led development of microservices architecture...",
    "startDate": "01/2020",
    "endDate": "12/2023",
    "currentlyWorking": false
  }
]
```

**Fields:**
- `id` (string, UUID): Unique identifier
- `company` (string): Company name
- `title` (string): Job title
- `description` (string): Role description and achievements
- `startDate` (string, nullable): Start date (format: MM/YYYY)
- `endDate` (string, nullable): End date (format: MM/YYYY)
- `currentlyWorking` (boolean): Whether still employed here

### Education Structure

```json
[
  {
    "id": "uuid-string",
    "school": "Stanford University",
    "degree": "Bachelor of Science",
    "year": "2019",
    "fieldOfStudy": "Computer Science"
  }
]
```

**Fields:**
- `id` (string, UUID): Unique identifier
- `school` (string): School/University name
- `degree` (string, nullable): Degree earned (e.g., B.S., M.A.)
- `year` (string, nullable): Graduation year (YYYY)
- `fieldOfStudy` (string, nullable): Major/Field of study

### Skills Structure

```json
[
  {
    "id": "uuid-string",
    "name": "React",
    "category": "Frontend",
    "proficiencyLevel": "advanced"
  }
]
```

**Fields:**
- `id` (string, UUID): Unique identifier
- `name` (string): Skill name
- `category` (string, nullable): Skill category (e.g., Technical, Leadership)
- `proficiencyLevel` (string, nullable): Level (beginner, intermediate, advanced, expert)

### Projects Structure

```json
[
  {
    "id": "uuid-string",
    "title": "E-commerce Platform",
    "description": "Built a full-stack e-commerce platform...",
    "technologies": ["React", "Node.js", "PostgreSQL"],
    "url": "https://example.com",
    "startDate": "06/2022",
    "endDate": "12/2022"
  }
]
```

**Fields:**
- `id` (string, UUID): Unique identifier
- `title` (string): Project name
- `description` (string): Project description
- `technologies` (array, nullable): Technologies used
- `url` (string, nullable): Project URL
- `startDate` (string, nullable): Project start date (MM/YYYY)
- `endDate` (string, nullable): Project end date (MM/YYYY)

## Related Tables

### Uploaded Resumes Table

```sql
create table uploaded_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  file_path text not null,
  status text default 'pending', -- pending, processing, completed, error
  master_resume_id uuid references master_resumes(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Usage:**
- Tracks resume uploads
- Stores reference to generated master_resume
- Maintains processing status
- Enables retry logic for failed parsing

## Indexes (Recommended)

```sql
-- Fast lookup of user's resumes
create index idx_master_resumes_user_id on master_resumes(user_id);

-- Fast lookup of uploaded resumes
create index idx_uploaded_resumes_user_id on uploaded_resumes(user_id);
create index idx_uploaded_resumes_status on uploaded_resumes(status);

-- Fast lookup of master resume from uploaded
create index idx_uploaded_resumes_master_id on uploaded_resumes(master_resume_id);
```

## Row Level Security

```sql
-- Master resumes: Users can only access their own
create policy "Users can access their own master resumes"
  on master_resumes
  for all
  using (auth.uid() = user_id);

-- Uploaded resumes: Users can only access their own
create policy "Users can access their own uploaded resumes"
  on uploaded_resumes
  for all
  using (auth.uid() = user_id);
```

## Data Size Considerations

- **Master Resume**: ~5-20 KB per entry (JSONB storage is efficient)
- **File Storage**: Up to 5 MB per upload
- **Typical Database Impact**: <100 MB for 10,000 users with 2 resumes each

## Backup & Archiving

### Export All User Resumes
```sql
select 
  id, 
  user_id, 
  title, 
  work_experience, 
  education, 
  skills, 
  projects, 
  created_at, 
  updated_at
from master_resumes
where user_id = '${USER_ID}'
order by updated_at desc;
```

### Delete Old Uploaded Resumes
```sql
delete from uploaded_resumes
where status = 'error' 
  and updated_at < now() - interval '30 days';
```

## Statistics Queries

### Count resumes per user
```sql
select user_id, count(*) as resume_count
from master_resumes
group by user_id
order by resume_count desc;
```

### Average resume size
```sql
select 
  avg(
    (jsonb_array_length(work_experience) + 
     jsonb_array_length(education) + 
     jsonb_array_length(skills) + 
     jsonb_array_length(projects))::numeric
  ) as avg_items
from master_resumes;
```

### Recent activity
```sql
select 
  id, 
  user_id, 
  title, 
  updated_at
from master_resumes
order by updated_at desc
limit 20;
```

## Migration Path

### Step 1: Create Tables
```bash
# Run the SQL migrations above in Supabase dashboard
```

### Step 2: Enable Extensions
```sql
-- JSONB is built-in, but ensure uuid-ossp is available
create extension if not exists "uuid-ossp";
```

### Step 3: Create Indexes
```bash
# Run index creation queries above
```

### Step 4: Set RLS Policies
```bash
# Run RLS creation queries above
```

### Step 5: Verify Setup
```sql
-- Check tables exist
select * from information_schema.tables 
where table_name in ('master_resumes', 'uploaded_resumes');

-- Check RLS is enabled
select tablename, rowsecurity 
from pg_tables 
where tablename in ('master_resumes', 'uploaded_resumes');
```

## Example Inserts

### Create Master Resume
```typescript
const { data, error } = await supabase
  .from('master_resumes')
  .insert({
    user_id: userId,
    title: 'My Resume',
    work_experience: [],
    education: [],
    skills: [],
    projects: []
  })
  .select()
  .single();
```

### Add Work Experience
```typescript
const updatedResume = {
  ...resume,
  work_experience: [
    ...resume.work_experience,
    {
      id: crypto.randomUUID(),
      company: 'Tech Corp',
      title: 'Engineer',
      description: 'Built systems',
      startDate: '01/2020',
      endDate: null,
      currentlyWorking: true
    }
  ]
};

const { error } = await supabase
  .from('master_resumes')
  .update({ work_experience: updatedResume.work_experience })
  .eq('id', resume.id);
```

## Data Validation

### TypeScript Runtime Validation
```typescript
import { z } from 'zod';

const WorkExperienceSchema = z.object({
  id: z.string().uuid(),
  company: z.string(),
  title: z.string(),
  description: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  currentlyWorking: z.boolean().optional()
});

const MasterResumeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  work_experience: z.array(WorkExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillSchema),
  projects: z.array(ProjectSchema),
  created_at: z.string(),
  updated_at: z.string()
});
```

## Performance Tips

1. **Pagination**: Load resumes 10 at a time
2. **Partial Updates**: Only send changed sections
3. **Denormalization**: JSONB is fine for this data structure
4. **Caching**: Cache user's resume list for 5 minutes
5. **Batch Operations**: Combine multiple updates when possible

## Troubleshooting

### JSONB Type Errors
- Ensure JSONB is valid JSON
- Use Zod validation before insert/update
- Check for circular references

### RLS Issues
- Verify auth.uid() is set correctly
- Check user exists in public.users
- Ensure policy syntax is correct

### Performance Issues
- Add indexes for frequently queried columns
- Check query plans with EXPLAIN
- Consider archiving old uploads

## Security Notes

- RLS prevents users from accessing other users' data
- All API endpoints must check user_id matches auth.uid()
- Never trust client-side user_id values
- Validate all JSONB data before storage
- Use prepared statements (Supabase handles this)

## Disaster Recovery

### Backup Strategy
```bash
# Export all resumes
pg_dump -h db.xxx.supabase.co -U postgres -d postgres \
  -t master_resumes --data-only > backup.sql

# Export specific user
select * from master_resumes 
where user_id = 'user-id' 
\copy to 'user-resumes.json'
```

### Restore Procedure
```bash
# Restore from backup
psql -h db.xxx.supabase.co -U postgres -d postgres \
  < backup.sql
```

---

**Schema Version**: 1.0  
**Last Updated**: November 7, 2026  
**Status**: Production Ready
