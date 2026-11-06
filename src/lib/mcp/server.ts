import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// MCP Server implementation
export class MCPServer {
  private server: Server;
  private transport: StdioServerTransport;

  constructor() {
    this.server = new Server(
      {
        name: 'mistral-ai-editor-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    // Register default tools
    this.registerDefaultTools();

    // Set up transport
    this.transport = new StdioServerTransport();
    this.server.connect(this.transport);
  }

  // Register default tools
  private registerDefaultTools() {
    // Tool to get editor content
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_editor_content',
            description: 'Get the current editor content',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'set_editor_content',
            description: 'Set the editor content',
            inputSchema: {
              type: 'object',
              properties: {
                content: { type: 'string' },
              },
            },
          },
          {
            name: 'list_notes',
            description: 'List all notes',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'create_note',
            description: 'Create a new note',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
              },
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'get_editor_content':
          return { content: [] }; // Will be populated by app
        case 'set_editor_content':
          return { content: [] };
        case 'list_notes':
          return { content: [] };
        case 'create_note':
          return { content: [] };
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  // Add custom tool
  addTool(name: string, description: string, handler: (args: any) => Promise<any>) {
    this.server.addTool({
      name,
      description,
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler,
    });
  }

  // Start the server
  async start() {
    console.log('MCP Server started');
    await this.transport.start();
  }

  // Stop the server
  async stop() {
    await this.transport.stop();
    console.log('MCP Server stopped');
  }
}

// Singleton instance
export const mcpServer = new MCPServer();
