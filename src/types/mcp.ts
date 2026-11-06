/**
 * Model Context Protocol (MCP) Types for Vibe Editor
 * 
 * MCP is a protocol for connecting AI models to tools, resources, and context.
 * This file defines the complete type system for MCP integration in Vibe Editor.
 */

// ============================================================================
// MCP Core Types
// ============================================================================

/**
 * MCP Server capabilities
 */
export interface MCPServerCapabilities {
  /** List of tool names this server provides */
  tools: string[];
  /** List of resource templates this server provides */
  resources: MCPResourceTemplate[];
  /** Supported protocols and versions */
  protocols: string[];
}

/**
 * Resource template for MCP resources
 */
export interface MCPResourceTemplate {
  /** URI template for the resource */
  uriTemplate: string;
  /** MIME type of the resource */
  mimeType: string;
  /** Optional schema for the resource */
  schema?: MCPResourceSchema;
}

/**
 * Schema for MCP resources
 */
export interface MCPResourceSchema {
  /** Schema type */
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  /** Description of the schema */
  description?: string;
  /** Properties for object schemas */
  properties?: Record<string, MCPResourceSchema>;
  /** Required properties */
  required?: string[];
  /** Items for array schemas */
  items?: MCPResourceSchema;
}

// ============================================================================
// MCP Message Types
// ============================================================================

/**
 * Base MCP message
 */
export interface MCPMessage {
  /** Message ID */
  id: string;
  /** Message type */
  type: string;
  /** Timestamp */
  timestamp: string;
}

/**
 * MCP Request message
 */
export interface MCPRequest extends MCPMessage {
  type: 'request';
  /** Method to call */
  method: string;
  /** Request parameters */
  params?: Record<string, unknown>;
}

/**
 * MCP Response message
 */
export interface MCPResponse extends MCPMessage {
  type: 'response';
  /** Request ID this response is for */
  requestId: string;
  /** Response data */
  data?: unknown;
  /** Error information */
  error?: MCPError;
}

/**
 * MCP Notification message
 */
export interface MCPNotification extends MCPMessage {
  type: 'notification';
  /** Notification method */
  method: string;
  /** Notification data */
  params?: Record<string, unknown>;
}

/**
 * MCP Error
 */
export interface MCPError {
  /** Error code */
  code: number;
  /** Error message */
  message: string;
  /** Error details */
  details?: Record<string, unknown>;
}

// ============================================================================
// MCP Tool Types
// ============================================================================

/**
 * MCP Tool definition
 */
export interface MCPTool {
  /** Unique tool name */
  name: string;
  /** Human-readable description */
  description: string;
  /** Input schema for the tool */
  inputSchema: MCPToolInputSchema;
  /** Output schema for the tool */
  outputSchema?: MCPToolOutputSchema;
}

/**
 * Input schema for MCP tools
 */
export interface MCPToolInputSchema {
  /** Schema type */
  type: 'object';
  /** Properties */
  properties: Record<string, MCPPropertySchema>;
  /** Required properties */
  required?: string[];
}

/**
 * Output schema for MCP tools
 */
export interface MCPToolOutputSchema {
  /** Schema type */
  type: 'object';
  /** Properties */
  properties: Record<string, MCPPropertySchema>;
}

/**
 * Property schema for MCP tools
 */
export interface MCPPropertySchema {
  /** Schema type */
  type: string;
  /** Description */
  description?: string;
  /** Default value */
  default?: unknown;
  /** Enum values */
  enum?: unknown[];
}

/**
 * Tool call request
 */
export interface MCPToolCallRequest {
  /** Tool name */
  name: string;
  /** Tool arguments */
  arguments: Record<string, unknown>;
}

/**
 * Tool call result
 */
export interface MCPToolCallResult {
  /** Tool name */
  name: string;
  /** Result content */
  content: unknown[];
  /** Whether the call was successful */
  isError?: boolean;
  /** Error message if any */
  error?: string;
}

// ============================================================================
// MCP Resource Types
// ============================================================================

/**
 * MCP Resource
 */
export interface MCPResource {
  /** Resource URI */
  uri: string;
  /** MIME type */
  mimeType: string;
  /** Resource name */
  name?: string;
  /** Resource description */
  description?: string;
  /** Resource data */
  data?: string | Buffer | Record<string, unknown>;
}

/**
 * Resource read request
 */
export interface MCPResourceReadRequest {
  /** Resource URI */
  uri: string;
}

/**
 * Resource read response
 */
export interface MCPResourceReadResponse {
  /** Resource URI */
  uri: string;
  /** MIME type */
  mimeType: string;
  /** Resource data */
  data: string | Buffer | Record<string, unknown>;
}

/**
 * Resource list request
 */
export interface MCPResourceListRequest {
  /** Optional filter for resource URIs */
  filter?: string;
}

/**
 * Resource list response
 */
export interface MCPResourceListResponse {
  /** List of resources */
  resources: MCPResource[];
}

// ============================================================================
// MCP Client Types
// ============================================================================

/**
 * MCP Client configuration
 */
export interface MCPClientConfig {
  /** Client name */
  name: string;
  /** Client version */
  version: string;
  /** Server URL */
  serverUrl?: string;
  /** Authentication token */
  authToken?: string;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Retry count */
  retries?: number;
}

/**
 * MCP Client connection status
 */
export interface MCPClientStatus {
  /** Whether the client is connected */
  connected: boolean;
  /** Server URL */
  serverUrl?: string;
  /** Available tools */
  tools: MCPTool[];
  /** Available resources */
  resources: MCPResource[];
  /** Connection error if any */
  error?: string;
}

/**
 * MCP Client events
 */
export interface MCPClientEvents {
  /** Fired when connection is established */
  connect: (status: MCPClientStatus) => void;
  /** Fired when connection is lost */
  disconnect: (error?: string) => void;
  /** Fired when tools are updated */
  toolsUpdated: (tools: MCPTool[]) => void;
  /** Fired when resources are updated */
  resourcesUpdated: (resources: MCPResource[]) => void;
  /** Fired when a tool call completes */
  toolCallCompleted: (result: MCPToolCallResult) => void;
}

// ============================================================================
// MCP Server Types
// ============================================================================

/**
 * MCP Server configuration
 */
export interface MCPServerConfig {
  /** Server name */
  name: string;
  /** Server version */
  version: string;
  /** Server description */
  description?: string;
  /** Port to listen on */
  port?: number;
  /** Host to bind to */
  host?: string;
}

/**
 * MCP Server tool handler
 */
export type MCPToolHandler = (
  args: Record<string, unknown>
) => Promise<unknown> | unknown;

/**
 * MCP Server resource handler
 */
export type MCPResourceHandler = (
  uri: string
) => Promise<MCPResource | undefined> | MCPResource | undefined;

/**
 * MCP Server initialization options
 */
export interface MCPServerOptions {
  /** Server configuration */
  config: MCPServerConfig;
  /** Tools to register */
  tools?: MCPTool[];
  /** Tool handlers */
  toolHandlers?: Record<string, MCPToolHandler>;
  /** Resources to register */
  resources?: MCPResource[];
  /** Resource handlers */
  resourceHandlers?: Record<string, MCPResourceHandler>;
}

// ============================================================================
// Vibe Editor MCP Types
// ============================================================================

/**
 * Vibe Editor specific MCP tool names
 */
export type VibeEditorToolName =
  | 'get_editor_content'
  | 'set_editor_content'
  | 'get_selection'
  | 'set_selection'
  | 'insert_text'
  | 'format_text'
  | 'list_notes'
  | 'get_note'
  | 'create_note'
  | 'update_note'
  | 'delete_note'
  | 'search_notes'
  | 'list_files'
  | 'read_file'
  | 'write_file'
  | 'delete_file'
  | 'get_settings'
  | 'set_settings'
  | 'execute_command'
  | 'ai_complete'
  | 'ai_chat'
  | 'ai_analyze';

/**
 * Vibe Editor MCP resource URIs
 */
export type VibeEditorResourceURI =
  | 'vibe://editor/content'
  | 'vibe://editor/selection'
  | 'vibe://editor/cursor'
  | 'vibe://notes/list'
  | 'vibe://notes/{id}'
  | 'vibe://files/{path}'
  | 'vibe://settings'
  | 'vibe://ai/models';

/**
 * Vibe Editor MCP context
 */
export interface VibeEditorMCPContext {
  /** Current editor content */
  editorContent: string;
  /** Current selection */
  selection: string;
  /** Current cursor position */
  cursorPosition: { line: number; column: number };
  /** Current note ID */
  currentNoteId?: string;
  /** Current file path */
  currentFilePath?: string;
  /** User settings */
  settings: VibeEditorSettings;
}

// ============================================================================
// Vibe Editor Application Types
// ============================================================================

/**
 * Vibe Editor settings
 */
export interface VibeEditorSettings {
  /** Editor theme */
  theme: 'dark' | 'light' | 'system';
  /** Code theme for syntax highlighting */
  codeTheme: string;
  /** Font size */
  fontSize: number;
  /** Line numbers */
  lineNumbers: boolean;
  /** Word wrap */
  wordWrap: boolean;
  /** Auto save */
  autoSave: boolean;
  /** Spell check */
  spellCheck: boolean;
  /** Default language */
  defaultLanguage: string;
  /** AI model */
  aiModel: string;
  /** AI temperature */
  aiTemperature: number;
  /** AI max tokens */
  aiMaxTokens: number;
}

/**
 * Vibe Editor note
 */
export interface VibeEditorNote {
  /** Note ID */
  id: string;
  /** Note title */
  title: string;
  /** Note content (markdown) */
  content: string;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last modification timestamp */
  modifiedAt: string | Date;
  /** Note path */
  path?: string;
  /** Tags */
  tags?: string[];
  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Vibe Editor file
 */
export interface VibeEditorFile {
  /** File path */
  path: string;
  /** File name */
  name: string;
  /** File type */
  type: 'file' | 'folder';
  /** File content */
  content?: string;
  /** File size */
  size?: number;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last modification timestamp */
  modifiedAt: string | Date;
  /** Children for folders */
  children?: VibeEditorFile[];
}

/**
 * Vibe Editor command
 */
export interface VibeEditorCommand {
  /** Command name */
  name: string;
  /** Command description */
  description: string;
  /** Command icon */
  icon?: string;
  /** Command shortcut */
  shortcut?: string;
  /** Command action */
  action: 'insert' | 'format' | 'transform' | 'navigate' | 'execute';
  /** Command payload */
  payload?: Record<string, unknown>;
}

/**
 * Vibe Editor AI completion request
 */
export interface VibeEditorAICompletionRequest {
  /** Prompt */
  prompt: string;
  /** Context (editor content) */
  context?: string;
  /** Model to use */
  model?: string;
  /** Temperature */
  temperature?: number;
  /** Max tokens */
  maxTokens?: number;
  /** Stop sequences */
  stop?: string[];
}

/**
 * Vibe Editor AI completion response
 */
export interface VibeEditorAICompletionResponse {
  /** Completion ID */
  id: string;
  /** Completion text */
  text: string;
  /** Model used */
  model: string;
  /** Finish reason */
  finishReason: 'stop' | 'length' | 'error';
  /** Usage information */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Vibe Editor AI chat message
 */
export interface VibeEditorAIChatMessage {
  /** Message ID */
  id: string;
  /** Message role */
  role: 'user' | 'assistant' | 'system';
  /** Message content */
  content: string;
  /** Timestamp */
  timestamp: string | Date;
  /** Metadata */
  metadata?: {
    model?: string;
    tokens?: number;
    toolCalls?: MCPToolCallResult[];
  };
}

/**
 * Vibe Editor AI chat session
 */
export interface VibeEditorAIChatSession {
  /** Session ID */
  id: string;
  /** Session name */
  name?: string;
  /** Messages */
  messages: VibeEditorAIChatMessage[];
  /** Model */
  model: string;
  /** Context (related note/file) */
  context?: {
    type: 'note' | 'file';
    id: string;
  };
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last modification timestamp */
  modifiedAt: string | Date;
}

// ============================================================================
// MCP API Schema for Vibe Editor
// ============================================================================

/**
 * MCP API methods for Vibe Editor
 */
export type VibeEditorMCPMethod =
  // Editor methods
  | 'editor.getContent'
  | 'editor.setContent'
  | 'editor.getSelection'
  | 'editor.setSelection'
  | 'editor.insertText'
  | 'editor.formatText'
  | 'editor.getCursorPosition'
  | 'editor.setCursorPosition'
  
  // Notes methods
  | 'notes.list'
  | 'notes.get'
  | 'notes.create'
  | 'notes.update'
  | 'notes.delete'
  | 'notes.search'
  
  // Files methods
  | 'files.list'
  | 'files.read'
  | 'files.write'
  | 'files.delete'
  | 'files.createFolder'
  
  // AI methods
  | 'ai.complete'
  | 'ai.chat'
  | 'ai.analyze'
  | 'ai.generate'
  
  // Settings methods
  | 'settings.get'
  | 'settings.set'
  | 'settings.reset'
  
  // MCP methods
  | 'mcp.listTools'
  | 'mcp.callTool'
  | 'mcp.listResources'
  | 'mcp.readResource';

/**
 * MCP API request for Vibe Editor
 */
export interface VibeEditorMCPRequest {
  /** Request ID */
  id: string;
  /** Method to call */
  method: VibeEditorMCPMethod;
  /** Request parameters */
  params?: Record<string, unknown>;
  /** Timestamp */
  timestamp: string;
}

/**
 * MCP API response for Vibe Editor
 */
export interface VibeEditorMCPResponse {
  /** Response ID */
  id: string;
  /** Request ID this response is for */
  requestId: string;
  /** Response data */
  data?: unknown;
  /** Error information */
  error?: MCPError;
  /** Timestamp */
  timestamp: string;
}

// ============================================================================
// MCP Application Types
// ============================================================================

/**
 * MCP Application configuration
 */
export interface MCPAppConfig {
  /** Application name */
  name: string;
  /** Application version */
  version: string;
  /** Application description */
  description?: string;
  /** MCP servers to connect to */
  servers?: MCPServerConfig[];
  /** Default settings */
  defaultSettings?: VibeEditorSettings;
}

/**
 * MCP Application state
 */
export interface MCPAppState {
  /** Connected servers */
  servers: Record<string, MCPClientStatus>;
  /** Available tools */
  tools: MCPTool[];
  /** Available resources */
  resources: MCPResource[];
  /** Editor context */
  editorContext: VibeEditorMCPContext;
  /** Notes */
  notes: VibeEditorNote[];
  /** Files */
  files: VibeEditorFile[];
  /** AI chat sessions */
  chatSessions: VibeEditorAIChatSession[];
  /** Settings */
  settings: VibeEditorSettings;
}

/**
 * MCP Application actions
 */
export interface MCPAppActions {
  /** Connect to MCP server */
  connectServer: (config: MCPServerConfig) => Promise<void>;
  /** Disconnect from MCP server */
  disconnectServer: (serverName: string) => Promise<void>;
  /** Call MCP tool */
  callTool: (name: string, args: Record<string, unknown>) => Promise<MCPToolCallResult>;
  /** Read MCP resource */
  readResource: (uri: string) => Promise<MCPResource>;
  /** List MCP resources */
  listResources: () => Promise<MCPResource[]>;
  /** List MCP tools */
  listTools: () => Promise<MCPTool[]>;
  
  // Editor actions
  /** Get editor content */
  getEditorContent: () => Promise<string>;
  /** Set editor content */
  setEditorContent: (content: string) => Promise<void>;
  /** Insert text at cursor */
  insertText: (text: string) => Promise<void>;
  /** Format text */
  formatText: (format: string) => Promise<void>;
  
  // Notes actions
  /** List notes */
  listNotes: () => Promise<VibeEditorNote[]>;
  /** Get note */
  getNote: (id: string) => Promise<VibeEditorNote | undefined>;
  /** Create note */
  createNote: (note: Partial<VibeEditorNote>) => Promise<VibeEditorNote>;
  /** Update note */
  updateNote: (id: string, note: Partial<VibeEditorNote>) => Promise<VibeEditorNote>;
  /** Delete note */
  deleteNote: (id: string) => Promise<void>;
  
  // Files actions
  /** List files */
  listFiles: (path?: string) => Promise<VibeEditorFile[]>;
  /** Read file */
  readFile: (path: string) => Promise<VibeEditorFile | undefined>;
  /** Write file */
  writeFile: (path: string, content: string) => Promise<VibeEditorFile>;
  /** Delete file */
  deleteFile: (path: string) => Promise<void>;
  
  // AI actions
  /** Complete text */
  complete: (request: VibeEditorAICompletionRequest) => Promise<VibeEditorAICompletionResponse>;
  /** Chat with AI */
  chat: (messages: VibeEditorAIChatMessage[]) => Promise<VibeEditorAIChatMessage>;
  /** Analyze content */
  analyze: (content: string, task: string) => Promise<Record<string, unknown>>;
  
  // Settings actions
  /** Get settings */
  getSettings: () => Promise<VibeEditorSettings>;
  /** Set settings */
  setSettings: (settings: Partial<VibeEditorSettings>) => Promise<void>;
  /** Reset settings */
  resetSettings: () => Promise<void>;
}

// ============================================================================
// MCP Server Implementation Types
// ============================================================================

/**
 * Vibe Editor MCP Server
 */
export interface VibeEditorMCPServer {
  /** Server configuration */
  config: MCPServerConfig;
  /** Available tools */
  tools: MCPTool[];
  /** Available resources */
  resources: MCPResource[];
  /** Start the server */
  start: () => Promise<void>;
  /** Stop the server */
  stop: () => Promise<void>;
  /** Register a tool */
  registerTool: (tool: MCPTool, handler: MCPToolHandler) => void;
  /** Register a resource */
  registerResource: (resource: MCPResource, handler: MCPResourceHandler) => void;
  /** Handle incoming requests */
  handleRequest: (request: MCPRequest) => Promise<MCPResponse>;
  /** Handle tool calls */
  handleToolCall: (call: MCPToolCallRequest) => Promise<MCPToolCallResult>;
  /** Handle resource reads */
  handleResourceRead: (request: MCPResourceReadRequest) => Promise<MCPResourceReadResponse>;
}

/**
 * Vibe Editor MCP Client
 */
export interface VibeEditorMCPClient {
  /** Client configuration */
  config: MCPClientConfig;
  /** Connection status */
  status: MCPClientStatus;
  /** Connect to server */
  connect: (url: string, options?: MCPClientConfig) => Promise<void>;
  /** Disconnect from server */
  disconnect: () => Promise<void>;
  /** Call a tool */
  callTool: (name: string, args: Record<string, unknown>) => Promise<MCPToolCallResult>;
  /** Read a resource */
  readResource: (uri: string) => Promise<MCPResource>;
  /** List resources */
  listResources: () => Promise<MCPResource[]>;
  /** List tools */
  listTools: () => Promise<MCPTool[]>;
  /** Send notification */
  sendNotification: (method: string, params?: Record<string, unknown>) => Promise<void>;
  /** Subscribe to events */
  on: <K extends keyof MCPClientEvents>(event: K, listener: MCPClientEvents[K]) => void;
  /** Unsubscribe from events */
  off: <K extends keyof MCPClientEvents>(event: K, listener: MCPClientEvents[K]) => void;
}

// ============================================================================
// Default MCP Tools for Vibe Editor
// ============================================================================

/**
 * Default MCP tools for Vibe Editor
 */
export const VibeEditorMCPTools: MCPTool[] = [
  {
    name: 'get_editor_content',
    description: 'Get the current editor content',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    outputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'The editor content' },
      },
    },
  },
  {
    name: 'set_editor_content',
    description: 'Set the editor content',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'The content to set' },
      },
      required: ['content'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', description: 'Whether the operation was successful' },
      },
    },
  },
  {
    name: 'insert_text',
    description: 'Insert text at the current cursor position',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The text to insert' },
      },
      required: ['text'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', description: 'Whether the operation was successful' },
      },
    },
  },
  {
    name: 'list_notes',
    description: 'List all notes',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of notes to return' },
        offset: { type: 'number', description: 'Offset for pagination' },
      },
      required: [],
    },
    outputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'object' },
          description: 'List of notes',
        },
      },
    },
  },
  {
    name: 'create_note',
    description: 'Create a new note',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Note title' },
        content: { type: 'string', description: 'Note content' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Note tags',
        },
      },
      required: ['title'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        note: { type: 'object', description: 'The created note' },
      },
    },
  },
  {
    name: 'ai_complete',
    description: 'Get AI completion for the given prompt',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The prompt to complete' },
        context: { type: 'string', description: 'Optional context' },
        model: { type: 'string', description: 'Model to use' },
        temperature: { type: 'number', description: 'Sampling temperature' },
        maxTokens: { type: 'number', description: 'Maximum tokens to generate' },
      },
      required: ['prompt'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The completion text' },
        model: { type: 'string', description: 'Model used' },
        finishReason: { type: 'string', description: 'Finish reason' },
      },
    },
  },
  {
    name: 'ai_chat',
    description: 'Chat with AI',
    inputSchema: {
      type: 'object',
      properties: {
        messages: {
          type: 'array',
          items: { type: 'object' },
          description: 'Chat messages',
        },
        model: { type: 'string', description: 'Model to use' },
        temperature: { type: 'number', description: 'Sampling temperature' },
      },
      required: ['messages'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        message: { type: 'object', description: 'The AI response message' },
        model: { type: 'string', description: 'Model used' },
      },
    },
  },
];

// ============================================================================
// MCP Resource Templates for Vibe Editor
// ============================================================================

/**
 * Default MCP resource templates for Vibe Editor
 */
export const VibeEditorMCPResourceTemplates: MCPResourceTemplate[] = [
  {
    uriTemplate: 'vibe://editor/content',
    mimeType: 'text/markdown',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'The editor content' },
        language: { type: 'string', description: 'The content language' },
      },
    },
  },
  {
    uriTemplate: 'vibe://notes/{id}',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Note ID' },
        title: { type: 'string', description: 'Note title' },
        content: { type: 'string', description: 'Note content' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        modifiedAt: { type: 'string', description: 'Last modification timestamp' },
      },
    },
  },
  {
    uriTemplate: 'vibe://files/{path}',
    mimeType: 'text/plain',
    schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'File path' },
        name: { type: 'string', description: 'File name' },
        type: { type: 'string', enum: ['file', 'folder'], description: 'File type' },
        content: { type: 'string', description: 'File content' },
        size: { type: 'number', description: 'File size' },
      },
    },
  },
  {
    uriTemplate: 'vibe://settings',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        theme: { type: 'string', enum: ['dark', 'light', 'system'] },
        codeTheme: { type: 'string' },
        fontSize: { type: 'number' },
        lineNumbers: { type: 'boolean' },
        wordWrap: { type: 'boolean' },
        autoSave: { type: 'boolean' },
        aiModel: { type: 'string' },
      },
    },
  },
];

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a value is an MCPMessage
 */
export function isMCPMessage(value: unknown): value is MCPMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    'timestamp' in value
  );
}

/**
 * Check if a value is an MCPRequest
 */
export function isMCPRequest(value: unknown): value is MCPRequest {
  return isMCPMessage(value) && value.type === 'request' && 'method' in value;
}

/**
 * Check if a value is an MCPResponse
 */
export function isMCPResponse(value: unknown): value is MCPResponse {
  return isMCPMessage(value) && value.type === 'response' && 'requestId' in value;
}

/**
 * Check if a value is an MCPTool
 */
export function isMCPTool(value: unknown): value is MCPTool {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'description' in value &&
    'inputSchema' in value
  );
}

/**
 * Check if a value is an MCPToolCallRequest
 */
export function isMCPToolCallRequest(value: unknown): value is MCPToolCallRequest {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'arguments' in value
  );
}

/**
 * Check if a value is a VibeEditorMCPMethod
 */
export function isVibeEditorMCPMethod(value: unknown): value is VibeEditorMCPMethod {
  return typeof value === 'string' && value.startsWith('editor.') ||
    value.startsWith('notes.') ||
    value.startsWith('files.') ||
    value.startsWith('ai.') ||
    value.startsWith('settings.') ||
    value.startsWith('mcp.');
}
