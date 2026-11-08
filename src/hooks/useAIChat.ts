import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/apiClient';
import type { AIChatMessage, MasterResume } from '@/types/resume';

interface UseAIChatResult {
  messages: AIChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (userMessage: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAIChat(resume: MasterResume | null): UseAIChatResult {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildResumeContext = useCallback(() => {
    if (!resume) return '';

    const context = `
Current Resume:

Work Experience:
${resume.workExperience.map((exp) => `- ${exp.title} at ${exp.company} (${exp.startDate || 'N/A'} - ${exp.endDate || 'Present'}): ${exp.description}`).join('\n')}

Education:
${resume.education.map((edu) => `- ${edu.degree || 'N/A'} from ${edu.school} (${edu.year || 'N/A'})`).join('\n')}

Skills:
${resume.skills.map((skill) => `- ${skill.name}`).join(', ')}

Projects:
${resume.projects.map((proj) => `- ${proj.title}: ${proj.description}`).join('\n')}
`;
    return context;
  }, [resume]);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      setLoading(true);
      setError(null);

      const newUserMessage: AIChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);

      try {
        const systemPrompt = `You are an AI resume optimization assistant. Your role is to help users improve their resume by providing constructive suggestions and actionable feedback. When suggesting changes, be specific and explain why the change would be beneficial. If the user asks for specific edits, provide them in a clear, structured format.

${buildResumeContext()}

Guidelines:
1. Provide specific, actionable suggestions
2. Focus on improving clarity, impact, and relevance
3. Suggest improvements to wording, structure, and content
4. Help quantify achievements and add metrics
5. Recommend adding missing sections or information
6. Be encouraging while maintaining professionalism`;

        const response = await apiFetch<{ message: string }>('/api/ai-chat', {
          method: 'POST',
          body: JSON.stringify({
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              { role: 'user', content: userMessage },
            ],
            systemPrompt,
          }),
        });

        const assistantMessage: AIChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [messages, buildResumeContext]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}
