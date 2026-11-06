import { getHighlighter } from 'shiki';

// Load themes and languages
const themes = ['github-dark', 'github-light'];
const langs = [
  'javascript',
  'typescript',
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'bash',
  'json',
  'yaml',
  'html',
  'css',
  'markdown',
  'sql',
  'graphql',
];

let highlighterPromise: Promise<any> | null = null;

export async function getShikiHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes,
      langs,
    });
  }
  return highlighterPromise;
}

export async function highlightCode(code: string, lang: string = 'text') {
  const highlighter = await getShikiHighlighter();
  
  try {
    return highlighter.codeToHtml(code, {
      lang,
      theme: 'github-dark',
      lineNumbers: true,
    });
  } catch (error) {
    console.error('Error highlighting code:', error);
    return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
