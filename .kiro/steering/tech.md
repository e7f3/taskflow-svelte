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

# Type Checking
pnpm check              # Run svelte-check for type errors
```

## Path Aliases

- `@/*` maps to `src/*` for clean imports
- Example: `import { authStore } from '@/features/auth/stores/authStore'`

## TypeScript Configuration

- Strict mode enabled (strict, noUnusedLocals, noUnusedParameters)
- ES2020 target with ESNext modules
- Bundler module resolution
