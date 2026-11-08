import OpenAI from 'openai';
import { supabaseClient } from './_lib/supabase-client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default async function handler(
  req: { method?: string; body?: any; headers?: any },
  res: { status: (code: number) => { json: (data: any) => any } }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the caller is logged in
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Invalid Token' });
  }

  const { data: { user } } = await supabaseClient.auth.getUser(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid User' });
  }

  const { messages, systemPrompt } = req.body as {
    messages?: Message[];
    systemPrompt?: string;
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid messages' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            systemPrompt ||
            'You are a helpful resume optimization assistant. Provide constructive, specific feedback and suggestions to improve resumes.',
        },
        ...messages,
      ],
      max_tokens: 2000,
    });

    const assistantMessage = response.choices[0]?.message?.content;
    if (!assistantMessage) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    return res.status(200).json({ message: assistantMessage });
  } catch (err) {
    console.error('AI chat error:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to process chat request',
    });
  }
}
