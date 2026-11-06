import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// MCP Client for connecting to various AI services
export class MCPClient {
  private client: Client;
  private tools: any[] = [];

  constructor() {
    this.client = new Client({
      name: 'mistral-ai-editor',
      version: '1.0.0',
    });
  }

  // Connect to a server
  async connect(serverUrl: string) {
    try {
      await this.client.connect(serverUrl);
      await this.loadTools();
      return true;
    } catch (error) {
      console.error('MCP connection error:', error);
      return false;
    }
  }

  // Disconnect from server
  async disconnect() {
    await this.client.close();
    this.tools = [];
  }

  // Load available tools
  private async loadTools() {
    try {
      const response = await this.client.sendRequest(ListToolsRequestSchema, {});
      this.tools = response.tools || [];
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  }

  // Get available tools
  getTools() {
    return this.tools;
  }

  // Call a tool
  async callTool(toolName: string, arguments_: Record<string, unknown>) {
    try {
      const response = await this.client.sendRequest(CallToolRequestSchema, {
        name: toolName,
        arguments: arguments_,
      });
      return response;
    } catch (error) {
      console.error('Error calling tool:', error);
      throw error;
    }
  }

  // Get resources
  async listResources() {
    try {
      const resources = await this.client.listResources();
      return resources;
    } catch (error) {
      console.error('Error listing resources:', error);
      return [];
    }
  }

  // Read a resource
  async readResource(uri: string) {
    try {
      const resource = await this.client.readResource(uri);
      return resource;
    } catch (error) {
      console.error('Error reading resource:', error);
      return null;
    }
  }

  // Check if connected
  isConnected() {
    return this.client.isConnected();
  }
}

// Singleton instance
export const mcpClient = new MCPClient();
