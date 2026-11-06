// MCP Types
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
  };
}

export interface MCPResource {
  uri: string;
  mimeType: string;
  name?: string;
}

// Editor Types
export interface EditorSettings {
  theme: 'dark' | 'light' | 'system';
  codeTheme: string;
  fontSize: string;
  lineNumbers: boolean;
  wordWrap: boolean;
  autoSave: boolean;
  spellCheck: boolean;
  defaultLanguage: string;
  showToolbar: boolean;
  showLineNumbers: boolean;
  showGutter: boolean;
}

// Note Types
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  modifiedAt: Date | string;
  path?: string;
  tags?: string[];
}

// File System Types
export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileSystemItem[];
  createdAt: Date | string;
  modifiedAt: Date | string;
  size?: number;
  extension?: string;
}

// AI Types
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
  metadata?: {
    model?: string;
    tokens?: number;
    toolCalls?: Array<{
      name: string;
      arguments: Record<string, unknown>;
      result?: unknown;
    }>;
  };
}

// Settings Types
export interface AppSettings {
  editor: EditorSettings;
  ai: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    accentColor: string;
  };
  filesystem: {
    showHiddenFiles: boolean;
    defaultPath: string;
  };
}

// Component Props Types
export interface GlassProps {
  variant?: 'default' | 'glass' | 'ios';
  className?: string;
}

export interface DraggableProps {
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggable?: boolean;
}

export interface DroppableProps {
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
}
