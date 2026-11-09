import { useState } from "react";
import {
  Stack,
  Tabs,
  Button,
  Group,
  Modal,
  TextInput,
  Textarea,
  Select,
  Badge,
  Card,
  ActionIcon,
  Box,
  Text,
  SimpleGrid,
} from "@mantine/core";
import { Trash2, Plus, Edit2 } from "lucide-react";
import type {
  MasterResume,
  WorkExperience,
  Education,
  Skill,
  Project,
} from "@/types/resume";

interface ResumeEditorProps {
  resume: MasterResume | null;
  onSave: (resume: MasterResume) => Promise<void>;
  onAddWorkExperience: (experience: WorkExperience) => void;
  onUpdateWorkExperience: (
    id: string,
    experience: Partial<WorkExperience>,
  ) => void;
  onDeleteWorkExperience: (id: string) => void;
  onAddEducation: (education: Education) => void;
  onUpdateEducation: (id: string, education: Partial<Education>) => void;
  onDeleteEducation: (id: string) => void;
  onAddSkill: (skill: Skill) => void;
  onUpdateSkill: (id: string, skill: Partial<Skill>) => void;
  onDeleteSkill: (id: string) => void;
  onAddProject: (project: Project) => void;
  onUpdateProject: (id: string, project: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  saving?: boolean;
}

export default function ResumeEditor({
  resume,
  onSave,
  onAddWorkExperience,
  onUpdateWorkExperience,
  onDeleteWorkExperience,
  onAddEducation,
  onUpdateEducation,
  onDeleteEducation,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  saving = false,
}: ResumeEditorProps) {
  const [editingWorkExperienceId, setEditingWorkExperienceId] = useState<
    string | null
  >(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null,
  );
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [workExperienceModal, setWorkExperienceModal] = useState(false);
  const [educationModal, setEducationModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);

  const [newWorkExperience, setNewWorkExperience] = useState<
    Partial<WorkExperience>
  >({});
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({});
  const [newProject, setNewProject] = useState<Partial<Project>>({});

  if (!resume) {
    return <div>Loading resume...</div>;
  }

  const handleSaveWorkExperience = async () => {
    if (!newWorkExperience.company || !newWorkExperience.title) {
      alert("Please fill in required fields");
      return;
    }

    if (editingWorkExperienceId) {
      onUpdateWorkExperience(editingWorkExperienceId, newWorkExperience);
    } else {
      const id = crypto.randomUUID();
      onAddWorkExperience({
        id,
        company: newWorkExperience.company!,
        title: newWorkExperience.title!,
        description: newWorkExperience.description || "",
        startDate: newWorkExperience.startDate || null,
        endDate: newWorkExperience.endDate || null,
        currentlyWorking: newWorkExperience.currentlyWorking || false,
      });
    }

    await onSave(resume);
    setWorkExperienceModal(false);
    setNewWorkExperience({});
    setEditingWorkExperienceId(null);
  };

  const handleSaveEducation = async () => {
    if (!newEducation.school) {
      alert("Please fill in required fields");
      return;
    }

    if (editingEducationId) {
      onUpdateEducation(editingEducationId, newEducation);
    } else {
      const id = crypto.randomUUID();
      onAddEducation({
        id,
        school: newEducation.school!,
        degree: newEducation.degree || null,
        year: newEducation.year || null,
        fieldOfStudy: newEducation.fieldOfStudy || undefined,
      });
    }

    await onSave(resume);
    setEducationModal(false);
    setNewEducation({});
    setEditingEducationId(null);
  };

  const handleSaveSkill = async () => {
    if (!newSkill.name) {
      alert("Please enter a skill name");
      return;
    }

    if (editingSkillId) {
      onUpdateSkill(editingSkillId, newSkill);
    } else {
      const id = crypto.randomUUID();
      onAddSkill({
        id,
        name: newSkill.name!,
        category: newSkill.category || undefined,
        proficiencyLevel: (newSkill.proficiencyLevel as any) || undefined,
      });
    }

    await onSave(resume);
    setSkillModal(false);
    setNewSkill({});
    setEditingSkillId(null);
  };

  const handleSaveProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert("Please fill in required fields");
      return;
    }

    if (editingProjectId) {
      onUpdateProject(editingProjectId, newProject);
    } else {
      const id = crypto.randomUUID();
      onAddProject({
        id,
        title: newProject.title!,
        description: newProject.description!,
        technologies: newProject.technologies || [],
        url: newProject.url || undefined,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
      });
    }

    await onSave(resume);
    setProjectModal(false);
    setNewProject({});
    setEditingProjectId(null);
  };

  return (
    <Box>
      <Tabs defaultValue="personal" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="personal">Personal Info</Tabs.Tab>
          <Tabs.Tab value="experience">Work Experience</Tabs.Tab>
          <Tabs.Tab value="education">Education</Tabs.Tab>
          <Tabs.Tab value="skills">Skills</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personal" pt="md">
          <Stack gap="md" maw={600}>
            <TextInput
              label="Full Name"
              placeholder="Your full name"
              value={resume.title || ''}
              onChange={(e) => {
                const updated = { ...resume, title: e.currentTarget.value };
                onSave(updated);
              }}
            />
            <TextInput
              label="Email"
              placeholder="your.email@example.com"
              type="email"
              value={(resume as any).email || ''}
              onChange={(e) => {
                const updated = { ...resume, email: e.currentTarget.value } as any;
                onSave(updated);
              }}
            />
            <TextInput
              label="Phone"
              placeholder="(555) 555-5555"
              value={(resume as any).phone || ''}
              onChange={(e) => {
                const updated = { ...resume, phone: e.currentTarget.value } as any;
                onSave(updated);
              }}
            />
            <TextInput
              label="Location"
              placeholder="City, State"
              value={(resume as any).location || ''}
              onChange={(e) => {
                const updated = { ...resume, location: e.currentTarget.value } as any;
                onSave(updated);
              }}
            />
            <Textarea
              label="Professional Summary"
              placeholder="Brief overview of your professional background and expertise"
              value={(resume as any).summary || ''}
              onChange={(e) => {
                const updated = { ...resume, summary: e.currentTarget.value } as any;
                onSave(updated);
              }}
              rows={5}
              autoFocus
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="experience" pt="md">
          <Stack gap="md">
            <Group justify="flex-end">
              <Button
                leftSection={<Plus size={18} />}
                onClick={() => {
                  setEditingWorkExperienceId(null);
                  setNewWorkExperience({});
                  setWorkExperienceModal(true);
                }}
              >
                Add Experience
              </Button>
            </Group>

            {resume.workExperience.length === 0 ? (
              <Text c="dimmed" ta="center">
                No work experience added yet
              </Text>
            ) : (
              resume.workExperience.map((exp) => (
                <Card key={exp.id} p="md" radius="md" withBorder>
                  <Group justify="space-between" mb="sm">
                    <div>
                      <Text fw={600}>{exp.title}</Text>
                      <Text c="dimmed" size="sm">
                        {exp.company}
                      </Text>
                    </div>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => {
                          setEditingWorkExperienceId(exp.id);
                          setNewWorkExperience(exp);
                          setWorkExperienceModal(true);
                        }}
                      >
                        <Edit2 size={18} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => onDeleteWorkExperience(exp.id)}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text size="sm" c="dimmed" mb="sm">
                    {exp.startDate} –{" "}
                    {exp.currentlyWorking ? "Present" : exp.endDate}
                  </Text>
                  <Text size="sm" mb="sm">
                    {exp.description}
                  </Text>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <Stack gap="xs">
                      <Text size="xs" fw={500} c="dimmed">
                        Key Achievements:
                      </Text>
                      {exp.achievements.map((achievement, idx) => (
                        <Text key={idx} size="xs">
                          • {achievement}
                        </Text>
                      ))}
                    </Stack>
                  )}
                </Card>
              ))
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="education" pt="md">
          <Stack gap="md">
            <Group justify="flex-end">
              <Button
                leftSection={<Plus size={18} />}
                onClick={() => {
                  setEditingEducationId(null);
                  setNewEducation({});
                  setEducationModal(true);
                }}
              >
                Add Education
              </Button>
            </Group>

            {resume.education.length === 0 ? (
              <Text c="dimmed" ta="center">
                No education added yet
              </Text>
            ) : (
              resume.education.map((edu) => (
                <Card key={edu.id} p="md" radius="md" withBorder>
                  <Group justify="space-between" mb="sm">
                    <div>
                      <Text fw={600}>{edu.school}</Text>
                      {edu.degree && <Text size="sm">{edu.degree}</Text>}
                    </div>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => {
                          setEditingEducationId(edu.id);
                          setNewEducation(edu);
                          setEducationModal(true);
                        }}
                      >
                        <Edit2 size={18} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => onDeleteEducation(edu.id)}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  {edu.year && (
                    <Text size="sm" c="dimmed">
                      {edu.year}
                    </Text>
                  )}
                </Card>
              ))
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="skills" pt="md">
          <Stack gap="md">
            <Group justify="flex-end">
              <Button
                leftSection={<Plus size={18} />}
                onClick={() => {
                  setEditingSkillId(null);
                  setNewSkill({});
                  setSkillModal(true);
                }}
              >
                Add Skill
              </Button>
            </Group>

            {resume.skills.length === 0 ? (
              <Text c="dimmed" ta="center">
                No skills added yet
              </Text>
            ) : (
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
                {resume.skills.map((skill) => (
                  <Card key={skill.id} p="md" radius="md" withBorder>
                    <Group justify="space-between" mb="sm">
                      <Text fw={500} size="sm">
                        {skill.name}
                      </Text>
                      <ActionIcon
                        size="xs"
                        color="red"
                        variant="subtle"
                        onClick={() => onDeleteSkill(skill.id)}
                      >
                        <Trash2 size={14} />
                      </ActionIcon>
                    </Group>
                    {skill.proficiencyLevel && (
                      <Badge size="sm" variant="light">
                        {skill.proficiencyLevel}
                      </Badge>
                    )}
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="projects" pt="md">
          <Stack gap="md">
            <Group justify="flex-end">
              <Button
                leftSection={<Plus size={18} />}
                onClick={() => {
                  setEditingProjectId(null);
                  setNewProject({});
                  setProjectModal(true);
                }}
              >
                Add Project
              </Button>
            </Group>

            {resume.projects.length === 0 ? (
              <Text c="dimmed" ta="center">
                No projects added yet
              </Text>
            ) : (
              resume.projects.map((proj) => (
                <Card key={proj.id} p="md" radius="md" withBorder>
                  <Group justify="space-between" mb="sm">
                    <Text fw={600}>{proj.title}</Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => {
                          setEditingProjectId(proj.id);
                          setNewProject(proj);
                          setProjectModal(true);
                        }}
                      >
                        <Edit2 size={18} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => onDeleteProject(proj.id)}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text size="sm" mb="sm">
                    {proj.description}
                  </Text>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <Group gap="xs">
                      {proj.technologies.map((tech) => (
                        <Badge key={tech} size="sm" variant="light">
                          {tech}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </Card>
              ))
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Work Experience Modal */}
      <Modal
        opened={workExperienceModal}
        onClose={() => {
          setWorkExperienceModal(false);
          setEditingWorkExperienceId(null);
          setNewWorkExperience({});
        }}
        title={editingWorkExperienceId ? "Edit Experience" : "Add Experience"}
      >
        <Stack gap="md">
          <TextInput
            label="Company"
            placeholder="Company name"
            value={(newWorkExperience.company as string) || ""}
            onChange={(e) =>
              setNewWorkExperience({
                ...newWorkExperience,
                company: e.currentTarget.value,
              })
            }
            required
          />
          <TextInput
            label="Job Title"
            placeholder="e.g., Senior Developer"
            value={(newWorkExperience.title as string) || ""}
            onChange={(e) =>
              setNewWorkExperience({
                ...newWorkExperience,
                title: e.currentTarget.value,
              })
            }
            required
          />
          <TextInput
            label="Start Date"
            placeholder="MM/YYYY"
            value={(newWorkExperience.startDate as string) || ""}
            onChange={(e) =>
              setNewWorkExperience({
                ...newWorkExperience,
                startDate: e.currentTarget.value,
              })
            }
          />
          <TextInput
            label="End Date"
            placeholder="MM/YYYY"
            value={(newWorkExperience.endDate as string) || ""}
            onChange={(e) =>
              setNewWorkExperience({
                ...newWorkExperience,
                endDate: e.currentTarget.value,
              })
            }
            disabled={newWorkExperience.currentlyWorking}
          />
          <Textarea
            label="Description"
            placeholder="Describe your responsibilities and achievements"
            value={(newWorkExperience.description as string) || ""}
            onChange={(e) =>
              setNewWorkExperience({
                ...newWorkExperience,
                description: e.currentTarget.value,
              })
            }
            rows={4}
          />
          <Textarea
            label="Key Achievements (one per line, optional)"
            placeholder="e.g., Increased sales by 50%&#10;Led team of 5 engineers&#10;Reduced page load time by 40%"
            value={((newWorkExperience.achievements as any) || []).join("\n")}
            onChange={(e) =>
              setNewWorkExperience({
                ...newWorkExperience,
                achievements: e.currentTarget.value
                  .split("\n")
                  .map((a) => a.trim())
                  .filter((a) => a.length > 0),
              })
            }
            rows={3}
          />
          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => {
                setWorkExperienceModal(false);
                setEditingWorkExperienceId(null);
                setNewWorkExperience({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveWorkExperience} loading={saving}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Education Modal */}
      <Modal
        opened={educationModal}
        onClose={() => {
          setEducationModal(false);
          setEditingEducationId(null);
          setNewEducation({});
        }}
        title={editingEducationId ? "Edit Education" : "Add Education"}
      >
        <Stack gap="md">
          <TextInput
            label="School"
            placeholder="University/School name"
            value={(newEducation.school as string) || ""}
            onChange={(e) =>
              setNewEducation({
                ...newEducation,
                school: e.currentTarget.value,
              })
            }
            required
          />
          <TextInput
            label="Degree"
            placeholder="e.g., Bachelor of Science"
            value={(newEducation.degree as string) || ""}
            onChange={(e) =>
              setNewEducation({
                ...newEducation,
                degree: e.currentTarget.value,
              })
            }
          />
          <TextInput
            label="Field of Study"
            placeholder="e.g., Computer Science"
            value={(newEducation.fieldOfStudy as string) || ""}
            onChange={(e) =>
              setNewEducation({
                ...newEducation,
                fieldOfStudy: e.currentTarget.value,
              })
            }
          />
          <TextInput
            label="Year"
            placeholder="YYYY"
            value={(newEducation.year as string) || ""}
            onChange={(e) =>
              setNewEducation({ ...newEducation, year: e.currentTarget.value })
            }
          />
          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => {
                setEducationModal(false);
                setEditingEducationId(null);
                setNewEducation({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEducation} loading={saving}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Skill Modal */}
      <Modal
        opened={skillModal}
        onClose={() => {
          setSkillModal(false);
          setEditingSkillId(null);
          setNewSkill({});
        }}
        title={editingSkillId ? "Edit Skill" : "Add Skill"}
      >
        <Stack gap="md">
          <TextInput
            label="Skill Name"
            placeholder="e.g., React, Python, Project Management"
            value={(newSkill.name as string) || ""}
            onChange={(e) =>
              setNewSkill({ ...newSkill, name: e.currentTarget.value })
            }
            required
          />
          <TextInput
            label="Category"
            placeholder="e.g., Technical, Leadership, Tools"
            value={(newSkill.category as string) || ""}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.currentTarget.value })
            }
          />
          <Select
            label="Proficiency Level"
            placeholder="Select proficiency level"
            data={["Beginner", "Intermediate", "Advanced", "Expert"]}
            value={(newSkill.proficiencyLevel as string) || ""}
            onChange={(value) =>
              setNewSkill({ ...newSkill, proficiencyLevel: value as any })
            }
          />
          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => {
                setSkillModal(false);
                setEditingSkillId(null);
                setNewSkill({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSkill} loading={saving}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Project Modal */}
      <Modal
        opened={projectModal}
        onClose={() => {
          setProjectModal(false);
          setEditingProjectId(null);
          setNewProject({});
        }}
        title={editingProjectId ? "Edit Project" : "Add Project"}
      >
        <Stack gap="md">
          <TextInput
            label="Project Title"
            placeholder="Project name"
            value={(newProject.title as string) || ""}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.currentTarget.value })
            }
            required
          />
          <Textarea
            label="Description"
            placeholder="Describe your project"
            value={(newProject.description as string) || ""}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                description: e.currentTarget.value,
              })
            }
            rows={4}
            required
          />
          <TextInput
            label="Technologies (comma-separated)"
            placeholder="React, Node.js, MongoDB"
            value={(newProject.technologies as any)?.join(", ") || ""}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                technologies: e.currentTarget.value
                  .split(",")
                  .map((t) => t.trim()),
              })
            }
          />
          <TextInput
            label="Project URL"
            placeholder="https://example.com"
            value={(newProject.url as string) || ""}
            onChange={(e) =>
              setNewProject({ ...newProject, url: e.currentTarget.value })
            }
          />
          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => {
                setProjectModal(false);
                setEditingProjectId(null);
                setNewProject({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProject} loading={saving}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
