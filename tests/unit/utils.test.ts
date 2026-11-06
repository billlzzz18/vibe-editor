import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatDateTime, truncate, generateId, escapeHtml } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      expect(cn('foo', isActive && 'bar')).toBe('foo bar');
    });

    it('should handle false values', () => {
      expect(cn('foo', false && 'bar')).toBe('foo');
    });

    it('should handle Tailwind conflict resolution', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should handle date string', () => {
      const formatted = formatDate('2024-01-15T12:00:00Z');
      expect(formatted).toContain('Jan');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = new Date('2024-01-15T12:30:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('12');
      expect(formatted).toContain('30');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const text = 'This is a very long text';
      expect(truncate(text, 10)).toBe('This is a...');
    });

    it('should not truncate short strings', () => {
      const text = 'Short';
      expect(truncate(text, 10)).toBe('Short');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(5);
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const html = '<script>alert("XSS")</script>';
      const escaped = escapeHtml(html);
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
    });

    it('should handle plain text', () => {
      const text = 'Hello World';
      expect(escapeHtml(text)).toBe(text);
    });

    it('should escape quotes', () => {
      const text = 'He said "Hello"';
      const escaped = escapeHtml(text);
      expect(escaped).toContain('&quot;');
    });
  });
});
