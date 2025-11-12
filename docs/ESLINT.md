# ESLint Configuration Guide

## Overview

This project uses ESLint with TypeScript and Svelte support to maintain code quality and consistency.

## Features

### 🎯 Import Organization
- Automatic import sorting and grouping
- Alphabetical ordering within groups
- No duplicate imports
- Newline after imports

### 📝 Code Style
- 2-space indentation
- Single quotes (except Svelte templates use double quotes)
- Semicolons required
- Trailing commas in multiline structures
- No trailing whitespace
- Single empty line at end of file

### 🔍 TypeScript Rules
- Warn on unused variables (prefix with `_` to ignore)
- Warn on `any` types
- Warn on non-null assertions (`!`)
- Strict type checking

### ⚡ Svelte 5 Support
- Runes validation ($state, $derived, $effect, $props)
- Component prop validation
- Template syntax checking
- Accessibility rules

## Usage

### Check for Issues
```bash
pnpm lint
```

### Auto-fix Issues
```bash
pnpm lint:fix
```

### VS Code Integration
The project includes `.vscode/settings.json` that:
- Enables ESLint for Svelte files
- Auto-fixes on save
- Shows inline errors and warnings

## Common Patterns

### Import Order Example
```typescript
// ✅ Correct order
import { writable } from 'svelte/store';           // External
import type { Task } from '@/features/tasks/types'; // Internal (@/ alias)
import { taskService } from '../services/taskService'; // Parent/sibling
import styles from './Component.module.css';       // Sibling

// ❌ Wrong order (will be auto-fixed)
import styles from './Component.module.css';
import { writable } from 'svelte/store';
import type { Task } from '@/features/tasks/types';
```

### Unused Variables
```typescript
// ✅ Prefix with underscore to ignore
function handleClick(_event: MouseEvent) {
  console.log('clicked');
}

// ❌ Will warn
function handleClick(event: MouseEvent) {
  console.log('clicked');
}
```

### Svelte Component Style
```svelte
<!-- ✅ Correct -->
<script lang="ts">
  import type { Task } from '@/features/tasks/types';
  
  interface Props {
    task: Task;
  }
  
  let { task }: Props = $props();
  let count = $state(0);
</script>

<button onclick={() => count++}>
  {task.title}: {count}
</button>
```

## Disabling Rules

### For a single line
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData();
```

### For a file
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// File content
```

### For a block
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
const data: any = fetchData();
/* eslint-enable @typescript-eslint/no-explicit-any */
```

## Configuration Files

- `eslint.config.js` - Main ESLint configuration (flat config format)
- `.eslintignore` - Files and directories to ignore
- `.vscode/settings.json` - VS Code integration settings

## Troubleshooting

### ESLint not working in VS Code
1. Install the ESLint extension
2. Reload VS Code
3. Check the Output panel (ESLint) for errors

### Import order not auto-fixing
Run `pnpm lint:fix` manually - some import issues require manual intervention

### Svelte files showing errors
Make sure you have the Svelte for VS Code extension installed

## Customization

To modify rules, edit `eslint.config.js`:

```javascript
{
  rules: {
    // Change severity: 'off', 'warn', or 'error'
    'no-console': 'off',
    
    // Customize rule options
    'indent': ['error', 4], // Change to 4 spaces
  }
}
```

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [typescript-eslint](https://typescript-eslint.io/)
- [eslint-plugin-svelte](https://sveltejs.github.io/eslint-plugin-svelte/)
- [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)
