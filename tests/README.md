# Tests Documentation

This directory contains all tests for the Mistral AI Editor application.

## Test Structure

```
tests/
├── unit/                    # Unit tests with Vitest
│   ├── utils.test.ts        # Utility function tests
│   ├── markdownRenderer.test.ts  # Markdown rendering tests
│   └── seed.test.ts         # Seed data tests
├── e2e/                     # End-to-end tests with Playwright
│   └── basic.spec.ts        # Basic UI tests, command palette, editor
├── api/                     # API tests
│   ├── notes.test.ts        # Notes API tests
│   └── chat.test.ts         # Chat API tests
├── seed/                    # Seed data for testing
│   └── notes.ts             # Mock notes data
└── snapshots/               # Playwright snapshots
```

## Running Tests

### All Tests
```bash
npm run test:all
```

### Unit Tests
```bash
# Run once
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run headless
npm run test:ui

# Run with browser window
npm run test:ui:headed

# Run in debug mode
npm run test:ui:debug
```

### API Tests
```bash
npm run test:api
```

### Individual Checks
```bash
# Lint
npm run lint

# Lint and fix
npm run lint:fix

# Type checking
npm run typecheck

# Format checking
npm run format:check

# Format files
npm run format
```

## Test Coverage

### Unit Tests
- ✅ Utility functions (cn, formatDate, formatDateTime, truncate, generateId, escapeHtml)
- ✅ Markdown rendering (headings, text formatting, lists, links, images, code blocks, tables)
- ✅ Seed data (notes creation, mock responses)
- ✅ Thai language support

### E2E Tests
- ✅ Mobile UI (burger menu, sidebar, responsive design)
- ✅ Desktop UI (sidebar visibility, button spacing)
- ✅ Command palette (opening, filtering, selection, closing)
- ✅ Editor (creating notes, typing, formatting)
- ✅ Thai language (command palette, typing, alignment)
- ✅ UI consistency (no overlapping text, consistent spacing, button sizes)
- ✅ Edge cases (long titles, empty content, special characters, Unicode, long lines)

### API Tests
- ✅ Notes API (GET all, GET by ID, POST create, PUT update, DELETE)
- ✅ Chat API (POST chat, streaming, error handling, Thai language)
- ✅ Error handling (400, 404, 500 errors)

## Test Data

### Seed Notes
The `seed/notes.ts` file contains mock data for testing:
- 5 sample notes with various content
- Thai language support
- Code examples
- Markdown formatting examples

### Mock API Responses
Mock responses for API endpoints to test without a real backend.

## Writing New Tests

### Unit Tests
1. Create a new file in `tests/unit/` with `.test.ts` extension
2. Import `describe`, `it`, `expect` from 'vitest'
3. Write your test cases
4. Run with `npm run test`

Example:
```typescript
import { describe, it, expect } from 'vitest';

describe('My Component', () => {
  it('should render correctly', () => {
    // Test implementation
    expect(true).toBe(true);
  });
});
```

### E2E Tests
1. Create a new file in `tests/e2e/` with `.spec.ts` extension
2. Import `test`, `expect` from '@playwright/test'
3. Write your test scenarios
4. Run with `npm run test:ui`

Example:
```typescript
import { test, expect } from '@playwright/test';

test('should load the application', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Mistral AI Editor/);
});
```

### API Tests
1. Create a new file in `tests/api/` with `.test.ts` extension
2. Mock `fetch` using `vi.spyOn(global, 'fetch')`
3. Write your test cases
4. Run with `npm run test`

Example:
```typescript
import { describe, it, expect, vi } from 'vitest';

global.fetch = vi.fn();

describe('API', () => {
  it('should return data', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    } as Response);

    const response = await fetch('/api/test');
    const data = await response.json();

    expect(data).toEqual({ data: 'test' });
  });
});
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Setup**: Set up test data before each test
3. **Clean Teardown**: Clean up after each test
4. **Descriptive Names**: Use clear, descriptive test names
5. **Test Edge Cases**: Include tests for edge cases and error conditions
6. **Mock External Dependencies**: Mock API calls, databases, etc.
7. **Keep Tests Fast**: Avoid slow operations in tests
8. **Test One Thing**: Each test should verify one specific behavior

## Continuous Integration

For CI/CD pipelines, use:

```bash
# Install dependencies
npm ci

# Run all checks
npm run test:all

# Or run individual checks
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:ui
```

## Troubleshooting

### Playwright Tests
- If tests fail, run in headed mode to debug: `npm run test:ui:headed`
- Check screenshots in `test-results/` directory
- Check videos in `test-results/` directory

### Unit Tests
- If tests fail, check the error message and stack trace
- Use `console.log` for debugging (but remove before committing)
- Check that all mocks are properly set up

### Linting Errors
- Run `npm run lint:fix` to automatically fix some issues
- Manually fix remaining issues based on ESLint rules

### Type Errors
- Run `npm run typecheck` to check for TypeScript errors
- Ensure all types are properly defined
- Use type assertions if necessary

## Test Results

Test results are saved in:
- `test-results/` - Playwright test results
- `coverage/` - Code coverage reports (when running with `--coverage`)
- `playwright-report/` - Playwright HTML report

## Performance

- Unit tests should run in milliseconds
- E2E tests may take longer (seconds to minutes)
- Use `test.skip` to skip slow tests during development
- Use `test.only` to run a specific test

## Contributing

When adding new features:
1. Add unit tests for new utility functions
2. Add E2E tests for new UI components
3. Add API tests for new endpoints
4. Ensure all tests pass
5. Update this documentation if needed
