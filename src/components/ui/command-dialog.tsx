import * as React from "react"
import { Dialog, DialogContent } from "./dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export interface CommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  items: Array<{
    value: string;
    label: string;
    group?: string;
    icon?: React.ReactNode;
  }>;
  placeholder?: string;
}

export function CommandDialog({
  isOpen,
  onClose,
  onSelect,
  items,
  placeholder = "Type a command or search...",
}: CommandDialogProps) {
  const [search, setSearch] = React.useState("");

  const filteredItems = items.filter((item) => 
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.group || "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 overflow-hidden animate-slide-down"
        onInteractOutside={onClose}
      >
        <Command className="bg-background">
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList className="max-h-80">
            {Object.entries(groupedItems).length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {Object.entries(groupedItems).map(([group, items]) => (
              <CommandGroup key={group} heading={group}>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onSelect(item.value);
                      onClose();
                    }}
                    className="cursor-pointer"
                  >
                    {item.icon && <div className="mr-2">{item.icon}</div>}
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
