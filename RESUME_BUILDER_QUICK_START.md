# Resume Builder Quick Start Guide

## Setup Requirements

### Environment Variables
Make sure these are set in your `.env` or `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key (for backend only)
SUPABASE_URL=your_supabase_url (for backend)
SUPABASE_SERVICE_KEY=your_service_key (for backend)
```

### Database Setup
Run this migration to create the required table:
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
```

## Key Files Overview

| File | Purpose |
|------|---------|
| `src/types/resume.ts` | Resume data type definitions |
| `src/pages/app/ResumeBuilder.tsx` | Main resume builder component |
| `src/pages/app/components/ResumeEditor.tsx` | Resume editing interface |
| `src/pages/app/components/AIChatPanel.tsx` | AI assistant chat interface |
| `src/hooks/useResumeData.ts` | Resume state management hook |
| `src/hooks/useAIChat.ts` | AI chat management hook |
| `src/utils/pdfExport.ts` | PDF export functionality |
| `api/parse-resume.ts` | Resume file parsing API |
| `api/ai-chat.ts` | AI chat API endpoint |

## Feature Walkthrough

### 1. Creating a Resume
```typescript
// User clicks "Create New" button
// A new master_resume record is created in Supabase
// Component initializes with empty sections
```

### 2. Editing Work Experience
```typescript
// User clicks "Add Experience"
// Modal opens with form fields
// On submit:
//   1. Generate unique ID
//   2. Add to local resume state
//   3. Call updateResume() to persist to DB
```

### 3. AI-Powered Suggestions
```typescript
// User opens AI Assistant tab
// User enters: "Improve my work experience wording"
// Request sent to /api/ai-chat endpoint with:
//   - User message
//   - Current resume context
//   - System prompt for resume optimization
// AI response displayed in chat
```

### 4. Exporting Resume
```typescript
// User clicks "Export Resume"
// Select format (PDF, HTML, JSON)
// File downloads to user's device
//   - PDF: Styled HTML with print dialog
//   - HTML: Standalone HTML file
//   - JSON: Raw resume data
```

## Common Operations

### Load a Resume
```typescript
const { resume, loading, error } = useResumeData(resumeId);
// resume object contains all sections
// loading = true while fetching
// error = error message if fetch fails
```

### Update Resume Data
```typescript
const {
  addSkill,
  updateSkill,
  deleteSkill,
  updateResume
} = useResumeData(resumeId);

// Add a skill
addSkill({
  id: crypto.randomUUID(),
  name: 'React',
  proficiencyLevel: 'advanced'
});

// Persist to database
await updateResume(resume);
```

### Send AI Chat Message
```typescript
const { messages, sendMessage, loading } = useAIChat(resume);

// Send a message
await sendMessage("Make my skills section more impactful");

// Access response in messages array
messages.map(msg => (
  <div key={msg.id}>
    {msg.role === 'user' ? 'You' : 'AI'}: {msg.content}
  </div>
))
```

### Export to PDF
```typescript
import { exportToPDF, exportToHTML, exportToJSON } from '@/utils/pdfExport';

// Export as PDF (opens print dialog)
await exportToPDF(resume);

// Export as HTML (downloads file)
exportToHTML(resume, 'my-resume.html');

// Export as JSON (downloads file)
exportToJSON(resume, 'resume-backup.json');
```

## Workflow Examples

### Complete User Journey

1. **Initial Setup**
   - User logs in
   - Navigates to `/app/resume-builder`
   - Sees empty state with "Create New" button

2. **Creating Resume**
   - Clicks "Create New"
   - Gets new empty resume
   - Sees tabs: Edit Resume, AI Assistant, Preview

3. **Adding Content**
   - Clicks "Edit Resume" tab
   - Adds work experience, education, skills
   - Each addition auto-saves to database

4. **AI Enhancement**
   - Clicks "AI Assistant" tab
   - Asks: "Improve my work descriptions"
   - Reviews AI suggestions
   - Manually applies good suggestions to editor

5. **Preview & Export**
   - Clicks "Preview" tab
   - Reviews professional formatting
   - Clicks "Download as PDF"
   - File downloads to device

### Managing Multiple Resumes

1. User has 3 resumes: "Tech Lead", "Full Stack", "Freelancer"
2. Resume cards shown in a grid
3. Click card to select and edit
4. Each has independent AI chat history

## Component Props Reference

### ResumeBuilder
- No props required
- Uses hooks and Supabase auth internally

### ResumeEditor
```typescript
interface ResumeEditorProps {
  resume: MasterResume | null;
  onSave: (resume: MasterResume) => Promise<void>;
  onAddWorkExperience: (experience: WorkExperience) => void;
  onUpdateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void;
  onDeleteWorkExperience: (id: string) => void;
  // ... similar for education, skills, projects
  saving?: boolean;
}
```

### AIChatPanel
```typescript
interface AIChatPanelProps {
  messages: AIChatMessage[];
  loading: boolean;
  error: string | null;
  onSendMessage: (message: string) => Promise<void>;
  resume: MasterResume | null;
}
```

## API Response Formats

### Parse Resume Response
```typescript
{
  ok: true,
  masterResumeId: "uuid",
  data: {
    id: "uuid",
    user_id: "uuid",
    title: "Master Resume",
    work_experience: [...],
    education: [...],
    skills: [...],
    projects: [...],
    created_at: "2026-11-07T...",
    updated_at: "2026-11-07T..."
  }
}
```

### AI Chat Response
```typescript
{
  message: "Here's my suggestion for improving your work experience..."
}
```

## Styling Notes

- Uses Mantine UI components for consistency
- Color scheme: Blue accent (#1a73e8)
- Professional typography hierarchy
- Mobile-responsive design
- Light/dark mode compatible

## Validation

### Required Fields
- Work Experience: company, title
- Education: school
- Skill: name
- Project: title, description

### Optional Fields
All other fields can be left empty (null)

## Performance Tips

1. **Resume Loading**
   - Load resumes on page mount
   - Use loading state for user feedback
   - Debounce updates to prevent over-saving

2. **AI Chat**
   - Messages stored in component state
   - Context built from current resume
   - No message persistence (cleared on component unmount)

3. **PDF Export**
   - Client-side generation (no server processing)
   - Uses browser's built-in print functionality
   - No temporary files created

## Troubleshooting

### Resume Won't Load
1. Check Supabase connection
2. Verify user is authenticated
3. Check browser console for errors
4. Ensure master_resumes table exists

### AI Chat Not Responding
1. Check OpenAI API key is valid
2. Verify API endpoint is accessible
3. Check rate limits on OpenAI account
4. Review error message in console

### Export Not Working
1. Check for browser pop-up blockers
2. Ensure modern browser (Chrome/Firefox/Safari/Edge)
3. Try different export format
4. Check browser console for errors

### File Upload Failing
1. Verify file size < 5MB
2. Check file format (PDF, DOCX, TXT, MD)
3. Ensure Supabase storage bucket exists
4. Check network connection

## Next Steps

1. **Test locally**: `npm run dev` then navigate to `/app/resume-builder`
2. **Build for production**: `npm run build`
3. **Deploy**: Follow your deployment process
4. **Monitor**: Track API usage and user feedback

## Support Resources

- [Mantine UI Docs](https://mantine.dev)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [React Router Docs](https://reactrouter.com)
- [TypeScript Docs](https://www.typescriptlang.org)

## Code Examples

### Adding a Skill Programmatically
```typescript
import { useResumeData } from '@/hooks/useResumeData';

function MyComponent() {
  const { resume, addSkill, updateResume } = useResumeData(resumeId);
  
  const handleAddSkill = async () => {
    const newSkill = {
      id: crypto.randomUUID(),
      name: 'React',
      proficiencyLevel: 'advanced' as const
    };
    
    addSkill(newSkill);
    if (resume) {
      await updateResume(resume);
    }
  };
  
  return <button onClick={handleAddSkill}>Add React Skill</button>;
}
```

### Fetching All User Resumes
```typescript
import { supabase } from '@/lib/supabase';

async function getUserResumes(userId: string) {
  const { data, error } = await supabase
    .from('master_resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

### Custom Resume Preview
```typescript
import { MasterResume } from '@/types/resume';

function CustomPreview({ resume }: { resume: MasterResume }) {
  return (
    <div className="resume-preview">
      <h1>{resume.title}</h1>
      <section>
        <h2>Experience</h2>
        {resume.workExperience.map(exp => (
          <div key={exp.id}>
            <h3>{exp.title}</h3>
            <p>{exp.company}</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

**Version**: 1.0.0  
**Last Updated**: November 7, 2026  
**Status**: Production Ready
