import { Note } from '@/types';

// Seed data for testing
export const seedNotes: Note[] = [
  {
    id: '1',
    title: 'Getting Started',
    content: '# Welcome to Mistral AI Editor\n\nThis is a guide to get you started.\n\n## Features\n\n- Markdown support\n- AI assistance\n- File management\n\n## Quick Start\n\n1. Create a new note\n2. Start typing\n3. Use / for commands',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    modifiedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    title: 'Markdown Guide',
    content: '# Markdown Syntax\n\n## Headings\n\n# H1\n## H2\n### H3\n\n## Text Formatting\n\n**Bold**\n*Italic*\n~~Strikethrough~~\n\n## Lists\n\n- Item 1\n- Item 2\n  - Nested item\n\n## Code\n\n```typescript\nconst x = 5;\n```\n\n## Links and Images\n\n[Link](https://example.com)\n![Image](https://example.com/image.png)',
    createdAt: new Date('2024-01-02T00:00:00Z'),
    modifiedAt: new Date('2024-01-02T00:00:00Z'),
  },
  {
    id: '3',
    title: 'AI Commands',
    content: '# AI Command Reference\n\n## Available Commands\n\n| Command | Description |\n|---------|-------------|\n| `/h1` | Heading 1 |\n| `/h2` | Heading 2 |\n| `/bold` | Bold text |\n| `/italic` | Italic text |\n| `/quote` | Block quote |\n| `/image` | Insert image |\n| `/callout` | Callout block |\n| `/left` | เยื้องซ้าย (Left align) |\n| `/right` | เยื้องขวา (Right align) |\n\n## Usage\n\nType `/` to open the command palette, then select a command.',
    createdAt: new Date('2024-01-03T00:00:00Z'),
    modifiedAt: new Date('2024-01-03T00:00:00Z'),
  },
  {
    id: '4',
    title: 'Code Examples',
    content: '# Code Examples\n\n## TypeScript\n\n```typescript\ninterface User {
  id: string;
  name: string;
  email: string;
}\n\nconst user: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};\n```\n\n## Python\n\n```python\ndef greet(name: str) -> str:
    return f"Hello, {name}!"\n\nprint(greet("World"))\n```\n\n## JavaScript\n\n```javascript\nconst greet = (name) => {
  return `Hello, ${name}!`;
};\n\nconsole.log(greet("World"));\n```',
    createdAt: new Date('2024-01-04T00:00:00Z'),
    modifiedAt: new Date('2024-01-04T00:00:00Z'),
  },
  {
    id: '5',
    title: 'Thai Language Test',
    content: '# ทดสอบภาษาไทย\n\n## การจัดรูปแบบข้อความ\n\n**ตัวหนา**\n*ตัวเอียง*\n~~ขีดทับ~~\n\n## การจัดแนว\n\nเยื้องซ้าย\n\nเยื้องขวา\n\n## รายการ\n\n- รายการ 1\n- รายการ 2\n- รายการ 3\n\n## โค้ด\n\n```python\nprint("สวัสดีชาวโลก")\n```',
    createdAt: new Date('2024-01-05T00:00:00Z'),
    modifiedAt: new Date('2024-01-05T00:00:00Z'),
  },
];

// Mock API responses
export const mockApiResponses = {
  notes: seedNotes,
  note: (id: string) => seedNotes.find((note) => note.id === id) || null,
};

// Helper to create a note
export function createTestNote(overrides: Partial<Note> = {}): Note {
  return {
    id: Date.now().toString(),
    title: 'Test Note',
    content: '# Test Content',
    createdAt: new Date(),
    modifiedAt: new Date(),
    ...overrides,
  };
}
