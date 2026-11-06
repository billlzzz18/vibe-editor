import { test, expect } from '@playwright/test';

test.describe('Basic UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to load
    await page.waitForSelector('header');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/Mistral AI Editor/);
    await expect(page.getByText('Mistral AI')).toBeVisible();
  });

  test('should have burger menu on mobile', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const burgerMenu = page.getByRole('button', { name: /Menu/ });
    await expect(burgerMenu).toBeVisible();
  });

  test('should have settings button', async ({ page }) => {
    const settingsButton = page.getByRole('button', { name: /Settings/ });
    await expect(settingsButton).toBeVisible();
  });

  test('should have new note button', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await expect(newButton).toBeVisible();
  });

  test('should show empty state when no note selected', async ({ page }) => {
    await expect(page.getByText(/Select a note or create a new one/)).toBeVisible();
  });
});

test.describe('Sidebar Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
  });

  test('should open sidebar on burger menu click (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const burgerMenu = page.getByRole('button', { name: /Menu/ });
    await burgerMenu.click();
    
    // Check if sidebar is visible
    await expect(page.getByText('Notes')).toBeVisible();
  });

  test('should close sidebar on backdrop click (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const burgerMenu = page.getByRole('button', { name: /Menu/ });
    await burgerMenu.click();
    
    // Click on backdrop
    await page.click('body');
    
    // Sidebar should be hidden
    await expect(page.getByText('Notes')).not.toBeVisible();
  });

  test('should show notes list in sidebar', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Sidebar should be visible on desktop
    await expect(page.getByText('Notes')).toBeVisible();
  });
});

test.describe('Command Palette Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
  });

  test('should open command palette on / key', async ({ page }) => {
    // Focus on editor first
    await page.keyboard.press('Tab');
    await page.keyboard.press('/');
    
    // Command palette should appear
    await expect(page.getByPlaceholder(/Type a command/)).toBeVisible();
  });

  test('should show all command items', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('/');
    
    // Check for command items
    await expect(page.getByText('Heading 1')).toBeVisible();
    await expect(page.getByText('Heading 2')).toBeVisible();
    await expect(page.getByText('Bold')).toBeVisible();
    await expect(page.getByText('Italic')).toBeVisible();
    await expect(page.getByText('Callout')).toBeVisible();
    await expect(page.getByText('Quote')).toBeVisible();
    await expect(page.getByText('Image')).toBeVisible();
    await expect(page.getByText('เยื้องซ้าย')).toBeVisible();
    await expect(page.getByText('เยื้องขวา')).toBeVisible();
  });

  test('should filter commands on typing', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('/');
    
    // Type 'h' to filter headings
    await page.keyboard.type('h');
    
    // Should show heading commands
    await expect(page.getByText('Heading 1')).toBeVisible();
    await expect(page.getByText('Heading 2')).toBeVisible();
    
    // Should not show non-heading commands
    await expect(page.getByText('Bold')).not.toBeVisible();
  });

  test('should close command palette on Escape', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('/');
    
    // Command palette should be open
    await expect(page.getByPlaceholder(/Type a command/)).toBeVisible();
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Command palette should be closed
    await expect(page.getByPlaceholder(/Type a command/)).not.toBeVisible();
  });
});

test.describe('Editor Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
  });

  test('should create new note', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    // Editor should be visible
    await expect(page.getByPlaceholder(/Start writing/)).toBeVisible();
  });

  test('should type in editor', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    await editor.fill('# Hello World');
    
    // Check if text is in editor
    await expect(editor).toHaveValue('# Hello World');
  });

  test('should format text with bold', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    await editor.fill('Hello World');
    
    // Select text and make bold
    await editor.selectText();
    await page.getByRole('button', { name: /Bold/ }).click();
    
    // Check if text is bold (content should contain **)
    const content = await editor.inputValue();
    expect(content).toContain('**');
  });

  test('should format text with italic', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    await editor.fill('Hello World');
    
    // Select text and make italic
    await editor.selectText();
    await page.getByRole('button', { name: /Italic/ }).click();
    
    // Check if text is italic (content should contain *)
    const content = await editor.inputValue();
    expect(content).toContain('*');
  });
});

test.describe('Thai Language Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
  });

  test('should display Thai text in command palette', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('/');
    
    await expect(page.getByText('เยื้องซ้าย')).toBeVisible();
    await expect(page.getByText('เยื้องขวา')).toBeVisible();
  });

  test('should type Thai characters in editor', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    await editor.fill('ทดสอบภาษาไทย');
    
    await expect(editor).toHaveValue('ทดสอบภาษาไทย');
  });

  test('should handle Thai alignment commands', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    await editor.fill('ข้อความ');
    
    // Open command palette and select left align
    await page.keyboard.press('/');
    await page.keyboard.type('เยื');
    await page.getByText('เยื้องซ้าย').click();
    
    // Check if alignment was applied
    const content = await editor.inputValue();
    expect(content).toContain('text-align: left');
  });
});

test.describe('UI Consistency Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
  });

  test('should not have overlapping text on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open sidebar
    const burgerMenu = page.getByRole('button', { name: /Menu/ });
    await burgerMenu.click();
    
    // Check for overlapping elements
    const notesHeader = page.getByText('Notes');
    const newNoteButton = page.getByRole('button', { name: /New Note/ });
    
    const notesBox = await notesHeader.boundingBox();
    const buttonBox = await newNoteButton.boundingBox();
    
    expect(notesBox).toBeTruthy();
    expect(buttonBox).toBeTruthy();
    
    // Elements should not overlap vertically
    if (notesBox && buttonBox) {
      expect(buttonBox.y).toBeGreaterThan(notesBox.y + notesBox.height);
    }
  });

  test('should not have overlapping text on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Check header elements don't overlap
    const logo = page.getByText('Mistral AI');
    const settings = page.getByRole('button', { name: /Settings/ });
    const newButton = page.getByRole('button', { name: /New/ });
    
    const logoBox = await logo.boundingBox();
    const settingsBox = await settings.boundingBox();
    const newButtonBox = await newButton.boundingBox();
    
    expect(logoBox).toBeTruthy();
    expect(settingsBox).toBeTruthy();
    expect(newButtonBox).toBeTruthy();
    
    // Elements should be horizontally spaced
    if (logoBox && settingsBox && newButtonBox) {
      expect(settingsBox.x).toBeGreaterThan(logoBox.x + logoBox.width);
      expect(newButtonBox.x).toBeGreaterThan(settingsBox.x + settingsBox.width);
    }
  });

  test('should have consistent spacing between elements', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Open sidebar
    const notesHeader = page.getByText('Notes');
    const firstNote = page.getByText(/Getting Started/);
    
    const headerBox = await notesHeader.boundingBox();
    const noteBox = await firstNote.boundingBox();
    
    expect(headerBox).toBeTruthy();
    expect(noteBox).toBeTruthy();
    
    // There should be spacing between header and first note
    if (headerBox && noteBox) {
      expect(noteBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
    }
  });

  test('should have consistent button sizes', async ({ page }) => {
    const buttons = await page.getByRole('button').all();
    
    // Check that toolbar buttons have consistent height
    const toolbarButtons = buttons.slice(0, 5); // First few buttons
    const heights = await Promise.all(
      toolbarButtons.map(async (btn) => {
        const box = await btn.boundingBox();
        return box?.height;
      })
    );
    
    // All buttons should have the same height
    const uniqueHeights = new Set(heights.filter((h) => h !== undefined));
    expect(uniqueHeights.size).toBeLessThanOrEqual(1);
  });
});

test.describe('Edge Cases Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('header');
  });

  test('should handle very long note titles', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    // Create a very long title
    const longTitle = 'A'.repeat(100);
    const titleInput = page.getByRole('textbox', { name: /Untitled/ });
    await titleInput.fill(longTitle);
    
    // Title should be truncated or scrollable, not breaking layout
    const titleBox = await titleInput.boundingBox();
    expect(titleBox?.width).toBeLessThan(800); // Should not exceed reasonable width
  });

  test('should handle empty note content', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    await editor.fill('');
    
    // Editor should still be visible
    await expect(editor).toBeVisible();
  });

  test('should handle special characters in note content', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    const specialChars = '<>&"\'@#$%^&*()';
    await editor.fill(specialChars);
    
    // Content should be preserved
    await expect(editor).toHaveValue(specialChars);
  });

  test('should handle Unicode characters', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    const unicode = '🎉🚀✨ Hello 世界';
    await editor.fill(unicode);
    
    // Unicode should be preserved
    await expect(editor).toHaveValue(unicode);
  });

  test('should handle very long lines in editor', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /New/ });
    await newButton.click();
    
    const editor = page.getByPlaceholder(/Start writing/);
    const longLine = 'A'.repeat(500);
    await editor.fill(longLine);
    
    // Editor should handle it without breaking
    await expect(editor).toBeVisible();
    await expect(editor).toHaveValue(longLine);
  });
});
