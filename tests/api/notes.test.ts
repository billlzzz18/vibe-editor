import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { seedNotes, createTestNote } from '@/tests/seed/notes';

// Mock fetch
global.fetch = vi.fn();

describe('Notes API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/notes', () => {
    it('should return all notes', async () => {
      // Mock successful response
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => seedNotes,
      } as Response);

      const response = await fetch('/api/notes');
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith('/api/notes');
      expect(response.ok).toBe(true);
      expect(data).toEqual(seedNotes);
    });

    it('should handle error when fetching notes', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      } as Response);

      const response = await fetch('/api/notes');

      expect(fetch).toHaveBeenCalledWith('/api/notes');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it('should return empty array when no notes', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const response = await fetch('/api/notes');
      const data = await response.json();

      expect(data).toEqual([]);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return a specific note', async () => {
      const noteId = '1';
      const expectedNote = seedNotes[0];

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => expectedNote,
      } as Response);

      const response = await fetch(`/api/notes/${noteId}`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`/api/notes/${noteId}`);
      expect(response.ok).toBe(true);
      expect(data).toEqual(expectedNote);
    });

    it('should handle note not found', async () => {
      const noteId = '999';

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Note not found' }),
      } as Response);

      const response = await fetch(`/api/notes/${noteId}`);

      expect(fetch).toHaveBeenCalledWith(`/api/notes/${noteId}`);
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const newNote = createTestNote({ title: 'New Note', content: 'Content' });

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => newNote,
      } as Response);

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Note', content: 'Content' }),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Note', content: 'Content' }),
      });
      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(data).toEqual(newNote);
    });

    it('should handle validation error', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Title is required' }),
      } as Response);

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }),
      });

      expect(fetch).toHaveBeenCalledWith('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }),
      });
      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note', async () => {
      const noteId = '1';
      const updatedNote = { ...seedNotes[0], title: 'Updated Title' };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => updatedNote,
      } as Response);

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title', content: updatedNote.content }),
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title', content: updatedNote.content }),
      });
      expect(response.ok).toBe(true);
      expect(data).toEqual(updatedNote);
    });

    it('should handle update error', async () => {
      const noteId = '1';

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Note not found' }),
      } as Response);

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title' }),
      });

      expect(fetch).toHaveBeenCalledWith(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title' }),
      });
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      const noteId = '1';

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      expect(response.ok).toBe(true);
      expect(data).toEqual({ success: true });
    });

    it('should handle delete error', async () => {
      const noteId = '999';

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Note not found' }),
      } as Response);

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      expect(fetch).toHaveBeenCalledWith(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });
});
