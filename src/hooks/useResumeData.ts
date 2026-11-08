import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { MasterResume, WorkExperience, Education, Skill, Project } from '@/types/resume';

interface UseResumeDataResult {
  resume: MasterResume | null;
  loading: boolean;
  error: string | null;
  updateResume: (resume: MasterResume) => Promise<void>;
  addWorkExperience: (experience: WorkExperience) => void;
  updateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void;
  deleteWorkExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export function useResumeData(resumeId: string | null): UseResumeDataResult {
  const [resume, setResume] = useState<MasterResume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load resume data
  useEffect(() => {
    if (!resumeId) return;

    const loadResume = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('master_resumes')
          .select('*')
          .eq('id', resumeId)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Resume not found');

        setResume({
          id: data.id,
          userId: data.user_id,
          title: data.title,
          workExperience: data.work_experience || [],
          education: data.education || [],
          skills: data.skills || [],
          projects: data.projects || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [resumeId]);

  const updateResume = useCallback(async (updatedResume: MasterResume) => {
    try {
      const { error: updateError } = await supabase
        .from('master_resumes')
        .update({
          work_experience: updatedResume.workExperience,
          education: updatedResume.education,
          skills: updatedResume.skills,
          projects: updatedResume.projects,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedResume.id);

      if (updateError) throw updateError;
      setResume(updatedResume);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resume');
      throw err;
    }
  }, []);

  const addWorkExperience = useCallback((experience: WorkExperience) => {
    if (!resume) return;
    const updated = {
      ...resume,
      workExperience: [...resume.workExperience, experience],
    };
    setResume(updated);
  }, [resume]);

  const updateWorkExperience = useCallback((id: string, updates: Partial<WorkExperience>) => {
    if (!resume) return;
    const updated = {
      ...resume,
      workExperience: resume.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    };
    setResume(updated);
  }, [resume]);

  const deleteWorkExperience = useCallback((id: string) => {
    if (!resume) return;
    const updated = {
      ...resume,
      workExperience: resume.workExperience.filter((exp) => exp.id !== id),
    };
    setResume(updated);
  }, [resume]);

  const addEducation = useCallback((education: Education) => {
    if (!resume) return;
    const updated = {
      ...resume,
      education: [...resume.education, education],
    };
    setResume(updated);
  }, [resume]);

  const updateEducation = useCallback((id: string, updates: Partial<Education>) => {
    if (!resume) return;
    const updated = {
      ...resume,
      education: resume.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    };
    setResume(updated);
  }, [resume]);

  const deleteEducation = useCallback((id: string) => {
    if (!resume) return;
    const updated = {
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    };
    setResume(updated);
  }, [resume]);

  const addSkill = useCallback((skill: Skill) => {
    if (!resume) return;
    const updated = {
      ...resume,
      skills: [...resume.skills, skill],
    };
    setResume(updated);
  }, [resume]);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    if (!resume) return;
    const updated = {
      ...resume,
      skills: resume.skills.map((skill) =>
        skill.id === id ? { ...skill, ...updates } : skill
      ),
    };
    setResume(updated);
  }, [resume]);

  const deleteSkill = useCallback((id: string) => {
    if (!resume) return;
    const updated = {
      ...resume,
      skills: resume.skills.filter((skill) => skill.id !== id),
    };
    setResume(updated);
  }, [resume]);

  const addProject = useCallback((project: Project) => {
    if (!resume) return;
    const updated = {
      ...resume,
      projects: [...resume.projects, project],
    };
    setResume(updated);
  }, [resume]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    if (!resume) return;
    const updated = {
      ...resume,
      projects: resume.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      ),
    };
    setResume(updated);
  }, [resume]);

  const deleteProject = useCallback((id: string) => {
    if (!resume) return;
    const updated = {
      ...resume,
      projects: resume.projects.filter((proj) => proj.id !== id),
    };
    setResume(updated);
  }, [resume]);

  return {
    resume,
    loading,
    error,
    updateResume,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
  };
}
