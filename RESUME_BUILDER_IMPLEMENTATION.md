# Resume Builder Implementation Guide

## Overview

This document describes the complete implementation of the resume building workflow for MVME2. The system provides users with the ability to upload, parse, edit, optimize, and export professional resumes using AI-powered suggestions.

## Architecture Components

### 1. Database Schema

The system uses the following Supabase table to store parsed resumes:

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

The system also uses the existing `uploaded_resumes` table to track file uploads and processing status.

### 2. Frontend Components

#### `src/types/resume.ts`
Comprehensive TypeScript types for the resume system:
- `MasterResume`: Main resume data structure
- `WorkExperience`: Work experience entry with company, title, dates, and description
- `Education`: Education entry with school, degree, and field of study
- `Skill`: Individual skill with proficiency level
- `Project`: Project entry with description and technologies
- `ParsedResume`: Structure returned from AI parsing
- `AIChatMessage`: Message in AI chat conversation
- `AIFeedback`: AI-provided feedback on resume sections

#### `src/pages/app/ResumeBuilder.tsx`
Main component managing the resume builder interface:
- Resume creation and selection
- Tab-based interface for editing, AI assistance, and preview
- Resume data loading from database
- Integration of sub-components (editor, AI chat, preview)
- Export functionality with multiple formats

**Key Features:**
- Create new resumes
- Load existing resumes
- Switch between multiple resumes
- View resume preview with professional formatting
- Export in PDF, HTML, and JSON formats
- Integration with AI assistant for suggestions

#### `src/pages/app/components/ResumeEditor.tsx`
Comprehensive editing interface with tabbed sections:
- **Work Experience Tab**: Add, edit, and delete work experiences
- **Education Tab**: Manage education entries
- **Skills Tab**: Add technical and non-technical skills
- **Projects Tab**: Document projects with technologies and descriptions

**Modal Dialogs:**
Each section has a dedicated modal for adding/editing entries with validation:
- Required field validation
- Auto-save to database on changes
- Smooth CRUD operations

#### `src/pages/app/components/AIChatPanel.tsx`
Interactive AI assistant interface:
- Real-time chat with OpenAI GPT-4o-mini
- Suggested prompts for first-time users
- Contextual suggestions based on current resume
- Copy-to-clipboard functionality for AI responses
- Suggested improvements for each resume section

**Suggested Prompts:**
- Improve the wording of work experience descriptions
- Suggest ways to quantify achievements
- Add missing technical skills
- Help structure resume summary
- Review project descriptions

### 3. Custom Hooks

#### `src/hooks/useResumeData.ts`
Manages resume state and database operations:
- `resume`: Current resume data
- `loading`: Loading state
- `error`: Error messages
- CRUD operations for all resume sections:
  - `addWorkExperience`, `updateWorkExperience`, `deleteWorkExperience`
  - `addEducation`, `updateEducation`, `deleteEducation`
  - `addSkill`, `updateSkill`, `deleteSkill`
  - `addProject`, `updateProject`, `deleteProject`
- `updateResume`: Persist all changes to database

#### `src/hooks/useAIChat.ts`
Manages AI chat interactions:
- `messages`: Chat message history
- `loading`: AI response loading state
- `error`: Error messages
- `sendMessage`: Send prompt to AI and get suggestions
- `clearMessages`: Reset conversation
- Builds context from current resume data
- System prompt guides AI for resume-specific feedback

### 4. Utility Functions

#### `src/utils/pdfExport.ts`
Professional PDF generation and export:

**Functions:**
- `generateResumeHTML()`: Converts resume data to styled HTML
- `exportToPDF()`: Triggers browser print dialog for PDF generation
- `exportToHTML()`: Downloads resume as standalone HTML file
- `exportToJSON()`: Downloads resume as JSON for data backup

**Styling Features:**
- Professional color scheme (blue accents)
- Clear section hierarchy with typography
- Responsive layout optimized for 8.5" x 11" pages
- Print-optimized CSS with proper page breaks
- Skills displayed as styled tags
- Technologies listed with proper formatting

### 5. API Endpoints

#### `/api/parse-resume.ts`
Backend service for resume file processing:

**Functionality:**
1. Validates user authentication
2. Downloads file from Supabase storage
3. Extracts text based on file type:
   - PDF: Uses `pdf-parse` library
   - DOCX: Uses `mammoth` library
   - TXT/MD: Direct text reading
4. Sends extracted text to OpenAI GPT-4o-mini
5. Parses structured JSON response with Zod validation
6. Stores parsed data in `master_resumes` table
7. Updates upload status to "completed"

**Process Flow:**
```
File Upload → Storage → Extract Text → AI Parsing → Validation → DB Storage
```

**Schema Validation:**
Uses Zod schema to ensure all parsed data conforms to expected structure with proper null handling.

#### `/api/ai-chat.ts`
Real-time AI chat endpoint for resume optimization:

**Functionality:**
1. Validates user authentication
2. Accepts message history and system prompt
3. Sends to OpenAI with context about current resume
4. Returns AI suggestions for improvement
5. Error handling with descriptive messages

**System Prompt:**
Guides AI to provide specific, actionable resume improvement suggestions focusing on:
- Clarity and impact
- Achievement quantification
- Wording improvements
- Professional presentation

## Implementation Workflow

### 1. Resume Upload (Existing Flow)
```
GettingStarted.tsx → Upload File → /api/parse-resume → master_resumes Table
```

### 2. Resume Editing
```
ResumeBuilder.tsx → ResumeEditor.tsx → useResumeData → updateResume() → Supabase
```

### 3. AI-Powered Optimization
```
ResumeBuilder.tsx → AIChatPanel.tsx → /api/ai-chat → OpenAI → User Review
```

### 4. Resume Export
```
ResumeBuilder.tsx → exportToPDF/HTML/JSON() → Download
```

## Data Flow

### Creating/Loading Resume
1. User navigates to `/app/resume-builder`
2. `useResumeData` hook fetches from `master_resumes` table
3. Resume data populates the UI components
4. User can switch between multiple resumes

### Adding Work Experience
1. User clicks "Add Experience" button
2. Modal opens with form fields
3. User fills company, title, dates, description
4. On save, `addWorkExperience` adds to local state
5. `updateResume` persists to Supabase
6. Component re-renders with updated data

### Requesting AI Suggestions
1. User opens AI Assistant tab
2. User enters a request or clicks suggested prompt
3. `sendMessage` calls `/api/ai-chat` endpoint
4. AI response includes contextual resume data
5. Response displayed in chat interface
6. User can copy and apply suggestions manually

### Exporting Resume
1. User selects export format (PDF, HTML, or JSON)
2. `exportToPDF()`, `exportToHTML()`, or `exportToJSON()` called
3. Data converted to appropriate format
4. Browser downloads the file

## Type Safety

All components use TypeScript with strict typing:
- Full type definitions in `src/types/resume.ts`
- Zod schema validation for API responses
- Generic hooks with proper type inference
- Component props fully typed with interfaces

## Error Handling

- Try-catch blocks in all async operations
- User-friendly error messages
- Error state managed in hooks and components
- Failed saves don't delete local state
- Network errors gracefully handled

## Performance Optimizations

- Lazy loading of resume data
- Debounced save operations (via modal submission)
- Efficient React re-renders with proper state management
- CSS-in-JS for styles to avoid extra files
- PDF generation uses client-side print dialog

## Security

- Authentication required via Supabase JWT
- User can only access their own resumes
- File uploads validated on backend
- Sensitive operations require authentication token
- API endpoints validate user identity before processing

## Browser Compatibility

- Modern browsers with ES6+ support
- Print API for PDF generation (Chrome, Firefox, Safari, Edge)
- File API for downloads
- Clipboard API with fallback message

## Future Enhancements

Potential improvements for future versions:
1. Real-time collaboration on resumes
2. Resume templates with different styles
3. ATS (Applicant Tracking System) score analysis
4. Job matching suggestions
5. Resume version history and comparisons
6. Batch AI improvements across sections
7. Integration with LinkedIn for data auto-fill
8. Resume metrics and analytics

## Testing Recommendations

1. **Unit Tests**
   - Hook functionality (`useResumeData`, `useAIChat`)
   - Utility functions (`exportToPDF`, `generateResumeHTML`)
   - Type validation with Zod schemas

2. **Integration Tests**
   - Resume CRUD operations
   - File upload and parsing
   - AI chat interactions

3. **E2E Tests**
   - Complete resume builder workflow
   - Export functionality
   - Multi-resume management

## Deployment Considerations

1. Ensure `.env` variables are set:
   - `OPENAI_API_KEY`: OpenAI API key for resume parsing and AI chat
   - `SUPABASE_URL`: Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Service role key for backend

2. Database migrations applied for `master_resumes` table

3. API endpoints accessible from frontend

4. PDF printing configured in browser settings if self-hosted

## Troubleshooting

### Resume Not Saving
- Check Supabase connection
- Verify user authentication
- Check database permissions

### AI Chat Not Working
- Verify OpenAI API key
- Check API endpoint accessibility
- Review error messages in console

### PDF Export Not Working
- Ensure browser supports print API
- Check for pop-up blockers
- Verify browser permissions

### File Upload Failures
- Check file size (max 5MB)
- Verify file format (PDF, DOCX, TXT, MD)
- Check storage bucket permissions

## File Structure

```
src/
├── types/
│   └── resume.ts              # TypeScript types
├── hooks/
│   ├── useResumeData.ts        # Resume state management
│   └── useAIChat.ts             # AI chat management
├── utils/
│   └── pdfExport.ts            # PDF generation utilities
└── pages/app/
    ├── ResumeBuilder.tsx       # Main component
    └── components/
        ├── ResumeEditor.tsx    # Editing interface
        └── AIChatPanel.tsx     # AI chat interface

api/
├── parse-resume.ts             # Resume file parsing
└── ai-chat.ts                  # AI chat endpoint
```

## Conclusion

This implementation provides a complete, production-ready resume builder with:
- Robust data handling and validation
- Professional UI with Mantine components
- AI-powered optimization suggestions
- Multiple export formats
- Type-safe code with full TypeScript support
- Secure backend processing
- Extensible architecture for future features
