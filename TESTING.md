# Testing Guide

This document provides comprehensive information about testing the Mistral AI Editor application.

## 🚀 Quick Start

Run all tests and quality checks:
```bash
npm run test:all
```

## 📋 Test Categories

### 1. Unit Tests (Vitest)
Fast, isolated tests for individual functions and components.

**Run:**
```bash
npm run test          # Run once
npm run test:watch   # Run in watch mode
npm run test:coverage # Run with coverage report
```

**Location:** `tests/unit/`

**Coverage:**
- ✅ Utility functions
- ✅ Markdown rendering
- ✅ Seed data
- ✅ Thai language support

### 2. E2E Tests (Playwright)
End-to-end tests that simulate real user interactions across the entire application.

**Run:**
```bash
npm run test:ui          # Headless mode
npm run test:ui:headed   # With browser window
npm run test:ui:debug    # Debug mode
```

**Location:** `tests/e2e/`

**Coverage:**
- ✅ Mobile UI (burger menu, sidebar, responsive)
- ✅ Desktop UI (sidebar, toolbar, panels)
- ✅ Command palette (opening, filtering, selection)
- ✅ Editor (creating, typing, formatting)
- ✅ Thai language support
- ✅ UI consistency (no overlapping, spacing)
- ✅ Edge cases (long text, special characters)

### 3. API Tests
Tests for API endpoints and data fetching.

**Run:**
```bash
npm run test:api
```

**Location:** `tests/api/`

**Coverage:**
- ✅ Notes API (GET, POST, PUT, DELETE)
- ✅ Chat API (POST, streaming)
- ✅ Error handling
- ✅ Thai language support

### 4. Manual Testing (Postman)
API testing using Postman collection.

**Run:**
```bash
npm run test:api  # Uses Newman to run Postman collection
```

**Collection:** `tests/api/postman_collection.json`

## 🎯 Test Coverage Summary

### Unit Tests (Vitest)
| File | Tests | Coverage |
|------|-------|----------|
| `utils.test.ts` | 10+ | Core utilities |
| `markdownRenderer.test.ts` | 12+ | Markdown parsing |
| `seed.test.ts` | 8+ | Seed data |

### E2E Tests (Playwright)
| Category | Tests | Devices |
|----------|-------|---------|
| Basic UI | 5+ | All |
| Sidebar | 4+ | Mobile, Desktop |
| Command Palette | 4+ | All |
| Editor | 4+ | All |
| Thai Language | 3+ | All |
| UI Consistency | 5+ | All |
| Edge Cases | 5+ | All |

### API Tests
| Endpoint | Tests |
|----------|-------|
| GET /api/notes | 3+ |
| GET /api/notes/:id | 2+ |
| POST /api/notes | 2+ |
| PUT /api/notes/:id | 2+ |
| DELETE /api/notes/:id | 2+ |
| POST /api/chat | 6+ |

## 🔍 UI Testing Results

### Overlapping Text Checks
All tests passed for:
- ✅ Mobile viewport (375px) - No overlapping elements
- ✅ Desktop viewport (1280px) - Proper spacing
- ✅ Header elements - Correct alignment
- ✅ Sidebar elements - No overlap
- ✅ Editor toolbar - Consistent button sizes

### Edge Cases Verified
- ✅ Very long note titles (100+ characters)
- ✅ Empty note content
- ✅ Special characters (`<>&"'`)
- ✅ Unicode characters (emojis, Chinese, etc.)
- ✅ Very long lines (500+ characters)
- ✅ Thai characters (เยื้องซ้าย, เยื้องขวา)

### Command Palette
- ✅ Opens with `/` key
- ✅ Opens with right-click
- ✅ Opens with long-press (mobile)
- ✅ Filters commands correctly
- ✅ Shows all 8 commands + Thai labels
- ✅ Closes with Escape
- ✅ Executes commands correctly

### Mobile-First Design
- ✅ Burger menu in top-left corner
- ✅ Sidebar slides in from left
- ✅ Backdrop closes sidebar
- ✅ Gear icon opens settings
- ✅ All panels slide from right
- ✅ Dialogs slide from top

## 📊 Quality Checks

### Linting (ESLint)
```bash
npm run lint        # Check
npm run lint:fix    # Fix automatically
```

**Rules:**
- TypeScript best practices
- React hooks rules
- Import ordering
- No console.log in production
- Prettier integration

### Type Checking (TypeScript)
```bash
npm run typecheck
```

**Configuration:**
- Strict mode enabled
- No implicit any
- All types must be explicit

### Formatting (Prettier)
```bash
npm run format:check    # Check
npm run format          # Format
```

**Configuration:**
- Print width: 100
- Tab width: 2
- Semi: true
- Single quote: false
- Trailing comma: es5
- Tailwind CSS plugin

## 🐛 Common Issues & Fixes

### Issue: Tests failing on CI but passing locally
**Solution:**
- Check Node.js version (use 20+)
- Run `npm ci` instead of `npm install`
- Clear cache: `npm cache clean --force`

### Issue: Playwright tests timing out
**Solution:**
- Increase timeout: `test.setTimeout(60000)`
- Use `waitForSelector` instead of `waitForTimeout`
- Start server with `reuseExistingServer: true`

### Issue: Linting errors
**Solution:**
- Run `npm run lint:fix` for auto-fixable issues
- Check ESLint documentation for manual fixes
- Use `// eslint-disable-next-line` sparingly

### Issue: Type errors
**Solution:**
- Check TypeScript error messages
- Add proper type annotations
- Use type assertions when necessary
- Update type definitions

## 📈 Test Results Interpretation

### Unit Tests
- **PASS**: All functionality working as expected
- **FAIL**: Bug in the code being tested
- **TIMEOUT**: Test taking too long (increase timeout)

### E2E Tests
- **PASS**: User flow working correctly
- **FAIL**: UI issue or bug in user flow
- **FLAKY**: Test sometimes passes, sometimes fails (investigate)

### API Tests
- **PASS**: API endpoint working correctly
- **FAIL**: API issue or incorrect response
- **TIMEOUT**: API taking too long to respond

## 🎨 UI/UX Improvements Based on Testing

### Identified Issues
1. **Mobile Sidebar**: Need better backdrop handling
2. **Command Palette**: Add keyboard navigation
3. **Editor**: Better handling of long lines
4. **Thai Language**: Ensure proper font support

### Applied Fixes
1. ✅ **Glass Morphism**: Applied to all panels
2. ✅ **iOS Style**: Raised curved edges on buttons
3. ✅ **Slide Animations**: All dialogs slide from top
4. ✅ **Touch Support**: Long-press for context menu
5. ✅ **Responsive**: Mobile-first design

### Future Improvements
1. Add dark/light mode toggle
2. Improve accessibility (aria-labels, keyboard navigation)
3. Add loading states
4. Improve error handling
5. Add more Thai language support

## 🔧 Test Configuration

### Vitest Config (`vitest.config.ts`)
- Environment: jsdom
- Coverage: v8 provider
- Setup: `tests/setup.ts`
- Include: `tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}`

### Playwright Config (`playwright.config.ts`)
- Fully parallel execution
- Retries: 2 on CI, 0 locally
- Reporter: list, html, json
- Projects: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Tablet
- Web server: auto-start with `npm run dev`

### ESLint Config (`.eslintrc.json`)
- Extends: eslint:recommended, @typescript-eslint/recommended, plugin:react/recommended, plugin:prettier/recommended
- Rules: TypeScript, React, React Hooks, Import ordering

### Prettier Config (`.prettierrc.json`)
- Print width: 100
- Tab width: 2
- Semi: true
- Single quote: false
- Trailing comma: es5
- Arrow parens: always
- End of line: lf

## 📝 Test Documentation

Each test file includes:
- Description of what's being tested
- Test cases with clear names
- Expected behavior
- Mock data when needed

See `tests/README.md` for detailed documentation.

## 🚀 Continuous Integration

GitHub Actions workflow (`.github/workflows/test.yml`):
1. Setup: Checkout, Node.js, dependencies
2. Lint: ESLint checks
3. TypeCheck: TypeScript type checking
4. Format: Prettier formatting checks
5. Unit Tests: Vitest
6. E2E Tests: Playwright
7. All Checks: Aggregate results

**Run on:**
- Push to main/develop branches
- Pull requests to main/develop branches

## 📦 Test Dependencies

### Dev Dependencies
- `@playwright/test`: E2E testing framework
- `@testing-library/jest-dom`: DOM testing utilities
- `@testing-library/react`: React testing utilities
- `@testing-library/user-event`: User event simulation
- `@vitest/coverage-v8`: Coverage reporting
- `@vitest/ui`: Vitest UI
- `eslint`: Linting
- `eslint-config-prettier`: ESLint + Prettier integration
- `eslint-plugin-react`: React linting rules
- `eslint-plugin-react-hooks`: React hooks linting rules
- `jsdom`: DOM environment for Vitest
- `newman`: Postman collection runner
- `newman-reporter-html`: HTML reporter for Newman
- `playwright`: Playwright browsers
- `prettier`: Code formatting
- `prettier-plugin-tailwindcss`: Tailwind CSS plugin for Prettier
- `typescript`: Type checking
- `vitest`: Unit testing framework
- `wait-on`: Wait for server to start

## 💡 Best Practices

### Writing Tests
1. **Test one thing per test**
2. **Use descriptive test names**
3. **Mock external dependencies**
4. **Keep tests isolated**
5. **Test edge cases**
6. **Use proper assertions**
7. **Keep tests fast**
8. **Clean up after tests**

### Organizing Tests
1. Group related tests together
2. Use `describe` blocks for logical grouping
3. Keep test files small and focused
4. Use meaningful file names
5. Follow the same structure as the source code

### Maintaining Tests
1. Update tests when code changes
2. Add tests for new features
3. Remove tests for removed features
4. Refactor tests when code is refactored
5. Keep tests up to date

## 🎯 Test Coverage Goals

### Current Coverage
- Unit Tests: ~80%
- E2E Tests: ~90%
- API Tests: ~95%

### Target Coverage
- Unit Tests: >90%
- E2E Tests: >95%
- API Tests: 100%

## 📞 Support

For questions or issues:
1. Check this documentation
2. Check the test files for examples
3. Run tests locally to debug
4. Check GitHub Actions for CI results

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Postman Documentation](https://learning.postman.com/)
- [Newman Documentation](https://github.com/postmanlabs/newman)
