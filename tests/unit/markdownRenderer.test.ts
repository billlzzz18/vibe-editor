import { describe, it, expect, vi, beforeAll } from 'vitest';
import { renderMarkdown } from '@/lib/markdownRenderer';

describe('Markdown Renderer', () => {
  beforeAll(() => {
    // Mock Shiki highlighter to avoid loading themes/languages
    vi.mock('@/lib/shikiHighlighter', () => ({
      highlightCode: vi.fn().mockResolvedValue('<pre>code</pre>'),
    }));
  });

  it('should render plain text', async () => {
    const result = await renderMarkdown('Hello World');
    expect(result).toContain('Hello World');
  });

  it('should render headings', async () => {
    const markdown = '# Heading 1\n## Heading 2\n### Heading 3';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<h1');
    expect(result).toContain('<h2');
    expect(result).toContain('<h3');
    expect(result).toContain('Heading 1');
    expect(result).toContain('Heading 2');
    expect(result).toContain('Heading 3');
  });

  it('should render bold and italic', async () => {
    const markdown = '**bold** *italic* **_bold italic_**';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });

  it('should render lists', async () => {
    const markdown = '- Item 1\n- Item 2\n  - Nested';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<ul');
    expect(result).toContain('<li');
    expect(result).toContain('Item 1');
    expect(result).toContain('Item 2');
    expect(result).toContain('Nested');
  });

  it('should render ordered lists', async () => {
    const markdown = '1. First\n2. Second\n3. Third';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<ol');
    expect(result).toContain('<li');
    expect(result).toContain('First');
    expect(result).toContain('Second');
    expect(result).toContain('Third');
  });

  it('should render links', async () => {
    const markdown = '[Link](https://example.com)';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<a');
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('Link');
  });

  it('should render images', async () => {
    const markdown = '![Alt text](image.png)';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<img');
    expect(result).toContain('alt="Alt text"');
    expect(result).toContain('src="image.png"');
  });

  it('should render blockquotes', async () => {
    const markdown = '> This is a quote';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<blockquote');
    expect(result).toContain('This is a quote');
  });

  it('should render code blocks', async () => {
    const markdown = '```typescript\nconst x = 5;\n```';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<pre');
    expect(result).toContain('typescript');
  });

  it('should render horizontal rule', async () => {
    const markdown = '---';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<hr');
  });

  it('should render tables', async () => {
    const markdown = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('<table');
    expect(result).toContain('<th');
    expect(result).toContain('<td');
    expect(result).toContain('Header 1');
    expect(result).toContain('Cell 1');
  });

  it('should handle empty markdown', async () => {
    const result = await renderMarkdown('');
    expect(result).toBe('');
  });

  it('should handle Thai characters', async () => {
    const markdown = '# ทดสอบภาษาไทย\n\nเยื้องซ้าย\nเยื้องขวา';
    const result = await renderMarkdown(markdown);
    expect(result).toContain('ทดสอบภาษาไทย');
    expect(result).toContain('เยื้องซ้าย');
    expect(result).toContain('เยื้องขวา');
  });
});
