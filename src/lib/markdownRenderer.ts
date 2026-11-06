import MarkdownIt from 'markdown-it';
import { highlightCode } from './shikiHighlighter';

// Custom markdown renderer with Shiki code highlighting
let md: MarkdownIt.MarkdownIt;

export async function renderMarkdown(content: string) {
  if (!md) {
    md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
    });

    // Custom fence renderer for code blocks
    const defaultFence = md.renderer.rules.fence || ((tokens, idx, options, env, self) => {
      return self.renderToken(tokens, idx, options);
    });

    md.renderer.rules.fence = async (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const info = token.info ? token.info.trim() : '';
      const lang = info.split(/\s+/)[0];
      const code = token.content;

      if (lang === 'mermaid') {
        return `<div class="mermaid">${code}</div>`;
      }

      // Use Shiki for syntax highlighting
      const highlighted = await highlightCode(code, lang);
      return `<div class="shiki-codeblock">${highlighted}</div>`;
    };

    // Custom image renderer
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const src = token.attrs?.[token.attrGet('src')]?.[0] || '';
      const alt = token.content || '';
      const title = token.attrs?.[token.attrGet('title')]?.[0] || '';
      
      return `<img src="${src}" alt="${alt}" ${title ? `title="${title}"` : ''} class="max-w-full h-auto rounded-md my-2" />`;
    };

    // Custom heading renderer with anchor links
    md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const level = token.tag.slice(1);
      const content = tokens[idx + 1]?.content || '';
      const slug = content.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      return `<h${level} id="${slug}" class="markdown-content-h${level}">`;
    };
  }

  return md.render(content);
}

export function escapeHtml(text: string) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
