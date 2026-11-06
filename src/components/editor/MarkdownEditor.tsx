import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Link,
  Image as ImageIcon,
  Code2,
  CheckSquare,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
}

export interface MarkdownEditorHandle {
  insertContent: (content: string) => void;
  focus: () => void;
}

// Custom extensions for markdown support
const MarkdownExtensions = [
  StarterKit,
  TaskList,
  TaskItem,
  Placeholder,
  Image,
];

const MarkdownEditorComponent = (
  { content, onChange, className, placeholder = 'Start writing...' }:
    MarkdownEditorProps,
  ref: React.Ref<MarkdownEditorHandle>
) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      ...MarkdownExtensions,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none outline-none',
      },
    },
  });

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    insertContent: (content: string) => {
      if (editor) {
        editor.chain().focus().insertContent(content).run();
      }
    },
    focus: () => {
      if (editor) {
        editor.chain().focus().run();
      }
    },
  }));

  // Handle drop for images and files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (editor) {
          const url = reader.result as string;
          editor.chain().focus().setImage({ src: url }).run();
        }
      };
      reader.readAsDataURL(file);
    });
    setIsDragActive(false);
  }, [editor]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: true,
  });

  // Insert markdown shortcuts
  const insertMarkdown = useCallback((markdown: string) => {
    if (editor) {
      editor.chain().focus().insertContent(markdown).run();
    }
  }, [editor]);

  // Toggle formatting
  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleHeading = useCallback((level: number) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const setLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const insertImage = useCallback(() => {
    setShowImageUrlInput(true);
  }, []);

  const handleImageUrlSubmit = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageUrlInput(false);
    }
  }, [imageUrl, editor]);

  // Set alignment
  const setAlignment = useCallback((alignment: 'left' | 'center' | 'right') => {
    if (editor) {
      editor.chain().focus().setTextAlign(alignment).run();
    }
  }, [editor]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B for bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleBold();
      }
      // Ctrl/Cmd + I for italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        toggleItalic();
      }
      // Ctrl/Cmd + K for link
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setLink();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleBold, toggleItalic, setLink]);

  // Insert code block with language
  const insertCodeBlock = useCallback((language?: string) => {
    if (editor) {
      const code = language ? `\`\`\`${language}\n\n\`\`\`` : '```\n\n```';
      editor.chain().focus().insertContent(code).run();
    }
  }, [editor]);

  return (
    <Card
      variant="glass"
      className={cn("border-0 bg-transparent", className)}
      {...getRootProps()}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 rounded-t-2xl bg-white/5 backdrop-blur-xl border-b border-white/10">
        {/* Text formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className="h-8 w-8 p-0"
          disabled={!editor?.can().chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className="h-8 w-8 p-0"
          disabled={!editor?.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleStrike}
          className="h-8 w-8 p-0"
          disabled={!editor?.can().chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/20" />

        {/* Headings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(1)}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(2)}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(3)}
          className="h-8 w-8 p-0"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/20" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBulletList}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleOrderedList}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('- [ ] ')}
          className="h-8 w-8 p-0"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/20" />

        {/* Code */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCodeBlock}
          className="h-8 w-8 p-0"
        >
          <Code2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertCodeBlock()}
          className="h-8 w-8 p-0"
        >
          <Type className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/20" />

        {/* Block elements */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBlockquote}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={setLink}
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={insertImage}
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/20" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('left')}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('center')}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAlignment('right')}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Image URL Input */}
      {showImageUrlInput && (
        <div className="flex gap-2 p-2 bg-white/5 border-b border-white/10">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageUrlSubmit}
          >
            Insert
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowImageUrlInput(false);
              setImageUrl('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div
        className={cn(
          "min-h-[300px] p-6 rounded-b-2xl bg-white/5",
          isDragActive && "border-2 border-dashed border-accent"
        )}
      >
        <EditorContent editor={editor} />
        {isDragActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-accent/10 pointer-events-none">
            <p className="text-accent font-medium">Drop images here</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export const MarkdownEditor = forwardRef(MarkdownEditorComponent);
export default MarkdownEditor;
