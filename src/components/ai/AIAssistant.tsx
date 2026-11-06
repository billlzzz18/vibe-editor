import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Send, Bot, User, Settings, Plug, FileText, Code2 } from 'lucide-react';
import { cn, formatDateTime } from '@/lib/utils';
import { mcpClient } from '@/lib/mcp/client';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
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

interface AIAssistantProps {
  className?: string;
  onClose?: () => void;
}

export function AIAssistant({ className, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you with your notes today?',
      timestamp: new Date(),
      metadata: { model: 'mistral-small-latest' },
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [availableTools, setAvailableTools] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [mcpServerUrl, setMcpServerUrl] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to MCP server
  const connectMcp = useCallback(async () => {
    if (!mcpServerUrl) return;
    setIsLoading(true);
    try {
      const connected = await mcpClient.connect(mcpServerUrl);
      setIsConnected(connected);
      if (connected) {
        setAvailableTools(mcpClient.getTools());
      }
    } catch (error) {
      console.error('MCP connection error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [mcpServerUrl]);

  // Disconnect from MCP server
  const disconnectMcp = useCallback(() => {
    mcpClient.disconnect();
    setIsConnected(false);
    setAvailableTools([]);
  }, []);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // If MCP is connected and a tool is selected, call the tool
      if (isConnected && selectedTool) {
        const tool = availableTools.find((t) => t.name === selectedTool);
        if (tool) {
          const result = await mcpClient.callTool(selectedTool, { input });
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Tool **${selectedTool}** executed:\n\n${JSON.stringify(result, null, 2)}`,
            timestamp: new Date(),
            metadata: {
              model: 'mistral-small-latest',
              toolCalls: [
                {
                  name: selectedTool,
                  arguments: { input },
                  result,
                },
              ],
            },
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } else {
        // Regular chat with Mistral
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!response.ok) throw new Error('Failed to get response');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            assistantContent += text;
            
            // Update messages in real-time
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastIndex = newMessages.length - 1;
              if (newMessages[lastIndex]?.role === 'user') {
                newMessages.push({
                  id: (Date.now() + 1).toString(),
                  role: 'assistant',
                  content: assistantContent,
                  timestamp: new Date(),
                  metadata: { model: 'mistral-small-latest' },
                });
              } else if (newMessages[lastIndex]?.role === 'assistant') {
                newMessages[lastIndex] = {
                  ...newMessages[lastIndex],
                  content: assistantContent,
                };
              }
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setSelectedTool(null);
    }
  }, [input, isLoading, isConnected, selectedTool, availableTools, messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle keyboard submit
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  return (
    <Card
      variant="glass"
      className={cn("flex flex-col h-full max-w-2xl w-full", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          <span className="font-semibold">AI Assistant</span>
          {isConnected && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              MCP Connected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* MCP Connection Bar */}
      {isConnected && availableTools.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-white/5 border-b border-white/10">
          <Plug className="h-4 w-4 text-accent" />
          <select
            value={selectedTool || ''}
            onChange={(e) => setSelectedTool(e.target.value || null)}
            className="flex-1 px-2 py-1 bg-white/5 border border-white/20 rounded text-sm"
          >
            <option value="">Chat with Mistral...</option>
            {availableTools.map((tool) => (
              <option key={tool.name} value={tool.name}>
                {tool.name} - {tool.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-1 max-w-[80%]",
                message.role === 'user' && "items-end"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-2xl",
                  message.role === 'user'
                    ? "bg-accent text-white rounded-br-none"
                    : "bg-white/5 text-text-primary rounded-bl-none border border-white/10"
                )}
              >
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="bg-white/5 p-4 rounded-2xl rounded-bl-none border border-white/10">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <div className="space-y-1">
                  <div className="h-2 w-20 bg-white/20 rounded animate-pulse" />
                  <div className="h-2 w-16 bg-white/20 rounded animate-pulse" />
                  <div className="h-2 w-24 bg-white/20 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* MCP Connection Settings */}
      {!isConnected && (
        <div className="flex gap-2 p-2 bg-white/5 border-t border-white/10">
          <Input
            type="text"
            placeholder="MCP Server URL (e.g., ws://localhost:3000)"
            value={mcpServerUrl}
            onChange={(e) => setMcpServerUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={connectMcp}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect MCP'}
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 p-4 border-t border-white/10">
        <Input
          type="text"
          placeholder={isConnected && selectedTool ? `Call ${selectedTool}...` : "Ask Mistral..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          variant="ios"
          size="sm"
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default AIAssistant;
