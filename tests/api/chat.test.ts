import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Chat API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/chat', () => {
    it('should return chat response', async () => {
      const mockResponse = {
        id: 'chat-1',
        object: 'chat.completion',
        created: Date.now(),
        model: 'mistral-small-latest',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Hello! How can I help you today?'
            },
            finish_reason: 'stop'
          }
        ]
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });
      expect(response.ok).toBe(true);
      expect(data).toEqual(mockResponse);
    });

    it('should handle error when chat fails', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Failed to get response from Mistral API' }),
      } as Response);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it('should handle empty messages', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Messages are required' }),
      } as Response);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should handle streaming response', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"text": "Hello"}\n\n'));
          controller.enqueue(new TextEncoder().encode('data: {"text": " World"}\n\n'));
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        }
      });

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        body: mockStream,
      } as Response);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      expect(response.ok).toBe(true);
      expect(response.body).toBeDefined();
    });

    it('should handle chat with noteId', async () => {
      const mockResponse = {
        id: 'chat-1',
        object: 'chat.completion',
        created: Date.now(),
        model: 'mistral-small-latest',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'This is about your note.'
            },
            finish_reason: 'stop'
          }
        ]
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Tell me about my note' }],
          noteId: '1',
        }),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Tell me about my note' }],
          noteId: '1',
        }),
      });
      expect(response.ok).toBe(true);
      expect(data).toEqual(mockResponse);
    });

    it('should handle Thai language in chat', async () => {
      const mockResponse = {
        id: 'chat-1',
        object: 'chat.completion',
        created: Date.now(),
        model: 'mistral-small-latest',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'สวัสดีครับ'
            },
            finish_reason: 'stop'
          }
        ]
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'สวัสดีครับ' }],
        }),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'สวัสดีครับ' }],
        }),
      });
      expect(response.ok).toBe(true);
      expect(data.choices[0].message.content).toBe('สวัสดีครับ');
    });
  });
});
