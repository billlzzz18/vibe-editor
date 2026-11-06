import { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Switch } from '@radix-ui/react-switch';
import { Settings, Palette, Code2, Sun, Moon, Monitor, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  className?: string;
  onClose?: () => void;
}

// Code themes
const codeThemes = [
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'github-light', label: 'GitHub Light' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'solarized-dark', label: 'Solarized Dark' },
  { value: 'solarized-light', label: 'Solarized Light' },
  { value: 'vs-dark', label: 'VS Dark' },
  { value: 'vs-light', label: 'VS Light' },
];

// Syntax languages
const languages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
];

// Editor themes
const editorThemes = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

export function SettingsPanel({ className, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    theme: 'system',
    codeTheme: 'github-dark',
    fontSize: '14',
    lineNumbers: true,
    wordWrap: true,
    autoSave: true,
    spellCheck: true,
    defaultLanguage: 'markdown',
    showToolbar: true,
    showLineNumbers: true,
    showGutter: true,
  });

  const handleSettingChange = useCallback((key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    // Here you would typically save to localStorage or context
    localStorage.setItem('editor-settings', JSON.stringify({ ...settings, [key]: value }));
  }, [settings]);

  const handleReset = useCallback(() => {
    setSettings({
      theme: 'system',
      codeTheme: 'github-dark',
      fontSize: '14',
      lineNumbers: true,
      wordWrap: true,
      autoSave: true,
      spellCheck: true,
      defaultLanguage: 'markdown',
      showToolbar: true,
      showLineNumbers: true,
      showGutter: true,
    });
    localStorage.removeItem('editor-settings');
  }, []);

  return (
    <Card
      variant="glass"
      className={cn("flex flex-col h-full max-w-md w-full", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-accent" />
          <span className="font-semibold">Settings</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Appearance
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <Select
              value={settings.theme}
              onValueChange={(value) => handleSettingChange('theme', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Code Theme</label>
            <Select
              value={settings.codeTheme}
              onValueChange={(value) => handleSettingChange('codeTheme', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select code theme" />
              </SelectTrigger>
              <SelectContent>
                {codeThemes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Language</label>
            <Select
              value={settings.defaultLanguage}
              onValueChange={(value) => handleSettingChange('defaultLanguage', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Editor */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Editor
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Line Numbers</label>
              <Switch
                checked={settings.lineNumbers}
                onCheckedChange={(checked) => handleSettingChange('lineNumbers', checked)}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Word Wrap</label>
              <Switch
                checked={settings.wordWrap}
                onCheckedChange={(checked) => handleSettingChange('wordWrap', checked)}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto Save</label>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Spell Check</label>
              <Switch
                checked={settings.spellCheck}
                onCheckedChange={(checked) => handleSettingChange('spellCheck', checked)}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Toolbar</label>
              <Switch
                checked={settings.showToolbar}
                onCheckedChange={(checked) => handleSettingChange('showToolbar', checked)}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <Select
              value={settings.fontSize}
              onValueChange={(value) => handleSettingChange('fontSize', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Code Highlighting */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Code Highlighting
          </h3>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show Line Numbers</label>
            <Switch
              checked={settings.showLineNumbers}
              onCheckedChange={(checked) => handleSettingChange('showLineNumbers', checked)}
              className="data-[state=checked]:bg-accent"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show Gutter</label>
            <Switch
              checked={settings.showGutter}
              onCheckedChange={(checked) => handleSettingChange('showGutter', checked)}
              className="data-[state=checked]:bg-accent"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between p-4 border-t border-white/10">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button variant="ios" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </Card>
  );
}

export default SettingsPanel;
