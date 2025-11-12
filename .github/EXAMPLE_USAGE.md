# Example: Using PR Scripts

## Scenario: You just converted stories to Svelte format

### Step 1: Check your commits

```bash
git log main..feature/convert-stories-to-svelte --oneline
```

Output might be:
```
abc1234 Convert TaskCard stories to Svelte CSF format
def5678 Convert Column stories to Svelte CSF format  
ghi9012 Convert Board stories to Svelte CSF format
jkl3456 Add type safety to story props
```

### Step 2: Generate PR description

```bash
pnpm pr:description
```

Output:
```markdown
## Description

Convert TaskCard stories to Svelte CSF format

## Changes Made

- Convert TaskCard stories to Svelte CSF format
- Convert Column stories to Svelte CSF format
- Convert Board stories to Svelte CSF format
- Add type safety to story props

## Commits

- abc1234 Convert TaskCard stories to Svelte CSF format (Your Name)
- def5678 Convert Column stories to Svelte CSF format (Your Name)
- ghi9012 Convert Board stories to Svelte CSF format (Your Name)
- jkl3456 Add type safety to story props (Your Name)

## Type of Change

- [ ] 🐛 Bug fix
- [x] ✨ New feature
- [ ] 💥 Breaking change
...
```

### Step 3: Create PR automatically

```bash
# Make sure you're on your feature branch
git checkout feature/convert-stories-to-svelte

# Create PR with auto-generated description
pnpm pr:create

# Or specify base branch
pnpm pr:create develop
```

### Step 4: Edit on GitHub (if needed)

The PR is created with the generated description. You can:
- Add screenshots
- Check off completed checklist items
- Add additional context
- Link related issues

## Real Example for Current Work

For the story conversion work you just did:

```bash
# 1. Commit your changes
git add .
git commit -m "Convert all TypeScript stories to Svelte CSF format

- Converted TaskCard, Column, Board, TaskForm, LoginForm stories
- Added proper TypeScript types for all story props
- Fixed component prop requirements in stories
- Removed old .ts story files"

# 2. Push branch
git push origin feature/convert-stories-to-svelte

# 3. Generate and create PR
pnpm pr:create
```

This creates a PR with:
- **Title**: "Feature Convert Stories To Svelte"
- **Description**: Auto-generated from your commit
- **Body**: Includes all commits, changes, and checklist

## Tips for Better PR Descriptions

### Write Descriptive Commits

Instead of:
```bash
git commit -m "fix stories"
```

Write:
```bash
git commit -m "Fix TypeScript errors in Column stories

- Add missing required props (status, draggedTask, callbacks)
- Add proper type annotations for handler functions
- Update argTypes to match component prop names"
```

### Use Conventional Commits

```bash
git commit -m "feat: convert stories to Svelte CSF format"
git commit -m "fix: add missing TypeScript types to stories"
git commit -m "refactor: simplify story component structure"
git commit -m "docs: add PR workflow documentation"
```

The scripts can be enhanced to auto-detect these prefixes and check the appropriate boxes in "Type of Change".
