# Infrastructure & Tooling Design

## Overview

This document describes the architecture and design decisions for the comprehensive development infrastructure built for TaskFlow. The infrastructure includes reusable UI components, CI/CD pipelines, automated testing, code quality tools, and developer productivity enhancements.

## Architecture

### Component Library Structure

```
src/shared/components/
├── Button/
│   ├── Button.svelte
│   ├── Button.module.css
│   └── Button.stories.svelte
├── Input/
│   ├── Input.svelte
│   ├── Input.module.css
│   └── Input.stories.svelte
├── Select/
│   ├── Select.svelte
│   ├── Select.module.css
│   └── Select.stories.svelte
└── Textarea/
    ├── Textarea.svelte
    ├── Textarea.module.css
    └── Textarea.stories.svelte
```

### CI/CD Pipeline Architecture

```
GitHub Actions Workflows
├── ci.yml (Continuous Integration)
│   ├── Lint Job (ESLint + Stylelint)
│   ├── Test Job (Vitest)
│   ├── Build Job (Vite)
│   └── Storybook Build Job
├── deploy.yml (Production Deployment)
│   ├── Build Application
│   └── Deploy to GitHub Pages
├── storybook-deploy.yml (Storybook Deployment)
│   ├── Build Storybook
│   └── Deploy to GitHub Pages
├── lighthouse.yml (Performance Monitoring)
│   ├── Build Application
│   └── Run Lighthouse Audits
├── preview-deploy.yml (PR Previews)
│   ├── Build Preview
│   └── Comment on PR
└── release.yml (Automated Releases)
    ├── Build Artifacts
    ├── Generate Changelog
    └── Create GitHub Release
```

### PR Automation Architecture

```
.github/scripts/
├── generate-pr-description.sh
│   └── Extracts commits and generates markdown
├── create-pr.sh
│   └── Uses gh CLI to create PR
├── generate-task-pr.sh
│   └── Extracts task info from specs
└── create-task-pr.sh
    └── Creates task-based PR
```

## Component Design

### Button Component

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `type`: 'button' | 'submit' | 'reset'
- `disabled`: boolean
- `loading`: boolean
- `onclick`: (event: MouseEvent) => void
- `children`: Snippet (Svelte 5)

**Features:**
- Multiple visual variants
- Loading state with spinner
- Disabled state handling
- Optional chaining for children snippet
- CSS Modules for scoped styling

### Input Component

**Props:**
- `value`: string (bindable)
- `type`: string
- `id`: string
- `placeholder`: string
- `disabled`: boolean
- `required`: boolean
- `error`: string
- ARIA attributes for accessibility

**Features:**
- Two-way binding with $bindable
- Error state styling
- Accessibility support
- Validation feedback

### Select Component

**Props:**
- `value`: string | number | null (bindable)
- `id`: string
- `disabled`: boolean
- `required`: boolean
- `error`: string
- `children`: Snippet for options

**Features:**
- Native select element
- Error state styling
- Option rendering via snippet
- Accessibility support

### Textarea Component

**Props:**
- `value`: string (bindable)
- `id`: string
- `placeholder`: string
- `disabled`: boolean
- `required`: boolean
- `rows`: number
- `error`: string

**Features:**
- Configurable height
- Error state styling
- Resize control
- Accessibility support

## CI/CD Design

### Continuous Integration Workflow

**Triggers:**
- Push to main or develop
- Pull requests to main or develop

**Jobs:**
1. **Lint**: Runs ESLint and Stylelint in parallel
2. **Test**: Runs Vitest with coverage reporting
3. **Build**: Builds production application
4. **Storybook**: Builds Storybook static site
5. **CI Success**: Summary job ensuring all passed

**Optimizations:**
- Parallel job execution
- pnpm caching
- Concurrency control (cancel in-progress runs)
- Artifact retention (7 days)

### Deployment Workflow

**Triggers:**
- Push to main branch
- Manual workflow_dispatch

**Process:**
1. Build application with production settings
2. Configure GitHub Pages
3. Upload build artifacts
4. Deploy to GitHub Pages

**Features:**
- Automatic base URL configuration
- Permissions management
- Deployment status tracking

### Lighthouse CI Workflow

**Configuration:**
- 3 runs per audit for consistency
- Score thresholds: 90% minimum
- Temporary public storage for reports

**Metrics:**
- Performance
- Accessibility
- Best Practices
- SEO

### Preview Deployment Workflow

**Process:**
1. Build application and Storybook
2. Upload as artifacts
3. Post comment on PR with instructions

**Features:**
- 7-day artifact retention
- Automatic PR comments
- Both app and Storybook included

### Release Workflow

**Triggers:**
- Git tags matching `v*.*.*`

**Process:**
1. Build application and Storybook
2. Create ZIP archives
3. Generate changelog from commits
4. Create GitHub Release with assets

## Code Quality Tools

### ESLint Configuration

**Rules:**
- TypeScript strict mode
- Svelte 5 support
- Import ordering and organization
- Code quality rules (no-console, prefer-const)
- Automatic formatting

**Import Order:**
1. Built-in Node modules
2. External packages
3. Internal modules (@/ alias)
4. Parent/sibling imports
5. Type imports

### Stylelint Configuration

**Rules:**
- Property ordering (Recess order)
- Indentation and spacing
- Color format consistency
- No duplicate selectors
- Semantic grouping with empty lines

**Property Order Groups:**
1. Positioning
2. Box Model
3. Typography
4. Visual
5. Animation
6. Misc

## PR Automation Design

### General PR Generation

**Script:** `generate-pr-description.sh`

**Extracts:**
- First commit message as description
- All commit messages
- Files changed
- Commit history with authors

**Generates:**
- Markdown PR description
- Type of change checklist
- Testing checklist

### Task-Based PR Generation

**Script:** `generate-task-pr.sh`

**Extracts:**
- Task number and title from tasks.md
- Related requirements
- Commit messages
- Files changed

**Generates:**
- Task-specific PR description
- Links to spec files
- Requirements references
- Complete checklists

## Documentation Structure

```
Documentation
├── DEPLOYMENT.md
│   ├── GitHub Pages setup
│   ├── Storybook deployment
│   ├── Preview deployments
│   ├── Release process
│   └── Troubleshooting
├── docs/CI-CD.md
│   ├── Workflow descriptions
│   ├── Job details
│   ├── Status badges
│   └── Local testing
├── .github/README.md
│   ├── Directory structure
│   ├── Available commands
│   └── Quick start
├── .github/PR_WORKFLOW.md
│   ├── General PR workflow
│   ├── Script usage
│   └── Best practices
├── .github/TASK_PR_WORKFLOW.md
│   ├── Task-based workflow
│   ├── Integration with specs
│   └── Examples
└── .github/PR_QUICK_REFERENCE.md
    ├── Command comparison
    ├── Prerequisites
    └── Tips
```

## Technology Stack

### Core Tools
- **Svelte 5**: Component framework with runes
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Storybook**: Component documentation
- **@storybook/addon-svelte-csf**: Svelte CSF support

### CI/CD
- **GitHub Actions**: Workflow automation
- **GitHub Pages**: Static site hosting
- **GitHub CLI**: PR automation

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Stylelint**: CSS linting
- **TypeScript Compiler**: Type checking
- **Vitest**: Unit testing

### Performance
- **Lighthouse CI**: Performance auditing
- **Codecov**: Coverage reporting

## Design Decisions

### Why Svelte CSF for Stories?

**Decision:** Use `.stories.svelte` files instead of `.stories.ts`

**Rationale:**
- Better handling of Svelte 5 snippets
- More natural Svelte syntax
- Easier to write and maintain
- Better integration with Svelte components

### Why Separate Storybook Deployment?

**Decision:** Deploy Storybook separately from main app

**Rationale:**
- Independent documentation updates
- Separate environment configuration
- Clearer separation of concerns
- Easier to maintain

### Why Task-Based PR Scripts?

**Decision:** Create specialized scripts for spec-based PRs

**Rationale:**
- Automatic extraction of task context
- Links to requirements and design
- Consistent PR format
- Reduced manual work

### Why Multiple Workflows?

**Decision:** Separate workflows for CI, deploy, lighthouse, etc.

**Rationale:**
- Independent execution
- Clearer responsibilities
- Easier to debug
- Better performance (parallel execution)

## Integration Points

### Component Library → Forms

Reusable components are used in:
- LoginForm (Input, Button)
- TaskForm (Input, Textarea, Select, Button)

### CI/CD → GitHub Pages

Workflows deploy to:
- Main app: `https://username.github.io/repo/`
- Storybook: `https://username.github.io/repo/storybook/`

### PR Automation → Specs

Scripts integrate with:
- `.kiro/specs/*/tasks.md`
- `.kiro/specs/*/requirements.md`
- `.kiro/specs/*/design.md`

### Lighthouse → CI

Lighthouse CI integrates with:
- Pull request checks
- Status reporting
- Artifact uploads

## Future Enhancements

### Potential Additions
- Visual regression testing (Chromatic)
- E2E tests in CI (Playwright)
- Automated dependency updates (Renovate)
- Bundle size tracking
- Error tracking (Sentry)
- Analytics integration
