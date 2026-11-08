import { useState, useEffect } from 'react';
import {
  Container,
  Tabs,
  Button,
  Group,
  Stack,
  Box,
  ThemeIcon,
  Title,
  Text,
  Loader,
  Alert,
  Grid,
  ActionIcon,
  Menu,
  Modal,
  SimpleGrid,
} from '@mantine/core';
import {
  Download,
  FileJson,
  MoreVertical,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { useResumeData } from '@/hooks/useResumeData';
import { useAIChat } from '@/hooks/useAIChat';
import { exportToPDF, exportToHTML, exportToJSON } from '@/utils/pdfExport';
import ResumeEditor from './components/ResumeEditor';
import AIChatPanel from './components/AIChatPanel';
import type { MasterResume } from '@/types/resume';

export default function ResumeBuilder() {
  const { session } = useAuth();
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [resumes, setResumes] = useState<MasterResume[]>([]);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    resume,
    error: resumeError,
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
  } = useResumeData(resumeId);

  const { messages, loading: aiLoading, error: aiError, sendMessage, clearMessages } = useAIChat(resume);

  const [saving, setSaving] = useState(false);

  // Load master resumes for the user
  useEffect(() => {
    const loadResumes = async () => {
      if (!session?.user.id) return;

      setLoadingResumes(true);
      try {
        const { data, error } = await supabase
          .from('master_resumes')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const formattedResumes = (data || []).map((r) => ({
          id: r.id,
          userId: r.user_id,
          title: r.title,
          workExperience: r.work_experience || [],
          education: r.education || [],
          skills: r.skills || [],
          projects: r.projects || [],
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }));

        setResumes(formattedResumes);
        if (formattedResumes.length > 0 && !selectedResume) {
          setSelectedResume(formattedResumes[0].id);
          setResumeId(formattedResumes[0].id);
        }
      } catch (_err) {
        // Error loading resumes
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [session?.user.id, selectedResume]);

  // Check for uploaded resume that needs processing
  useEffect(() => {
    const checkUploadedResume = async () => {
      if (!session?.user.id) return;

      try {
        const { data } = await supabase
          .from('uploaded_resumes')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && data.master_resume_id) {
          setSelectedResume(data.master_resume_id);
          setResumeId(data.master_resume_id);
        }
      } catch (_err) {
        // No completed uploaded resume
      }
    };

    checkUploadedResume();
  }, [session?.user.id]);

  const handleSave = async (updatedResume: MasterResume) => {
    setSaving(true);
    try {
      await updateResume(updatedResume);
    } catch (err) {
      console.error('Failed to save resume:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewResume = async () => {
    if (!session?.user.id) return;

    try {
      const { data, error } = await supabase
        .from('master_resumes')
        .insert({
          user_id: session.user.id,
          title: 'New Resume',
          work_experience: [],
          education: [],
          skills: [],
          projects: [],
        })
        .select()
        .single();

      if (error) throw error;

      const newResume: MasterResume = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setResumes((prev) => [newResume, ...prev]);
      setSelectedResume(newResume.id);
      setResumeId(newResume.id);
    } catch (err) {
      console.error('Failed to create resume:', err);
    }
  };

  const handleExport = (format: 'pdf' | 'html' | 'json') => {
    if (!resume) return;

    try {
      if (format === 'pdf') {
        exportToPDF(resume, `${resume.title}.pdf`);
      } else if (format === 'html') {
        exportToHTML(resume, `${resume.title}.html`);
      } else if (format === 'json') {
        exportToJSON(resume, `${resume.title}.json`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }

    setShowExportModal(false);
  };

  if (loadingResumes) {
    return (
      <Container size="lg" py="lg">
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      </Container>
    );
  }

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Resume Builder</Title>
            <Text c="dimmed" size="sm">
              {resumes.length > 0 ? `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} available` : 'No resumes yet'}
            </Text>
          </div>
          <Group gap="sm">
            <Button onClick={handleCreateNewResume} variant="light">
              Create New
            </Button>
            {resume && (
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <MoreVertical size={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => setShowExportModal(true)} leftSection={<Download size={14} />}>
                    Export Resume
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>

        {resumeError && (
          <Alert icon={<AlertCircle size={16} />} color="red">
            {resumeError}
          </Alert>
        )}

        {resumes.length === 0 ? (
          <Box py="xl" ta="center">
            <ThemeIcon size={64} radius="xl" variant="light" mx="auto" mb="md">
              <RefreshCw size={32} />
            </ThemeIcon>
            <Title order={3}>No resumes yet</Title>
            <Text c="dimmed" mb="md">
              Create a new resume or upload an existing one to get started
            </Text>
            <Button onClick={handleCreateNewResume}>Create First Resume</Button>
          </Box>
        ) : (
          <>
            {/* Resume Selection */}
            {resumes.length > 1 && (
              <Box>
                <Text size="sm" fw={500} mb="xs">
                  Your Resumes
                </Text>
                <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                  {resumes.map((r) => (
                  <Box
                    key={r.id}
                    p="md"
                    style={{
                      border:
                        selectedResume === r.id
                          ? '2px solid var(--mantine-color-blue-6)'
                          : '1px solid var(--mantine-color-gray-3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor:
                        selectedResume === r.id
                          ? 'var(--mantine-color-blue-0)'
                          : 'transparent',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => {
                      setSelectedResume(r.id);
                      setResumeId(r.id);
                      clearMessages();
                    }}
                  >
                    <Text fw={500} size="sm" mb="xs" truncate>
                      {r.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </Text>
                  </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Main Content */}
            {resume && (
              <Tabs defaultValue="editor" variant="outline">
                <Tabs.List>
                  <Tabs.Tab value="editor">Edit Resume</Tabs.Tab>
                  <Tabs.Tab value="ai">AI Assistant</Tabs.Tab>
                  <Tabs.Tab value="preview">Preview</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="editor" pt="md">
                  <ResumeEditor
                    resume={resume}
                    onSave={handleSave}
                    onAddWorkExperience={addWorkExperience}
                    onUpdateWorkExperience={updateWorkExperience}
                    onDeleteWorkExperience={deleteWorkExperience}
                    onAddEducation={addEducation}
                    onUpdateEducation={updateEducation}
                    onDeleteEducation={deleteEducation}
                    onAddSkill={addSkill}
                    onUpdateSkill={updateSkill}
                    onDeleteSkill={deleteSkill}
                    onAddProject={addProject}
                    onUpdateProject={updateProject}
                    onDeleteProject={deleteProject}
                    saving={saving}
                  />
                </Tabs.Panel>

                <Tabs.Panel value="ai" pt="md">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                      <AIChatPanel
                        messages={messages}
                        loading={aiLoading}
                        error={aiError}
                        onSendMessage={sendMessage}
                        resume={resume}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Stack gap="md">
                        <Box p="md" bg="gray.1" style={{ borderRadius: '8px', border: '1px solid var(--mantine-color-gray-3)' }}>
                          <Text fw={500} size="sm" mb="md">
                            Tips for AI Assistant
                          </Text>
                          <Text size="xs" c="dimmed">
                            • Ask for specific improvements to any section
                          </Text>
                          <Text size="xs" c="dimmed">
                            • Request help quantifying achievements
                          </Text>
                          <Text size="xs" c="dimmed">
                            • Get suggestions for better wording
                          </Text>
                          <Text size="xs" c="dimmed">
                            • Ask about missing sections or skills
                          </Text>
                        </Box>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="preview" pt="md">
                  <Box p="lg" bg="gray.1" style={{ minHeight: '600px', borderRadius: '8px' }}>
                    <Stack gap="md" maw="800px" mx="auto">
                      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px' }}>
                        <Title order={1} mb="xs">
                          {resume.title}
                        </Title>

                        {resume.workExperience.length > 0 && (
                          <>
                            <Title order={3} mt="xl" mb="sm" style={{ color: '#1a73e8' }}>
                              Work Experience
                            </Title>
                            {resume.workExperience.map((exp) => (
                              <Box key={exp.id} mb="md">
                                <Group justify="space-between" mb="xs">
                                  <div>
                                    <Text fw={600}>{exp.title}</Text>
                                    <Text size="sm" c="dimmed">
                                      {exp.company}
                                    </Text>
                                  </div>
                                  <Text size="sm" c="dimmed">
                                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                                  </Text>
                                </Group>
                                <Text size="sm">{exp.description}</Text>
                              </Box>
                            ))}
                          </>
                        )}

                        {resume.education.length > 0 && (
                          <>
                            <Title order={3} mt="xl" mb="sm" style={{ color: '#1a73e8' }}>
                              Education
                            </Title>
                            {resume.education.map((edu) => (
                              <Box key={edu.id} mb="md">
                                <Group justify="space-between" mb="xs">
                                  <div>
                                    <Text fw={600}>{edu.school}</Text>
                                    {edu.degree && <Text size="sm">{edu.degree}</Text>}
                                  </div>
                                  {edu.year && <Text size="sm" c="dimmed">{edu.year}</Text>}
                                </Group>
                              </Box>
                            ))}
                          </>
                        )}

                        {resume.skills.length > 0 && (
                          <>
                            <Title order={3} mt="xl" mb="sm" style={{ color: '#1a73e8' }}>
                              Skills
                            </Title>
                            <Group gap="sm" mb="md">
                              {resume.skills.map((skill) => (
                                <Box
                                  key={skill.id}
                                  p="xs"
                                  bg="blue.1"
                                  style={{ borderRadius: '4px', color: '#1a73e8', fontSize: '14px' }}
                                >
                                  {skill.name}
                                </Box>
                              ))}
                            </Group>
                          </>
                        )}

                        {resume.projects.length > 0 && (
                          <>
                            <Title order={3} mt="xl" mb="sm" style={{ color: '#1a73e8' }}>
                              Projects
                            </Title>
                            {resume.projects.map((proj) => (
                              <Box key={proj.id} mb="md">
                                <Text fw={600} mb="xs">
                                  {proj.title}
                                </Text>
                                <Text size="sm" mb="xs">
                                  {proj.description}
                                </Text>
                                {proj.technologies && proj.technologies.length > 0 && (
                                  <Text size="xs" c="dimmed">
                                    <strong>Technologies:</strong> {proj.technologies.join(', ')}
                                  </Text>
                                )}
                              </Box>
                            ))}
                          </>
                        )}
                      </div>

                      <Group justify="center">
                        <Button onClick={() => handleExport('pdf')} leftSection={<Download size={18} />}>
                          Download as PDF
                        </Button>
                      </Group>
                    </Stack>
                  </Box>
                </Tabs.Panel>
              </Tabs>
            )}
          </>
        )}
      </Stack>

      {/* Export Modal */}
      <Modal
        opened={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Resume"
        centered
      >
        <Stack gap="md">
          <Button
            fullWidth
            leftSection={<Download size={18} />}
            onClick={() => handleExport('pdf')}
          >
            Download as PDF
          </Button>
          <Button
            fullWidth
            variant="light"
            leftSection={<Download size={18} />}
            onClick={() => handleExport('html')}
          >
            Export as HTML
          </Button>
          <Button
            fullWidth
            variant="light"
            leftSection={<FileJson size={18} />}
            onClick={() => handleExport('json')}
          >
            Export as JSON
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
