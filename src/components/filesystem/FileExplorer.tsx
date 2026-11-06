import { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Folder, File, Plus, Search, MoreVertical, Trash2, Edit2, FolderPlus } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileSystemItem[];
  createdAt: Date;
  modifiedAt: Date;
  size?: number;
  extension?: string;
}

interface FileExplorerProps {
  className?: string;
  onSelect?: (item: FileSystemItem) => void;
  onCreate?: (type: 'file' | 'folder', path: string) => void;
  onDelete?: (item: FileSystemItem) => void;
  onRename?: (item: FileSystemItem, newName: string) => void;
}

export function FileExplorer({
  className,
  onSelect,
  onCreate,
  onDelete,
  onRename,
}: FileExplorerProps) {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<FileSystemItem | null>(null);
  const [editName, setEditName] = useState('');

  // Mock data - in a real app, this would come from Supabase or local storage
  useEffect(() => {
    const mockData: FileSystemItem[] = [
      {
        id: '1',
        name: 'Notes',
        type: 'folder',
        path: '/Notes',
        children: [
          {
            id: '2',
            name: 'Getting Started.md',
            type: 'file',
            path: '/Notes/Getting Started.md',
            createdAt: new Date(),
            modifiedAt: new Date(),
            extension: 'md',
          },
          {
            id: '3',
            name: 'API Documentation.md',
            type: 'file',
            path: '/Notes/API Documentation.md',
            createdAt: new Date(),
            modifiedAt: new Date(),
            extension: 'md',
          },
        ],
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
      {
        id: '4',
        name: 'Code',
        type: 'folder',
        path: '/Code',
        children: [
          {
            id: '5',
            name: 'example.ts',
            type: 'file',
            path: '/Code/example.ts',
            createdAt: new Date(),
            modifiedAt: new Date(),
            extension: 'ts',
          },
        ],
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
      {
        id: '6',
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        createdAt: new Date(),
        modifiedAt: new Date(),
        extension: 'md',
      },
    ];
    setItems(mockData);
  }, []);

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  // Select item
  const handleSelect = useCallback((item: FileSystemItem) => {
    setSelectedItem(item);
    onSelect?.(item);
  }, [onSelect]);

  // Create new item
  const handleCreate = useCallback(() => {
    if (!newItemName.trim()) return;
    
    const currentPath = selectedItem?.type === 'folder' ? selectedItem.path : '/';
    const newPath = `${currentPath}/${newItemName}`;
    
    onCreate?.(newItemType, newPath);
    
    // Add to local state
    const newItem: FileSystemItem = {
      id: Date.now().toString(),
      name: newItemName,
      type: newItemType,
      path: newPath,
      createdAt: new Date(),
      modifiedAt: new Date(),
      ...(newItemType === 'file' && {
        extension: newItemName.split('.').pop(),
      }),
    };

    if (selectedItem?.type === 'folder') {
      setItems((prev) => {
        const updateItems = (items: FileSystemItem[]): FileSystemItem[] => {
          return items.map((item) => {
            if (item.id === selectedItem.id) {
              return {
                ...item,
                children: [...(item.children || []), newItem],
                modifiedAt: new Date(),
              };
            }
            if (item.children) {
              return { ...item, children: updateItems(item.children) };
            }
            return item;
          });
        };
        return updateItems(prev);
      });
    } else {
      setItems((prev) => [...prev, newItem]);
    }

    setNewItemName('');
    setIsCreating(false);
  }, [newItemName, newItemType, selectedItem, onCreate]);

  // Delete item
  const handleDelete = useCallback((item: FileSystemItem) => {
    onDelete?.(item);
    
    // Remove from local state
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    }

    setItems((prev) => {
      const removeItem = (items: FileSystemItem[], id: string): FileSystemItem[] => {
        return items.filter((i) => i.id !== id).map((i) => {
          if (i.children) {
            return { ...i, children: removeItem(i.children, id) };
          }
          return i;
        });
      };
      return removeItem(prev, item.id);
    });
  }, [selectedItem, onDelete]);

  // Rename item
  const handleRename = useCallback((item: FileSystemItem, newName: string) => {
    onRename?.(item, newName);
    
    setItems((prev) => {
      const renameItem = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map((i) => {
          if (i.id === item.id) {
            return { ...i, name: newName, path: i.path.replace(item.name, newName) };
          }
          if (i.children) {
            return { ...i, children: renameItem(i.children) };
          }
          return i;
        });
      };
      return renameItem(prev);
    });

    setEditingItem(null);
    setEditName('');
  }, [onRename]);

  // Start creating new item
  const startCreating = useCallback((type: 'file' | 'folder') => {
    setNewItemType(type);
    setNewItemName(type === 'file' ? 'Untitled.md' : 'New Folder');
    setIsCreating(true);
  }, []);

  // Start editing item name
  const startEditing = useCallback((item: FileSystemItem) => {
    setEditingItem(item);
    setEditName(item.name);
  }, []);

  // Render file system item
  const renderItem = useCallback((item: FileSystemItem, depth = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItem?.id === item.id;
    const isFolder = item.type === 'folder';
    const hasChildren = isFolder && item.children && item.children.length > 0;

    // Filter children based on search
    const filteredChildren = hasChildren
      ? item.children?.filter(
          (child) =>
            child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            renderItem(child, depth + 1)
        )
      : [];

    return (
      <div key={item.id} style={{ paddingLeft: `${depth * 16}px` }}>
        <div
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg transition-colors duration-150",
            isSelected
              ? "bg-white/10 border border-white/20"
              : "hover:bg-white/5",
            depth > 0 && "ml-4"
          )}
          onClick={() => handleSelect(item)}
        >
          <button
            className="flex items-center gap-2 flex-1 text-left"
            onClick={(e) => {
              if (isFolder) {
                e.stopPropagation();
                toggleFolder(item.id);
              }
            }}
          >
            {isFolder && hasChildren && (
              <div
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )}
              >
                <Folder className="h-4 w-4" />
              </div>
            )}
            {isFolder && !hasChildren && (
              <Folder className="h-4 w-4 opacity-50" />
            )}
            {!isFolder && (
              <File className="h-4 w-4" />
            )}
            
            {editingItem?.id === item.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename(item, editName);
                  }
                  if (e.key === 'Escape') {
                    setEditingItem(null);
                    setEditName('');
                  }
                }}
                className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
                autoFocus
              />
            ) : (
              <span className="flex-1 truncate">{item.name}</span>
            )}
          </button>

          {isSelected && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(item);
                }}
                className="h-6 w-6 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {isFolder && isExpanded && filteredChildren && filteredChildren.length > 0 && (
          <div className="mt-1">
            {filteredChildren.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }, [expandedFolders, selectedItem, searchQuery, editingItem, editName, handleSelect, toggleFolder, startEditing, handleDelete, handleRename]);

  // Filter items based on search
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.type === 'folder' && item.children?.some((child) =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
  );

  return (
    <Card
      variant="glass"
      className={cn("flex flex-col h-full", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-accent" />
          <span className="font-semibold">File Explorer</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Create New */}
      <div className="flex gap-2 p-2 border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startCreating('file')}
          className="flex-1 flex items-center justify-center gap-1"
        >
          <File className="h-4 w-4" />
          <span>New File</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startCreating('folder')}
          className="flex-1 flex items-center justify-center gap-1"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Folder</span>
        </Button>
      </div>

      {/* Create Input */}
      {isCreating && (
        <div className="flex gap-2 p-2 bg-white/5 border-b border-white/10">
          <Input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreate();
              }
              if (e.key === 'Escape') {
                setIsCreating(false);
                setNewItemName('');
              }
            }}
            className="flex-1"
            placeholder={newItemType === 'file' ? 'File name...' : 'Folder name...'}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreate}
            disabled={!newItemName.trim()}
          >
            Create
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsCreating(false);
              setNewItemName('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Folder className="h-12 w-12 opacity-50" />
            <p className="mt-2">No files found</p>
          </div>
        ) : (
          filteredItems.map((item) => renderItem(item))
        )}
      </div>

      {/* Selected Item Info */}
      {selectedItem && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            {selectedItem.type === 'folder' ? (
              <Folder className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span className="truncate flex-1">{selectedItem.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(selectedItem.modifiedAt)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

export default FileExplorer;
