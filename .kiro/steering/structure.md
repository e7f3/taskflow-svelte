---
inclusion: always
---

# Project Structure & Architecture Patterns

## Folder Organization

```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Authentication feature
│   ├── tasks/         # Task management feature
│   └── filters/       # Filtering feature
├── shared/            # Shared utilities and components
│   ├── components/    # Reusable UI components
│   ├── services/      # Shared services (storage, etc.)
│   ├── stores/        # Shared store utilities
│   ├── storybook/     # Storybook mock data
│   └── types/         # Common TypeScript types
├── styles/            # Global styles and theme
└── test/              # Test setup and utilities
```

## Feature Module Structure

Each feature follows a consistent structure:

```
features/{feature}/
├── components/        # Feature-specific components
│   └── {Component}/
│       ├── {Component}.svelte
│       ├── {Component}.module.css
│       └── {Component}.stories.ts
├── services/          # Business logic and API calls
│   ├── {feature}Service.ts
│   └── {feature}Service.types.ts
├── stores/            # State management
│   ├── {feature}Store.ts
│   └── {feature}Store.types.ts
└── types/             # Feature-specific types
    └── {feature}.types.ts
```

## Key Patterns

### Component Structure

- **Svelte 5 Runes**: Use `$props()`, `$state()`, `$derived()` instead of Svelte 4 patterns
- **TypeScript Props**: Define Props interface for type safety
- **CSS Modules**: Styles in separate `.module.css` files, imported as `styles` object
- **Event Handlers**: Use `onclick`, `ondragstart` (not `on:click` from Svelte 4)
- **Accessibility**: Include ARIA labels, keyboard handlers, and focus management

### State Management

- **Entity Stores**: Use `createEntityStore<T>()` factory for collections with CRUD operations
- **Service Pattern**: Separate business logic (services) from state (stores)
- **Store Composition**: Extend base stores with feature-specific methods
- **Writable Interface**: Stores expose `subscribe`, `set`, `update` for flexibility

### Services

- **Plain Objects**: Services are plain objects with methods (not classes)
- **Async Operations**: Handle API calls, localStorage, and side effects
- **Type Safety**: Implement service interfaces for consistency
- **Mock Data**: Use constants like `MOCK_USERS` for development

### Styling

- **CSS Modules**: Files named `{Component}.module.css`
- **Theme Variables**: Use CSS custom properties from `theme.css`
- **Naming Convention**: camelCase class names (configured in Vite)
- **Responsive**: Mobile-first with media queries

### TypeScript

- **Strict Mode**: All strict checks enabled
- **Type Files**: Separate `.types.ts` files for interfaces and types
- **Entity Pattern**: All entities extend `Entity` interface with `id: EntityId`
- **Discriminated Unions**: Use for result types (e.g., `LoginResult`)

### Testing & Documentation

- **Storybook Stories**: Each component has `.stories.ts` file
- **Mock Data**: Centralized in `src/shared/storybook/mockData.ts`
- **Unit Tests**: Co-located with source files as `.test.ts`
- **Test Setup**: Global setup in `src/test/setup.ts`

## Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase (e.g., `TaskCard.svelte`)
- **Stores**: camelCase with "Store" suffix (e.g., `tasksStore`)
- **Services**: camelCase with "Service" suffix (e.g., `authService`)
- **Types**: PascalCase for interfaces/types (e.g., `Task`, `User`)
- **CSS Classes**: camelCase in modules (e.g., `styles.priorityBadge`)

## Import Patterns

- Use `@/` alias for absolute imports from `src/`
- Import types with `type` keyword: `import type { Task } from './types'`
- Group imports: external libraries, then internal modules
- Re-export types from index files for convenience

## Code Style

### General Guidelines
- **Comments**: JSDoc-style comments for functions and complex logic
- **Learning Notes**: Inline comments explaining Svelte 5 patterns and best practices
- **Minimal Code**: Focus on essential functionality, avoid over-engineering
- **Type Safety**: Prefer explicit types over inference for public APIs

### Code Quality Rules

**ESLint (JavaScript/TypeScript):**
- **Import Order**: 
  1. Built-in Node modules
  2. External packages
  3. Internal modules (using @/ alias)
  4. Parent/sibling imports
  5. Type imports
- **No Console**: Warnings only (allow console.warn and console.error)
- **Unused Variables**: Prefix with underscore (_) to ignore
- **Arrow Functions**: Preferred over function expressions
- **Const over Let**: Use const when variable won't be reassigned

**JavaScript/TypeScript Formatting:**
- **Indentation**: 2 spaces
- **Quotes**: 
  - Single quotes in TypeScript/JavaScript and Svelte `<script>` sections
  - Double quotes in Svelte templates (HTML attributes)
- **Semicolons**: Always required
- **Trailing Commas**: Required in multiline structures

**Stylelint (CSS):**
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Property Order**: Recess order (logical grouping)
  1. Positioning (position, top, right, bottom, left, z-index)
  2. Box Model (display, flex, grid, width, height, margin, padding, border)
  3. Typography (font, line-height, text-align, color)
  4. Visual (background, opacity, box-shadow)
  5. Animation (transition, animation)
  6. Misc (cursor, pointer-events)
- **Colors**: Lowercase hex, short notation (#fff not #ffffff)
- **No Named Colors**: Use hex/rgb instead of 'red', 'blue', etc.
- **Zero Units**: No unit for zero values (0 not 0px)
- **Leading Zero**: Always include (0.5 not .5)
- **No Duplicate Selectors**: Each selector used once per file
- **Auto-format on save**: Enabled in VS Code
