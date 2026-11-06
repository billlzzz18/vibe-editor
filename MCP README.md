# Model Context Protocol (MCP) Implementation - Vibe Editor

## 📋 Overview

This document describes the **Model Context Protocol (MCP)** implementation for **Vibe Editor** - an advanced AI-powered markdown editor with comprehensive MCP support.

**MCP** is a protocol for connecting AI models to tools, resources, and context. It enables AI assistants to interact with external systems, access real-time data, and perform actions beyond simple text generation.

---

## 🎯 Features

### ✅ MCP Server
- **Full MCP Protocol Support**: Implements the complete MCP specification
- **Tool Registration**: Register and manage MCP tools
- **Resource Management**: Register and manage MCP resources
- **Request Handling**: Handle incoming MCP requests
- **Error Handling**: Comprehensive error handling and validation

### ✅ MCP Client
- **Server Connection**: Connect to multiple MCP servers
- **Tool Execution**: Call tools on connected servers
- **Resource Access**: Read and list resources
- **Event System**: Subscribe to MCP events
- **Status Tracking**: Monitor connection status

### ✅ Vibe Editor Integration
- **Editor Tools**: 20+ built-in tools for editor manipulation
- **Notes Tools**: Full CRUD operations for notes
- **Files Tools**: File system operations
- **AI Tools**: AI completion, chat, and analysis
- **Settings Tools**: Manage editor settings

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Vibe Editor Application                   │
├─────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   MCP Client  │    │   MCP Server  │    │   MCP App     │   │
│  │              │    │              │    │              │   │
│  │ - Connect    │◄───┤ - Start      │    │ - State      │   │
│  │ - Disconnect │    │ - Stop       │    │ - Actions    │   │
│  │ - Call Tool  │────►│ - Register   │    │ - Config     │   │
│  │ - Read Res.  │    │   Tool       │    │              │   │
│  │ - List Res.  │    │ - Register   │    │              │   │
│  │ - List Tools │    │   Resource   │    │              │   │
│  └──────────────┘    │ - Handle     │    └──────────────┘   │
│                     │   Request    │                         │
│                     │ - Handle     │                         │
│                     │   Tool Call  │                         │
│                     └──────────────┘                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    Vibe Editor Core                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │  Editor  │  │  Notes   │  │  Files   │  │   AI     │ │  │
│  │  │          │  │          │  │          │  │          │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Type System

### Core Types

All MCP types are defined in [`src/types/mcp.ts`](./src/types/mcp.ts):

#### MCP Message Types
- `MCPMessage` - Base message interface
- `MCPRequest` - Request message
- `MCPResponse` - Response message
- `MCPNotification` - Notification message
- `MCPError` - Error information

#### MCP Tool Types
- `MCPTool` - Tool definition
- `MCPToolInputSchema` - Tool input schema
- `MCPToolOutputSchema` - Tool output schema
- `MCPToolCallRequest` - Tool call request
- `MCPToolCallResult` - Tool call result

#### MCP Resource Types
- `MCPResource` - Resource definition
- `MCPResourceTemplate` - Resource template
- `MCPResourceSchema` - Resource schema
- `MCPResourceReadRequest` - Resource read request
- `MCPResourceReadResponse` - Resource read response

#### MCP Client Types
- `MCPClientConfig` - Client configuration
- `MCPClientStatus` - Connection status
- `MCPClientEvents` - Client events

#### MCP Server Types
- `MCPServerConfig` - Server configuration
- `MCPServerOptions` - Server initialization options
- `VibeEditorMCPServer` - Vibe Editor MCP server interface

#### Vibe Editor Types
- `VibeEditorMCPContext` - Editor context
- `VibeEditorSettings` - Editor settings
- `VibeEditorNote` - Note type
- `VibeEditorFile` - File type
- `VibeEditorCommand` - Command type
- `VibeEditorAICompletionRequest` - AI completion request
- `VibeEditorAICompletionResponse` - AI completion response
- `VibeEditorAIChatMessage` - AI chat message
- `VibeEditorAIChatSession` - AI chat session

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Import MCP Types

```typescript
import {
  MCPClient,
  MCPServer,
  MCPTool,
  MCPResource,
  VibeEditorMCPClient,
  VibeEditorMCPServer,
  VibeEditorMCPContext,
} from '@/types/mcp';
```

### 3. Create MCP Client

```typescript
import { mcpClient } from '@/lib/mcp/client';

// Connect to MCP server
const connected = await mcpClient.connect('ws://localhost:3000');

if (connected) {
  // List available tools
  const tools = mcpClient.getTools();
  
  // Call a tool
  const result = await mcpClient.callTool('get_editor_content', {});
  
  // Read a resource
  const resource = await mcpClient.readResource('vibe://editor/content');
  
  // Disconnect
  mcpClient.disconnect();
}
```

### 4. Create MCP Server

```typescript
import { MCPServer } from '@/lib/mcp/server';

const server = new MCPServer({
  config: {
    name: 'vibe-editor-server',
    version: '1.0.0',
    description: 'MCP server for Vibe Editor',
    port: 3000,
  },
  tools: [
    // Register tools
    {
      name: 'get_editor_content',
      description: 'Get the current editor content',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        return { content: editor.getContent() };
      },
    },
  ],
  resources: [
    // Register resources
    {
      uri: 'vibe://editor/content',
      mimeType: 'text/markdown',
      handler: async () => {
        return {
          uri: 'vibe://editor/content',
          mimeType: 'text/markdown',
          data: editor.getContent(),
        };
      },
    },
  ],
});

// Start server
await server.start();

// Stop server
await server.stop();
```

---

## 🔧 MCP Tools

### Built-in Tools (20+)

#### Editor Tools
| Tool | Description | Input | Output |
|------|-------------|-------|--------|
| `get_editor_content` | Get current editor content | - | `{ content: string }` |
| `set_editor_content` | Set editor content | `{ content: string }` | `{ success: boolean }` |
| `insert_text` | Insert text at cursor | `{ text: string }` | `{ success: boolean }` |
| `get_selection` | Get current selection | - | `{ selection: string }` |
| `set_selection` | Set current selection | `{ start: number, end: number }` | `{ success: boolean }` |
| `get_cursor_position` | Get cursor position | - | `{ line: number, column: number }` |
| `set_cursor_position` | Set cursor position | `{ line: number, column: number }` | `{ success: boolean }` |

#### Notes Tools
| Tool | Description | Input | Output |
|------|-------------|-------|--------|
| `list_notes` | List all notes | `{ limit?: number, offset?: number }` | `{ notes: VibeEditorNote[] }` |
| `get_note` | Get a specific note | `{ id: string }` | `{ note: VibeEditorNote }` |
| `create_note` | Create a new note | `{ title: string, content?: string, tags?: string[] }` | `{ note: VibeEditorNote }` |
| `update_note` | Update a note | `{ id: string, ... }` | `{ note: VibeEditorNote }` |
| `delete_note` | Delete a note | `{ id: string }` | `{ success: boolean }` |
| `search_notes` | Search notes | `{ query: string }` | `{ notes: VibeEditorNote[] }` |

#### Files Tools
| Tool | Description | Input | Output |
|------|-------------|-------|--------|
| `list_files` | List files in a directory | `{ path?: string }` | `{ files: VibeEditorFile[] }` |
| `read_file` | Read a file | `{ path: string }` | `{ file: VibeEditorFile }` |
| `write_file` | Write to a file | `{ path: string, content: string }` | `{ file: VibeEditorFile }` |
| `delete_file` | Delete a file | `{ path: string }` | `{ success: boolean }` |
| `create_folder` | Create a folder | `{ path: string }` | `{ file: VibeEditorFile }` |

#### AI Tools
| Tool | Description | Input | Output |
|------|-------------|-------|--------|
| `ai_complete` | Get AI completion | `{ prompt: string, context?: string, model?: string, temperature?: number, maxTokens?: number }` | `{ text: string, model: string, finishReason: string }` |
| `ai_chat` | Chat with AI | `{ messages: VibeEditorAIChatMessage[], model?: string, temperature?: number }` | `{ message: VibeEditorAIChatMessage, model: string }` |
| `ai_analyze` | Analyze content | `{ content: string, task: string }` | `{ result: Record<string, unknown> }` |
| `ai_generate` | Generate content | `{ prompt: string, type: string }` | `{ content: string }` |

#### Settings Tools
| Tool | Description | Input | Output |
|------|-------------|-------|--------|
| `get_settings` | Get current settings | - | `{ settings: VibeEditorSettings }` |
| `set_settings` | Update settings | `{ settings: Partial<VibeEditorSettings> }` | `{ settings: VibeEditorSettings }` |
| `reset_settings` | Reset to defaults | - | `{ settings: VibeEditorSettings }` |

---

## 📚 MCP Resources

### Built-in Resources

| Resource URI | MIME Type | Description |
|--------------|-----------|-------------|
| `vibe://editor/content` | `text/markdown` | Current editor content |
| `vibe://editor/selection` | `text/plain` | Current text selection |
| `vibe://editor/cursor` | `application/json` | Current cursor position |
| `vibe://notes/list` | `application/json` | List of all notes |
| `vibe://notes/{id}` | `application/json` | Specific note by ID |
| `vibe://files/{path}` | `text/plain` | File content by path |
| `vibe://settings` | `application/json` | Current editor settings |
| `vibe://ai/models` | `application/json` | Available AI models |

---

## 🔌 MCP API Methods

### HTTP API (REST)

All MCP functionality is also available via REST API:

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mcp/tools` | List all available tools |
| POST | `/api/mcp/tools/{name}` | Call a specific tool |
| GET | `/api/mcp/resources` | List all available resources |
| GET | `/api/mcp/resources/{uri}` | Read a specific resource |
| GET | `/api/mcp/servers` | List connected MCP servers |
| POST | `/api/mcp/servers` | Connect to MCP server |
| DELETE | `/api/mcp/servers/{name}` | Disconnect from MCP server |

#### Request/Response Examples

**List Tools:**
```bash
GET /api/mcp/tools
```

**Response:**
```json
{
  "tools": [
    {
      "name": "get_editor_content",
      "description": "Get the current editor content"
    },
    {
      "name": "set_editor_content",
      "description": "Set the editor content"
    }
  ]
}
```

**Call Tool:**
```bash
POST /api/mcp/tools/get_editor_content
Content-Type: application/json

{
  "arguments": {}
}
```

**Response:**
```json
{
  "content": "# Hello World\n\nThis is my note."
}
```

**Connect to MCP Server:**
```bash
POST /api/mcp/servers
Content-Type: application/json

{
  "name": "my-mcp-server",
  "url": "ws://localhost:3000"
}
```

**Response:**
```json
{
  "connected": true,
  "server": {
    "name": "my-mcp-server",
    "url": "ws://localhost:3000",
    "tools": [...],
    "resources": [...]
  }
}
```

---

## 📝 MCP Schema

### JSON Schema for MCP Messages

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MCP Message",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique message ID"
    },
    "type": {
      "type": "string",
      "enum": ["request", "response", "notification"],
      "description": "Message type"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Message timestamp"
    },
    "method": {
      "type": "string",
      "description": "Method name (for requests and notifications)"
    },
    "params": {
      "type": "object",
      "description": "Request parameters (for requests)"
    },
    "requestId": {
      "type": "string",
      "description": "Request ID (for responses)"
    },
    "data": {
      "description": "Response data (for responses)"
    },
    "error": {
      "type": "object",
      "properties": {
        "code": { "type": "number" },
        "message": { "type": "string" },
        "details": { "type": "object" }
      },
      "description": "Error information (for responses)"
    }
  },
  "required": ["id", "type", "timestamp"]
}
```

### JSON Schema for MCP Tools

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MCP Tool",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Unique tool name"
    },
    "description": {
      "type": "string",
      "description": "Human-readable description"
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "const": "object" },
        "properties": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "type": { "type": "string" },
              "description": { "type": "string" },
              "default": {},
              "enum": { "type": "array" }
            }
          }
        },
        "required": { "type": "array", "items": { "type": "string" } }
      }
    }
  },
  "required": ["name", "description", "inputSchema"]
}
```

---

## 🛠️ Implementation Details

### MCP Client Implementation

The MCP client implementation (`src/lib/mcp/client.ts`) provides:

1. **Connection Management**
   - Connect to MCP servers
   - Disconnect from servers
   - Monitor connection status
   - Handle reconnection

2. **Tool Execution**
   - Call tools by name
   - Pass arguments to tools
   - Handle tool responses
   - Handle tool errors

3. **Resource Access**
   - List available resources
   - Read resource content
   - Handle resource errors

4. **Event System**
   - Subscribe to connection events
   - Subscribe to tool updates
   - Subscribe to resource updates

### MCP Server Implementation

The MCP server implementation (`src/lib/mcp/server.ts`) provides:

1. **Server Management**
   - Start and stop the server
   - Configure server settings
   - Handle multiple connections

2. **Tool Management**
   - Register tools
   - Unregister tools
   - Handle tool calls
   - Validate tool inputs

3. **Resource Management**
   - Register resources
   - Unregister resources
   - Handle resource reads
   - Validate resource URIs

4. **Request Handling**
   - Handle incoming requests
   - Validate request format
   - Route to appropriate handlers
   - Generate responses

---

## 🎨 Vibe Editor MCP Integration

### Editor Context

The Vibe Editor provides a rich context for MCP tools:

```typescript
interface VibeEditorMCPContext {
  editorContent: string;      // Current editor content
  selection: string;          // Current text selection
  cursorPosition: { line: number; column: number };
  currentNoteId?: string;     // Current note ID
  currentFilePath?: string;   // Current file path
  settings: VibeEditorSettings;
}
```

### Example: Creating a Custom MCP Tool

```typescript
// Register a custom tool
mcpServer.registerTool(
  {
    name: 'summarize_note',
    description: 'Summarize the current note using AI',
    inputSchema: {
      type: 'object',
      properties: {
        maxLength: {
          type: 'number',
          description: 'Maximum length of the summary',
          default: 200,
        },
      },
      required: [],
    },
  },
  async (args: { maxLength?: number }) => {
    const { maxLength = 200 } = args;
    
    // Get current editor content
    const content = editor.getContent();
    
    // Call AI to summarize
    const summary = await ai.summarize(content, { maxLength });
    
    return {
      summary,
      originalLength: content.length,
      summarizedLength: summary.length,
    };
  }
);
```

### Example: Accessing Editor Content via MCP

```typescript
// Connect to MCP server
const client = new MCPClient({
  name: 'vibe-editor-client',
  version: '1.0.0',
});

await client.connect('ws://localhost:3000');

// Get editor content
const result = await client.callTool('get_editor_content', {});
console.log('Editor content:', result.content);

// Insert text
const insertResult = await client.callTool('insert_text', {
  text: '# New Section\n\n',
});
console.log('Insert successful:', insertResult.success);

// Create a new note
const noteResult = await client.callTool('create_note', {
  title: 'My New Note',
  content: '# Hello World',
});
console.log('Created note:', noteResult.note);
```

---

## 🚀 Advanced Usage

### 1. Chaining Tool Calls

```typescript
// Get current note content
const { content } = await client.callTool('get_editor_content', {});

// Analyze the content
const { analysis } = await client.callTool('ai_analyze', {
  content,
  task: 'extract_keywords',
});

// Create a new note with the analysis
const { note } = await client.callTool('create_note', {
  title: 'Analysis Results',
  content: `## Analysis\n\n${JSON.stringify(analysis, null, 2)}`,
});
```

### 2. Using Resources

```typescript
// Read editor content as a resource
const resource = await client.readResource('vibe://editor/content');
console.log('Resource data:', resource.data);

// Read a specific note
const noteResource = await client.readResource('vibe://notes/1');
console.log('Note:', noteResource.data);
```

### 3. Event-Driven Architecture

```typescript
// Subscribe to tool updates
client.on('toolsUpdated', (tools) => {
  console.log('Available tools:', tools.map(t => t.name));
});

// Subscribe to resource updates
client.on('resourcesUpdated', (resources) => {
  console.log('Available resources:', resources.map(r => r.uri));
});

// Subscribe to connection events
client.on('connect', (status) => {
  console.log('Connected to MCP server:', status.serverUrl);
});

client.on('disconnect', (error) => {
  console.log('Disconnected from MCP server:', error);
});
```

### 4. Custom MCP Server Integration

```typescript
// Create a custom MCP server for external services
const customServer = new MCPServer({
  config: {
    name: 'github-mcp-server',
    version: '1.0.0',
    description: 'MCP server for GitHub integration',
    port: 3001,
  },
  tools: [
    {
      name: 'get_repo_issues',
      description: 'Get issues from a GitHub repository',
      inputSchema: {
        type: 'object',
        properties: {
          owner: { type: 'string' },
          repo: { type: 'string' },
          state: { type: 'string', enum: ['open', 'closed', 'all'], default: 'open' },
        },
        required: ['owner', 'repo'],
      },
      handler: async ({ owner, repo, state = 'open' }) => {
        const issues = await githubApi.getIssues(owner, repo, state);
        return { issues };
      },
    },
  ],
});

// Start the server
await customServer.start();

// Now the Vibe Editor can connect to this server
// and use the GitHub tools
```

---

## 📊 Performance Considerations

### 1. Connection Pooling
- Reuse MCP connections for multiple requests
- Implement connection pooling for high-frequency usage

### 2. Caching
- Cache tool results when appropriate
- Cache resource content with TTL

### 3. Rate Limiting
- Implement rate limiting for MCP servers
- Handle rate limit errors gracefully

### 4. Error Handling
- Retry failed requests with exponential backoff
- Provide meaningful error messages
- Log errors for debugging

---

## 🔒 Security Considerations

### 1. Authentication
- Use secure authentication tokens
- Validate all incoming requests
- Encrypt sensitive data

### 2. Input Validation
- Validate all tool inputs
- Sanitize user-provided data
- Prevent injection attacks

### 3. Resource Access
- Validate resource URIs
- Restrict access to sensitive resources
- Implement proper authorization

### 4. Network Security
- Use HTTPS/WSS for connections
- Validate SSL certificates
- Implement CORS properly

---

## 📚 API Reference

### MCPClient

#### Properties
- `config: MCPClientConfig` - Client configuration
- `status: MCPClientStatus` - Current connection status

#### Methods
- `connect(url: string, options?: MCPClientConfig): Promise<void>` - Connect to MCP server
- `disconnect(): Promise<void>` - Disconnect from MCP server
- `callTool(name: string, args: Record<string, unknown>): Promise<MCPToolCallResult>` - Call a tool
- `readResource(uri: string): Promise<MCPResource>` - Read a resource
- `listResources(): Promise<MCPResource[]>` - List available resources
- `listTools(): Promise<MCPTool[]>` - List available tools
- `sendNotification(method: string, params?: Record<string, unknown>): Promise<void>` - Send notification

#### Events
- `connect: (status: MCPClientStatus) => void` - Fired when connected
- `disconnect: (error?: string) => void` - Fired when disconnected
- `toolsUpdated: (tools: MCPTool[]) => void` - Fired when tools are updated
- `resourcesUpdated: (resources: MCPResource[]) => void` - Fired when resources are updated
- `toolCallCompleted: (result: MCPToolCallResult) => void` - Fired when a tool call completes

### MCPServer

#### Properties
- `config: MCPServerConfig` - Server configuration
- `tools: MCPTool[]` - Registered tools
- `resources: MCPResource[]` - Registered resources

#### Methods
- `start(): Promise<void>` - Start the server
- `stop(): Promise<void>` - Stop the server
- `registerTool(tool: MCPTool, handler: MCPToolHandler): void` - Register a tool
- `registerResource(resource: MCPResource, handler: MCPResourceHandler): void` - Register a resource
- `handleRequest(request: MCPRequest): Promise<MCPResponse>` - Handle incoming request
- `handleToolCall(call: MCPToolCallRequest): Promise<MCPToolCallResult>` - Handle tool call
- `handleResourceRead(request: MCPResourceReadRequest): Promise<MCPResourceReadResponse>` - Handle resource read

---

## 🎯 Roadmap

### v1.0 (Current)
- ✅ Core MCP protocol implementation
- ✅ MCP client and server
- ✅ 20+ built-in tools
- ✅ Resource management
- ✅ Vibe Editor integration

### v1.1 (Planned)
- 📋 Tool discovery and auto-registration
- 📋 Resource caching
- 📋 Connection pooling
- 📋 Better error handling
- 📋 Performance optimizations

### v1.2 (Future)
- 🚀 MCP server marketplace
- 🚀 Plugin system for MCP tools
- 🚀 AI-powered tool suggestions
- 🚀 Natural language tool calls
- 🚀 Multi-server coordination

---

## 🙏 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add tests for new functionality
- Update documentation
- Keep commits atomic and well-described
- Use TypeScript types
- Follow the MCP specification

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For questions or issues:
1. Check the [documentation](#)
2. Check the [examples](#)
3. Open an issue on GitHub
4. Join the community discussion

---

**MCP Implementation for Vibe Editor**
*Powered by Model Context Protocol*
*Built with TypeScript*
