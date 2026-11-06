import { describe, it, expect } from 'vitest';
import { seedNotes, createTestNote, mockApiResponses } from '@/tests/seed/notes';

describe('Seed Data', () => {
  describe('seedNotes', () => {
    it('should have 5 seed notes', () => {
      expect(seedNotes).toHaveLength(5);
    });

    it('should have unique IDs', () => {
      const ids = seedNotes.map((note) => note.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all required fields', () => {
      seedNotes.forEach((note) => {
        expect(note).toHaveProperty('id');
        expect(note).toHaveProperty('title');
        expect(note).toHaveProperty('content');
        expect(note).toHaveProperty('createdAt');
        expect(note).toHaveProperty('modifiedAt');
      });
    });

    it('should have first note with Getting Started title', () => {
      expect(seedNotes[0].title).toBe('Getting Started');
    });

    it('should have Thai language note', () => {
      const thaiNote = seedNotes.find((note) => note.title === 'Thai Language Test');
      expect(thaiNote).toBeDefined();
      expect(thaiNote?.content).toContain('ภาษาไทย');
      expect(thaiNote?.content).toContain('เยื้องซ้าย');
      expect(thaiNote?.content).toContain('เยื้องขวา');
    });
  });

  describe('createTestNote', () => {
    it('should create a note with default values', () => {
      const note = createTestNote();
      expect(note.id).toBeDefined();
      expect(note.title).toBe('Test Note');
      expect(note.content).toBe('# Test Content');
      expect(note.createdAt).toBeInstanceOf(Date);
      expect(note.modifiedAt).toBeInstanceOf(Date);
    });

    it('should override default values', () => {
      const note = createTestNote({
        title: 'Custom Title',
        content: 'Custom Content',
      });
      expect(note.title).toBe('Custom Title');
      expect(note.content).toBe('Custom Content');
    });

    it('should generate unique IDs', () => {
      const note1 = createTestNote();
      const note2 = createTestNote();
      expect(note1.id).not.toBe(note2.id);
    });
  });

  describe('mockApiResponses', () => {
    it('should return all notes', () => {
      expect(mockApiResponses.notes).toBe(seedNotes);
    });

    it('should find note by ID', () => {
      const note = mockApiResponses.note('1');
      expect(note).toBeDefined();
      expect(note?.id).toBe('1');
    });

    it('should return null for non-existent ID', () => {
      const note = mockApiResponses.note('999');
      expect(note).toBeNull();
    });
  });
});
