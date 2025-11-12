---
inclusion: always
---

# Technology Stack

## Core Framework

- **Svelte 5**: Modern reactive framework with runes ($state, $derived, $props)
- **TypeScript**: Strict mode enabled for type safety
- **Vite**: Build tool and dev server

## Testing & Documentation

- **Vitest**: Unit testing with jsdom environment
- **Testing Library**: Component testing (@testing-library/svelte)
- **Storybook**: Component documentation and visual testing
- **Playwright**: Browser testing for Storybook stories

## Styling

- **CSS Modules**: Scoped styles with `.module.css` extension
- **CSS Custom Properties**: Theme variables in `src/styles/theme.css`
- **Google Fonts**: Karla font family

## Package Manager

- **pnpm**: Fast, disk-efficient package manager

## Common Commands

```bash
# Development
pnpm dev                 # Start dev server (Vite)
pnpm storybook          # Start Storybook on port 6006

# Building
pnpm build              # Production build
pnpm build-storybook    # Build Storybook static site
pnpm preview            # Preview production build

# Testing
pnpm test               # Run tests once
pnpm test:watch         # Run tests in watch mode
pnpm test:ui            # Run tests with Vitest UI

# Code Quality
pnpm lint               # Run ESLint to check code
pnpm lint:fix           # Run ESLint and auto-fix issues
pnpm lint:css           # Run Stylelint to check CSS
pnpm lint:css:fix       # Run Stylelint and auto-fix issues
pnpm format             # Format all code (ESLint + Stylelint)
pnpm check              # Run svelte-check for type errors
```

## Code Quality Tools

- **ESLint**: Linting and formatting for TypeScript and Svelte
  - Import ordering and organization
  - Code quality rules (no-console, prefer-const, etc.)
  - Code formatting (indentation, quotes, semicolons)
  - TypeScript-specific rules
  - Svelte 5 runes support
  - Automatic formatting on save
- **Stylelint**: CSS linting and formatting
  - Property ordering (Recess order - logical grouping)
  - Indentation and spacing
  - Color format consistency
  - No duplicate selectors
  - Automatic formatting on save
- **TypeScript**: Strict mode type checking
- **svelte-check**: Svelte-specific type validation

## Path Aliases

- `@/*` maps to `src/*` for clean imports
- Example: `import { authStore } from '@/features/auth/stores/authStore'`

## TypeScript Configuration

- Strict mode enabled (strict, noUnusedLocals, noUnusedParameters)
- ES2020 target with ESNext modules
- Bundler module resolution
