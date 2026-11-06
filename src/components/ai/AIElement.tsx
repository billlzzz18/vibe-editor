import { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Sparkles, Code2, FileText, Database, Plug, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIElementProps {
  type: 'completion' | 'chat' | 'code' | 'analysis' | 'mcp';
  content?: string;
  onAction?: (action: string) => void;
  className?: string;
}

export function AIElement({ type, content, onAction, className }: AIElementProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'completion':
        return <Sparkles className="h-5 w-5" />;
      case 'chat':
        return <Brain className="h-5 w-5" />;
      case 'code':
        return <Code2 className="h-5 w-5" />;
      case 'analysis':
        return <FileText className="h-5 w-5" />;
      case 'mcp':
        return <Plug className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'completion':
        return 'AI Complete';
      case 'chat':
        return 'AI Chat';
      case 'code':
        return 'AI Code';
      case 'analysis':
        return 'AI Analyze';
      case 'mcp':
        return 'MCP Tool';
      default:
        return 'AI';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'completion':
        return 'Auto-complete text';
      case 'chat':
        return 'Chat with AI';
      case 'code':
        return 'Generate code';
      case 'analysis':
        return 'Analyze content';
      case 'mcp':
        return 'Use MCP tools';
      default:
        return 'AI assistance';
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'completion':
        return 'from-purple-500 to-pink-500';
      case 'chat':
        return 'from-blue-500 to-cyan-500';
      case 'code':
        return 'from-green-500 to-emerald-500';
      case 'analysis':
        return 'from-orange-500 to-amber-500';
      case 'mcp':
        return 'from-indigo-500 to-violet-500';
      default:
        return 'from-slate-500 to-gray-500';
    }
  };

  return (
    <Card
      variant="glass"
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer",
        isHovered && "transform -translate-y-1 shadow-2xl",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onAction?.(type)}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          isHovered && "opacity-10"
        )}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()}`} />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-3 p-6">
        <div
          className={cn(
            "p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 transition-all duration-300",
            isHovered && "scale-110"
          )}
        >
          {getIcon()}
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-white">{getLabel()}</h3>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </div>
        {content && (
          <div className="text-xs text-muted-foreground/70 truncate max-w-full">
            {content}
          </div>
        )}
      </div>

      {/* Hover effect */}
      {isHovered && (
        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl pointer-events-none" />
      )}
    </Card>
  );
}

export default AIElement;
