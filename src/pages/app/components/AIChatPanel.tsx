import { useState, useEffect, useRef } from 'react';
import {
  Stack,
  TextInput,
  Button,
  Group,
  Paper,
  Box,
  Avatar,
  Text,
  ScrollArea,
  Loader,
  Card,
  ActionIcon,
} from '@mantine/core';
import { Send, Copy, Check } from 'lucide-react';
import type { AIChatMessage, MasterResume } from '@/types/resume';

interface AIChatPanelProps {
  messages: AIChatMessage[];
  loading: boolean;
  error: string | null;
  onSendMessage: (message: string) => Promise<void>;
  resume: MasterResume | null;
}

export default function AIChatPanel({
  messages,
  loading,
  error,
  onSendMessage,
  resume,
}: AIChatPanelProps) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const message = input;
    setInput('');

    try {
      await onSendMessage(message);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedPrompts = [
    'Improve the wording of my work experience descriptions',
    'Suggest ways to quantify my achievements',
    'Add missing technical skills I should include',
    'Help me structure my summary',
    'Review my project descriptions',
  ];

  if (!resume) {
    return (
      <Paper p="lg" radius="md" withBorder>
        <Text c="dimmed" ta="center">
          Load or create a resume to use the AI assistant
        </Text>
      </Paper>
    );
  }

  return (
    <Stack gap="md" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {messages.length === 0 && (
        <Stack gap="md">
          <Paper p="lg" radius="md" bg="blue.0" withBorder>
            <Text size="sm" mb="md" fw={500}>
              Welcome to your Resume AI Assistant
            </Text>
            <Text size="sm" c="dimmed" mb="lg">
              Get personalized suggestions to improve your resume. Try one of these prompts or ask
              anything:
            </Text>
            <Stack gap="sm">
              {suggestedPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="light"
                  fullWidth
                  justify="flex-start"
                  size="sm"
                  onClick={() => {
                    setInput(prompt);
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Stack>
      )}

      {messages.length > 0 && (
        <ScrollArea style={{ flex: 1, minHeight: 0 }} viewportRef={scrollRef}>
          <Stack gap="md" p="md">
            {messages.map((message) => (
              <Group key={message.id} align="flex-start" gap="md">
                <Avatar
                  size="sm"
                  radius="xl"
                  color={message.role === 'user' ? 'blue' : 'gray'}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '4px',
                  }}
                >
                  {message.role === 'user' ? 'U' : 'AI'}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Card
                    p="md"
                    radius="md"
                    bg={message.role === 'user' ? 'blue.1' : 'gray.1'}
                    withBorder={false}
                  >
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {message.content}
                    </Text>
                  </Card>
                  {message.role === 'assistant' && (
                    <Group gap="xs" mt="xs">
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        onClick={() => copyToClipboard(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </ActionIcon>
                      <Text size="xs" c="dimmed">
                        {copiedId === message.id ? 'Copied!' : 'Copy'}
                      </Text>
                    </Group>
                  )}
                </div>
              </Group>
            ))}

            {loading && (
              <Group align="center" gap="md">
                <Avatar size="sm" radius="xl" color="gray">
                  AI
                </Avatar>
                <Box>
                  <Loader size="sm" />
                </Box>
              </Group>
            )}

            {error && (
              <Group align="flex-start" gap="md">
                <Avatar size="sm" radius="xl" color="red">
                  !
                </Avatar>
                <Card p="md" radius="md" bg="red.1" withBorder={false}>
                  <Text size="sm" c="red">
                    {error}
                  </Text>
                </Card>
              </Group>
            )}
          </Stack>
        </ScrollArea>
      )}

      <Group gap="sm" mt="auto">
        <TextInput
          placeholder="Ask for help improving your resume..."
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSend} loading={loading} size="sm">
          <Send size={18} />
        </Button>
      </Group>
    </Stack>
  );
}
