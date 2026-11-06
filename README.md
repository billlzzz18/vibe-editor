# Mistral AI Editor - Advanced Knowledge Base

A cutting-edge, AI-powered knowledge base application with **Obsidian-like interface**, **shadcn/ui components**, **MCP support**, **glass morphism design**, and **drag-and-drop markdown editor**.

![Mistral AI Editor Screenshot](https://via.placeholder.com/800x600/1a1a1a/646cff?text=Mistral+AI+Editor)

## ✨ Features

### 🎨 UI & Design
- ✅ **shadcn/ui** - Professional, accessible UI components
- ✅ **Glass Morphism** - Modern frosted glass effect with blur
- ✅ **iOS Style** - Raised curved edges with depth
- ✅ **Tailwind CSS v4** - Utility-first styling with custom theme
- ✅ **Dark/Light Mode** - Automatic theme switching
- ✅ **Responsive Design** - Works on all screen sizes

### 🤖 AI & MCP
- ✅ **Mistral AI Integration** - Official TypeScript SDK
- ✅ **MCP Client & Server** - Model Context Protocol support
- ✅ **Streaming Responses** - Real-time AI chat with Streamdown
- ✅ **AI Element Components** - Specialized AI UI components
- ✅ **Tool Calling** - Execute MCP tools from chat
- ✅ **Multiple AI Models** - Support for various AI providers

### 📝 Editor
- ✅ **TipTap Markdown Editor** - Full markdown support
- ✅ **Drag & Drop** - Drag images and files into editor
- ✅ **Syntax Highlighting** - Shiki-powered code blocks
- ✅ **Code Themes** - Multiple themes (GitHub, Dracula, Monokai, etc.)
- ✅ **All Language Support** - 100+ programming languages
- ✅ **Live Preview** - Real-time markdown preview
- ✅ **Task Lists** - Checkbox support
- ✅ **Tables** - Markdown table support
- ✅ **Images** - Embed images with drag & drop

### 🗂️ Filesystem
- ✅ **File Explorer** - Tree view with folders and files
- ✅ **Create/Delete/Rename** - Full file management
- ✅ **Search** - Quick file search
- ✅ **Keyboard Shortcuts** - Efficient navigation
- ✅ **Context Menu** - Right-click actions

### ⚙️ Settings
- ✅ **Theme Settings** - Dark, Light, System
- ✅ **Code Theme** - Multiple syntax highlighting themes
- ✅ **Editor Settings** - Line numbers, word wrap, auto-save
- ✅ **Font Size** - Adjustable text size
- ✅ **Keyboard Shortcuts** - Customizable bindings

### 🚀 Backend
- ✅ **Hono Framework** - Fast, lightweight server
- ✅ **Bun Runtime** - High-performance JavaScript runtime
- ✅ **Supabase** - Database & authentication
- ✅ **Cloudflare Workers** - Edge deployment ready

## 📁 Project Structure

```
.
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # TypeScript config for Node
├── README.md
└── src/
    ├── main.tsx                  # React entry point
    ├── App.tsx                   # Main application component
    ├── lib/
    │   ├── utils.ts              # Utility functions
    │   ├── shikiHighlighter.ts   # Shiki syntax highlighting
    │   ├── markdownRenderer.ts   # Markdown rendering
    │   └── mcp/
    │       ├── client.ts         # MCP client
    │       └── server.ts         # MCP server
    ├── components/
    │   ├── ui/                   # shadcn/ui components
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   ├── select.tsx
    │   │   ├── dialog.tsx
    │   │   └── switch.tsx
    │   ├── editor/
    │   │   └── MarkdownEditor.tsx # Rich markdown editor
    │   ├── ai/
    │   │   ├── AIAssistant.tsx    # AI chat panel
    │   │   └── AIElement.tsx      # AI action elements
    │   ├── settings/
    │   │   └── SettingsPanel.tsx  # App settings
    │   └── filesystem/
    │       └── FileExplorer.tsx   # File explorer
    ├── types/
    │   └── index.ts              # TypeScript types
    └── styles/
        └── globals.css           # Global styles
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd /workspace
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Create a `notes` table:

```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Get your Supabase URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env` file:

```bash
MISTRAL_API_KEY=your_mistral_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
MCP_SERVER_URL=ws://localhost:3000  # Optional
```

### 4. Run Locally

In one terminal, start the Vite dev server:
```bash
npm run dev
```

In another terminal, start the Bun server:
```bash
npm run server
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Editor
- **Create Note**: Click "New Note" or press `Ctrl+N`
- **Save**: `Ctrl+S` or click Save button
- **Markdown**: Full markdown support with live preview
- **Drag & Drop**: Drag images directly into the editor
- **Code Blocks**: Type ```` ``` ```` and select language

### AI Assistant
- **Open**: Click AI button or press `Ctrl+K`
- **Chat**: Ask questions about your notes
- **MCP Tools**: Connect to MCP servers for extended functionality
- **Streaming**: Real-time responses with Streamdown

### Filesystem
- **Open**: Click Files button or press `Ctrl+E`
- **New File**: Click "New File" button
- **New Folder**: Click "New Folder" button
- **Search**: Type to search files
- **Context Menu**: Right-click for actions

### Settings
- **Open**: Click Settings button or press `Ctrl+,`
- **Theme**: Choose Dark, Light, or System
- **Code Theme**: Select syntax highlighting theme
- **Editor**: Configure line numbers, word wrap, etc.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save current note |
| `Ctrl+K` | Open/close AI assistant |
| `Ctrl+,` | Open/close settings |
| `Ctrl+E` | Open/close file explorer |
| `Ctrl+N` | Create new note |
| `Ctrl+B` | Toggle bold |
| `Ctrl+I` | Toggle italic |
| `Enter` | Send message (in AI chat) |
| `Escape` | Close modals/dialogs |

## 🔌 MCP Integration

The app supports the **Model Context Protocol (MCP)** for connecting to external AI services and tools.

### Connect to MCP Server

1. Start your MCP server (e.g., `python -m mcp_server`)
2. In the AI Assistant panel, enter the server URL
3. Click "Connect MCP"
4. Available tools will appear in the dropdown
5. Select a tool and send a message to execute it

### Available MCP Tools

- `get_editor_content` - Get current editor content
- `set_editor_content` - Set editor content
- `list_notes` - List all notes
- `create_note` - Create a new note

### Add Custom MCP Tools

```typescript
// In your MCP server
mcpServer.addTool('my_tool', 'Description', async (args) => {
  // Your tool logic here
  return { result: 'Tool executed successfully' };
});
```

## 🎨 Design System

### Glass Morphism
The app uses **glass morphism** for a modern, frosted glass effect:

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
```

### iOS Style
Raised curved edges with depth:

```css
.ios {
  border-radius: 28px;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Color Palette
- **Primary**: `#646cff` (Mistral accent color)
- **Background**: `#0a0a0a` (Dark mode)
- **Foreground**: `#ffffff`
- **Muted**: `#71717a`
- **Border**: `#27272a`

## 📦 Technologies

### Frontend
- **[React 18](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Professional UI components
- **[TipTap](https://tiptap.dev/)** - Rich text editor
- **[Shiki](https://shiki.matsu.io/)** - Syntax highlighting
- **[react-dropzone](https://react-dropzone.js.org/)** - Drag & drop
- **[Vite](https://vitejs.dev/)** - Build tool

### Backend
- **[Hono](https://hono.dev/)** - Web framework
- **[Bun](https://bun.sh/)** - JavaScript runtime
- **[Supabase](https://supabase.com/)** - Database & auth
- **[MCP SDK](https://github.com/modelcontextprotocol/sdk)** - Model Context Protocol
- **[Mistral AI SDK](https://github.com/mistralai/mistral-src)** - AI integration

### AI & Streaming
- **[Streamdown](https://github.com/streamdown/streamdown)** - Streaming protocol
- **[Mistral Small Latest](https://mistral.ai/)** - Default AI model

## 🚀 Deployment

### Cloudflare Workers

```bash
# Install Wrangler
npm install -g wrangler

# Deploy
wrangler deploy
```

### Docker

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "server"]
```

### Railway / Render

1. Create a new project
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

## 📜 License

MIT License - Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

- [Mistral AI](https://mistral.ai/) - AI models and SDK
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Shiki](https://shiki.matsu.io/) - Syntax highlighting
- [MCP](https://modelcontextprotocol.io/) - Model Context Protocol

---

**Built with ❤️ and AI**
