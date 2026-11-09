// Resume-related TypeScript types and interfaces

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  currentlyWorking?: boolean;
  achievements?: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string | null;
  year: string | null;
  fieldOfStudy?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface MasterResume {
  id: string;
  userId: string;
  title: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  name: string | null;
  email: string | null;
  phone?: string | null;
  location?: string | null;
  summary?: string | null;
  skills: string[];
  experience: Array<{
    company: string;
    title: string;
    startDate: string | null;
    endDate: string | null;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string | null;
    year: string | null;
    fieldOfStudy?: string | null;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string[];
    url?: string;
  }>;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestion?: {
    section: 'workExperience' | 'education' | 'skills' | 'projects';
    action: 'modify' | 'add' | 'remove';
    data: any;
  };
}

export interface AIFeedback {
  aspect: string;
  suggestion: string;
  section: 'workExperience' | 'education' | 'skills' | 'projects' | 'general';
  priority: 'low' | 'medium' | 'high';
}
