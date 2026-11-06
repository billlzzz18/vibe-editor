import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { AIElement } from '@/components/ai/AIElement';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { FileExplorer } from '@/components/filesystem/FileExplorer';
import { CommandDialog } from '@/components/ui/command-dialog';
import { mcpClient } from '@/lib/mcp/client';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  File,
  Folder,
  Bot,
  Settings as SettingsIcon,
  Sparkles,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Bold,
  Italic,
  Quote,
  Image as ImageIcon,
  AlignLeft,
  AlignRight,
  MessageSquare,
  Plus,
} from 'lucide-react';

// Types
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  modifiedAt: Date | string;
}

// Slash command items
const commandItems = [
  {
    value: 'h1',
    label: 'Heading 1',
    group: 'Headings',
    icon: <Heading1 className="h-4 w-4" />,
  },
  {
    value: 'h2',
    label: 'Heading 2',
    group: 'Headings',
    icon: <Heading2 className="h-4 w-4" />,
  },
  {
    value: 'h3',
    label: 'Heading 3',
    group: 'Headings',
    icon: <Heading3 className="h-4 w-4" />,
  },
  {
    value: 'h4',
    label: 'Heading 4',
    group: 'Headings',
    icon: <Heading4 className="h-4 w-4" />,
  },
  {
    value: 'h5',
    label: 'Heading 5',
    group: 'Headings',
    icon: <Heading5 className="h-4 w-4" />,
  },
  {
    value: 'h6',
    label: 'Heading 6',
    group: 'Headings',
    icon: <Heading6 className="h-4 w-4" />,
  },
  {
    value: 'bold',
    label: 'Bold',
    group: 'Text',
    icon: <Bold className="h-4 w-4" />,
  },
  {
    value: 'italic',
    label: 'Italic',
    group: 'Text',
    icon: <Italic className="h-4 w-4" />,
  },
  {
    value: 'quote',
    label: 'Quote',
    group: 'Blocks',
    icon: <Quote className="h-4 w-4" />,
  },
  {
    value: 'image',
    label: 'Image',
    group: 'Media',
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    value: 'callout',
    label: 'Callout',
    group: 'Blocks',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    value: 'left',
    label: 'เยื้องซ้าย',
    group: 'Alignment',
    icon: <AlignLeft className="h-4 w-4" />,
  },
  {
    value: 'right',
    label: 'เยื้องขวา',
    group: 'Alignment',
    icon: <AlignRight className="h-4 w-4" />,
  },
];

export default function App() {
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFilesystemOpen, setIsFilesystemOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mcpConnected, setMcpConnected] = useState(false);
  const [activePanel, setActivePanel] = useState<'ai' | 'settings' | 'filesystem' | null>(null);

  const editorRef = useRef<any>(null);

  // Load notes
  const loadNotes = useCallback(async () => {
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) throw new Error('Failed to load notes');
      const data = await response.json();
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, []);

  // Load a specific note
  const loadNote = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`);
      if (!response.ok) throw new Error('Failed to load note');
      const note = await response.json();
      setCurrentNote(note);
      setContent(note.content || '');
      setIsSidebarOpen(false); // Close sidebar on mobile when selecting note
    } catch (error) {
      console.error('Error loading note:', error);
    }
  }, []);

  // Create new note
  const createNote = useCallback(async (title: string) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: content || '# New Note\n\nStart writing...',
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create note');
      const note = await response.json();
      setNotes((prev) => [note, ...prev]);
      setCurrentNote(note);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }, [content]);

  // Save note
  const saveNote = useCallback(async () => {
    if (!currentNote) return;

    try {
      const response = await fetch(`/api/notes/${currentNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentNote.title,
          content,
        }),
      });

      if (!response.ok) throw new Error('Failed to save note');
      const note = await response.json();
      setCurrentNote(note);
      setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }, [currentNote, content]);

  // Delete note
  const deleteNote = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (currentNote?.id === id) {
        setCurrentNote(null);
        setContent('');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, [currentNote]);

  // Connect to MCP server
  const connectMcp = useCallback(async (url: string) => {
    try {
      const connected = await mcpClient.connect(url);
      setMcpConnected(connected);
      return connected;
    } catch (error) {
      console.error('MCP connection error:', error);
      return false;
    }
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('dark');
  }, []);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentNote && content !== currentNote.content) {
        saveNote();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentNote, content, saveNote]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveNote();
      }
      // Ctrl/Cmd + K to open AI
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsAIOpen((prev) => !prev);
        setActivePanel((prev) => (prev === 'ai' ? null : 'ai'));
      }
      // Ctrl/Cmd + , to open settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
        setActivePanel((prev) => (prev === 'settings' ? null : 'settings'));
      }
      // Ctrl/Cmd + E to open filesystem
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setIsFilesystemOpen((prev) => !prev);
        setActivePanel((prev) => (prev === 'filesystem' ? null : 'filesystem'));
      }
      // Slash to open command palette
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setIsCommandOpen(true);
      }
      // Escape to close panels
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
        setIsCommandOpen(false);
        setActivePanel(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveNote]);

  // Handle slash command selection
  const handleCommandSelect = useCallback((value: string) => {
    let insertText = '';
    
    switch (value) {
      case 'h1':
        insertText = '# ';
        break;
      case 'h2':
        insertText = '## ';
        break;
      case 'h3':
        insertText = '### ';
        break;
      case 'h4':
        insertText = '#### ';
        break;
      case 'h5':
        insertText = '##### ';
        break;
      case 'h6':
        insertText = '###### ';
        break;
      case 'bold':
        insertText = '**bold**';
        break;
      case 'italic':
        insertText = '*italic*';
        break;
      case 'quote':
        insertText = '> ';
        break;
      case 'image':
        insertText = '![alt](url)';
        break;
      case 'callout':
        insertText = '> [!NOTE]\n> ';
        break;
      case 'left':
        insertText = '<div style="text-align: left">\n\n</div>';
        break;
      case 'right':
        insertText = '<div style="text-align: right">\n\n</div>';
        break;
    }
    
    if (insertText && editorRef.current) {
      // For TipTap editor
      if (editorRef.current?.insertContent) {
        editorRef.current.insertContent(insertText);
      } else {
        // Fallback for textarea
        setContent((prev) => prev + insertText);
      }
    }
  }, []);

  // Handle right-click or long-press for mobile
  const handleContextMenu = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsCommandOpen(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header - Mobile First */}
      <header className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
        {/* Left - Burger Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              Mistral AI
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile: Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2"
          >
            <Folder className="h-5 w-5" />
          </Button>

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              setActivePanel((prev) => (prev === 'settings' ? null : 'settings'));
            }}
            className="p-2"
          >
            <SettingsIcon className="h-5 w-5" />
          </Button>

          {/* New Note Button */}
          <Button
            variant="ios"
            size="sm"
            onClick={() => createNote(`Untitled ${notes.length + 1}`)}
            className="hidden sm:flex"
          >
            <Plus className="h-4 w-4" />
            <span className="ml-1">New</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Notes List (Mobile: Slide in from left) */}
        <aside
          className={cn(
            "fixed md:relative md:flex z-40 w-64 bg-background/50 border-r border-border/50 flex-col h-full transition-transform duration-300",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="p-4 border-b border-border/50">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Notes
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <File className="h-12 w-12 opacity-50" />
                <p className="mt-2">No notes yet</p>
              </div>
            ) : (
              notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => loadNote(note.id)}
                  className={cn(
                    "w-full p-3 text-left rounded-lg transition-all duration-150",
                    currentNote?.id === note.id
                      ? "bg-white/10 border border-white/20"
                      : "hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{note.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.modifiedAt).toLocaleDateString()}
                  </span>
                </button>
              ))
            )}
          </div>
          <div className="p-2 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => createNote(`Untitled ${notes.length + 1}`)}
              className="w-full justify-start"
            >
              <Plus className="h-4 w-4" />
              <span className="ml-2">New Note</span>
            </Button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div
            className="flex-1 overflow-hidden p-4"
            onContextMenu={handleContextMenu}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const startTime = Date.now();
              const handleTouchEnd = () => {
                if (Date.now() - startTime > 500) {
                  handleContextMenu(e);
                }
                document.removeEventListener('touchend', handleTouchEnd);
              };
              document.addEventListener('touchend', handleTouchEnd);
            }}
          >
            {currentNote ? (
              <Card
                variant="glass"
                className="h-full border-0 bg-transparent"
              >
                <div className="flex items-center justify-between px-4 py-2">
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) =>
                      setCurrentNote((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    className="flex-1 bg-transparent border-none outline-none text-xl font-semibold"
                    placeholder="Untitled Note"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={saveNote}
                      disabled={content === currentNote.content}
                    >
                      Save
                    </Button>
                  </div>
                </div>
                <MarkdownEditor
                  ref={editorRef}
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing... (Type / for commands)"
                />
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <File className="h-16 w-16 opacity-50" />
                <p className="mt-4 text-lg">Select a note or create a new one</p>
                <Button
                  variant="ios"
                  size="sm"
                  onClick={() => createNote('New Note')}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4" />
                  <span className="ml-2">Create Note</span>
                </Button>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="px-4 py-2 bg-background/50 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                {currentNote ? `${currentNote.title} - ${content.length} chars` : 'No note selected'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">/ for commands</span>
              <span className="hidden sm:inline">Ctrl+S: Save</span>
            </div>
          </div>
        </main>

        {/* AI Assistant Panel - Slide from right */}
        <div
          className={cn(
            "fixed top-0 right-0 z-50 h-full w-96 transform transition-transform duration-300",
            activePanel === 'ai' ? "translate-x-0" : "translate-x-full"
          )}
        >
          <AIAssistant
            onClose={() => {
              setIsAIOpen(false);
              setActivePanel(null);
            }}
            className="h-full"
          />
        </div>

        {/* Settings Panel - Slide from right */}
        <div
          className={cn(
            "fixed top-0 right-0 z-50 h-full w-96 transform transition-transform duration-300",
            activePanel === 'settings' ? "translate-x-0" : "translate-x-full"
          )}
        >
          <SettingsPanel
            onClose={() => {
              setIsSettingsOpen(false);
              setActivePanel(null);
            }}
            className="h-full"
          />
        </div>

        {/* File Explorer Panel - Slide from right */}
        <div
          className={cn(
            "fixed top-0 right-0 z-50 h-full w-80 transform transition-transform duration-300",
            activePanel === 'filesystem' ? "translate-x-0" : "translate-x-full"
          )}
        >
          <FileExplorer
            onClose={() => {
              setIsFilesystemOpen(false);
              setActivePanel(null);
            }}
            className="h-full"
          />
        </div>

        {/* Command Dialog - Slide from top */}
        <CommandDialog
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          onSelect={handleCommandSelect}
          items={commandItems}
          placeholder="Type a command..."
        />
      </div>

      {/* Backdrop for panels */}
      {(activePanel || isCommandOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setActivePanel(null);
            setIsCommandOpen(false);
          }}
        />
      )}
    </div>
  );
}
