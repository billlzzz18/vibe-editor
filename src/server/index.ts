import { Hono } from 'hono';
import { stream, Streamdown } from '@streamdown/streamdown';
import { createClient } from '@supabase/supabase-js';
import { Mistral } from '@mistralai/mistralai';
import { serveStatic } from 'hono/bun';

interface Env {
  MISTRAL_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

// Initialize Supabase client
function getSupabase(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}

// Initialize Mistral client
function getMistral(env: Env) {
  return new Mistral({ apiKey: env.MISTRAL_API_KEY });
}

// Serve static files
app.use('/static/*', serveStatic({ root: './dist' }));

// API endpoint for chat with streaming
app.post('/api/chat', async (c) => {
  try {
    const { messages, noteId } = await c.req.json();
    const env = c.env;

    const mistral = getMistral(env);
    const supabase = getSupabase(env);

    // Create streamdown for streaming responses
    const sd = new Streamdown();

    const responseStream = mistral.chat.stream({
      model: 'mistral-small-latest',
      messages: messages || [{ role: 'user', content: 'Hello' }],
    });

    // Transform the Mistral stream into Streamdown format
    const streamResponse = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        for await (const chunk of responseStream) {
          if (chunk.choices?.[0]?.delta?.content) {
            const text = chunk.choices[0].delta.content;
            controller.enqueue(encoder.encode(sd.toChunk(text)));
          }
        }

        // Save to Supabase if noteId provided
        if (noteId) {
          const lastMessage = messages[messages.length - 1];
          const assistantMessage = { role: 'assistant', content: '' };

          // Collect all chunks to build full response
          const fullResponse: string[] = [];
          for await (const chunk of responseStream) {
            if (chunk.choices?.[0]?.delta?.content) {
              fullResponse.push(chunk.choices[0].delta.content);
            }
          }

          assistantMessage.content = fullResponse.join('');

          await supabase
            .from('notes')
            .update({
              content: JSON.stringify([...messages, assistantMessage]),
            })
            .eq('id', noteId);
        }

        controller.close();
      },
    });

    return new Response(streamResponse, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: 'Failed to process chat' }, 500);
  }
});

// API endpoints for knowledge base (notes)
app.get('/api/notes', async (c) => {
  try {
    const env = c.env;
    const supabase = getSupabase(env);

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return c.json(data || []);
  } catch (error) {
    console.error('Notes fetch error:', error);
    return c.json({ error: 'Failed to fetch notes' }, 500);
  }
});

app.get('/api/notes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const env = c.env;
    const supabase = getSupabase(env);

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.error('Note fetch error:', error);
    return c.json({ error: 'Failed to fetch note' }, 500);
  }
});

app.post('/api/notes', async (c) => {
  try {
    const { title, content } = await c.req.json();
    const env = c.env;
    const supabase = getSupabase(env);

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          title,
          content: JSON.stringify(content || ''),
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return c.json(data, 201);
  } catch (error) {
    console.error('Note create error:', error);
    return c.json({ error: 'Failed to create note' }, 500);
  }
});

app.put('/api/notes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { title, content } = await c.req.json();
    const env = c.env;
    const supabase = getSupabase(env);

    const { data, error } = await supabase
      .from('notes')
      .update({
        title,
        content: JSON.stringify(content),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.error('Note update error:', error);
    return c.json({ error: 'Failed to update note' }, 500);
  }
});

app.delete('/api/notes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const env = c.env;
    const supabase = getSupabase(env);

    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (error) throw error;

    return c.json({ success: true });
  } catch (error) {
    console.error('Note delete error:', error);
    return c.json({ error: 'Failed to delete note' }, 500);
  }
});

// Serve the main page
app.get('*', serveStatic({ path: './dist/index.html' }));

// Health check
app.get('/health', (c) => c.text('OK'));

export default {
  fetch: app.fetch,
  port: process.env.PORT || 3000,
};
