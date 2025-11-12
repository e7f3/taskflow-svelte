# Task-Based PR Workflow

This guide explains how to automatically generate PR documentation after completing tasks from your spec.

## Quick Start

After completing a task from `.kiro/specs/taskflow-app/tasks.md`:

```bash
# Generate PR description for task 8.1
pnpm pr:task 8.1

# Or create PR automatically
pnpm pr:task:create 8.1
```

## How It Works

The scripts extract information from:
1. **Task file** (`.kiro/specs/*/tasks.md`) - Task title and requirements
2. **Git commits** - Changes made during task implementation
3. **Git diff** - Files changed
4. **Spec files** - Links to requirements and design docs

This generates a comprehensive PR description automatically.

## Usage Examples

### Example 1: Simple Task PR

```bash
# You just completed task 8.1
git add .
git commit -m "Implement TaskForm component with validation"
git push origin feature/task-8.1

# Generate PR description
pnpm pr:task 8.1
```

**Output:**
```markdown
## Task: Implement TaskForm component

**Task Number:** 8.1
**Spec:** taskflow-app
**Branch:** feature/task-8.1

## Description

Completed task 8.1 from the taskflow-app specification.

Implement TaskForm component

## Changes Made

- Implement TaskForm component with validation
- Add form field validation
- Create modal dialog wrapper

## Files Changed (5 files)

src/features/tasks/components/TaskForm/TaskForm.svelte
src/features/tasks/components/TaskForm/TaskForm.module.css
...
```

### Example 2: Create PR Automatically

```bash
# Complete task and create PR in one go
pnpm pr:task:create 8.1

# With custom spec name
pnpm pr:task:create 2.3 my-feature-spec

# With custom base branch
pnpm pr:task:create 8.1 taskflow-app develop
```

### Example 3: Multiple Commits Per Task

```bash
# Make multiple commits while working on task
git commit -m "Add TaskForm component structure"
git commit -m "Implement form validation logic"
git commit -m "Add error handling and loading states"
git commit -m "Create Storybook stories for TaskForm"

# All commits will be included in PR description
pnpm pr:task:create 8.1
```

## Workflow Integration

### Recommended Workflow

1. **Start task** - Create branch from task number
   ```bash
   git checkout -b feature/task-8.1
   ```

2. **Work on task** - Make commits as you progress
   ```bash
   git commit -m "Implement core functionality"
   git commit -m "Add tests"
   git commit -m "Update documentation"
   ```

3. **Complete task** - Mark as done in tasks.md
   ```bash
   # Update tasks.md: - [x] 8.1 Task description
   git add .kiro/specs/taskflow-app/tasks.md
   git commit -m "Mark task 8.1 as complete"
   ```

4. **Create PR** - Auto-generate from task
   ```bash
   git push origin feature/task-8.1
   pnpm pr:task:create 8.1
   ```

### Git Commit Best Practices

Write clear, descriptive commits that will look good in PR:

**Good:**
```bash
git commit -m "Add TaskForm component with field validation

- Implement form state management with Svelte 5 runes
- Add validation for required fields
- Create reusable form field components"
```

**Bad:**
```bash
git commit -m "wip"
git commit -m "fix"
git commit -m "update stuff"
```

## Advanced Usage

### Custom Spec Location

If your spec is in a different location:

```bash
# Specify spec name
pnpm pr:task 3.2 my-custom-spec

# Full command
.github/scripts/generate-task-pr.sh 3.2 my-custom-spec main
```

### Different Base Branch

For feature branches off develop:

```bash
pnpm pr:task:create 8.1 taskflow-app develop
```

### Preview Before Creating

Generate description first, review it, then create:

```bash
# 1. Generate and review
pnpm pr:task 8.1 > pr-description.md
cat pr-description.md

# 2. Edit if needed
nano pr-description.md

# 3. Create PR with edited description
gh pr create --title "Task 8.1: ..." --body-file pr-description.md
```

## What Gets Included

The generated PR includes:

### 1. Task Information
- Task number and title
- Spec name
- Current branch

### 2. Related Requirements
- Extracted from task details in tasks.md
- Links to requirement numbers

### 3. Changes Made
- List of all commit messages
- Formatted as bullet points

### 4. Files Changed
- All modified files
- File count

### 5. Commit History
- Detailed commit log with hashes
- Author and timestamp

### 6. Spec References
- Links to tasks.md
- Links to requirements.md
- Links to design.md

### 7. Checklists
- Type of change checkboxes
- Testing checklist
- Code quality checks

## Troubleshooting

### Task Not Found

```bash
Error: Task 8.1 not found in .kiro/specs/taskflow-app/tasks.md
```

**Solution:** Check task number format in tasks.md:
```markdown
- [ ] 8.1 Task description  ✓ Correct
- [ ] 8.1. Task description  ✗ Wrong (extra dot)
- [ ] Task 8.1 description   ✗ Wrong (number not at start)
```

### No Commits Found

```bash
Commits (0 commits)
```

**Solution:** Make sure you have commits on your branch:
```bash
git log main..HEAD --oneline
```

### Script Not Executable

```bash
Permission denied: .github/scripts/generate-task-pr.sh
```

**Solution:**
```bash
chmod +x .github/scripts/*.sh
```

### GitHub CLI Not Authenticated

```bash
Error: GitHub CLI (gh) is not installed
```

**Solution:**
```bash
# Install gh CLI
sudo apt install gh  # Ubuntu/Debian
brew install gh      # macOS

# Authenticate
gh auth login
```

## Integration with Task Management

### Update Steering Rules

Add to `.kiro/steering/workflow.md`:

```markdown
## Task Completion Workflow

1. Complete task implementation
2. Run tests: `pnpm test`
3. Run linting: `pnpm format`
4. Commit changes with descriptive message
5. Generate PR: `pnpm pr:task:create <task-number>`
6. Review PR on GitHub
7. Request review from team
```

### Git Hooks (Optional)

Create `.git/hooks/pre-push` to remind about PR creation:

```bash
#!/bin/bash
BRANCH=$(git branch --show-current)

if [[ $BRANCH == feature/task-* ]]; then
    TASK_NUM=$(echo $BRANCH | sed 's/feature\/task-//')
    echo ""
    echo "💡 Tip: Create PR with: pnpm pr:task:create $TASK_NUM"
    echo ""
fi
```

## Tips

1. **Branch naming** - Use `feature/task-X.Y` format for automatic task detection
2. **Atomic commits** - One logical change per commit
3. **Descriptive messages** - Commits become PR description
4. **Review before push** - Check generated description locally first
5. **Link issues** - Mention issue numbers in commits for auto-linking

## Example: Complete Workflow

```bash
# 1. Start new task
git checkout -b feature/task-8.1

# 2. Implement task
# ... make changes ...

# 3. Commit work
git add .
git commit -m "Implement TaskForm component

- Add form structure with Svelte 5 runes
- Implement field validation
- Add error handling
- Create modal dialog wrapper

Requirements: 8.1, 8.2"

# 4. Add tests
git commit -m "Add TaskForm tests

- Test form validation
- Test error states
- Test submission flow"

# 5. Update documentation
git commit -m "Add TaskForm documentation

- Create Storybook stories
- Update component README"

# 6. Mark task complete
# Edit .kiro/specs/taskflow-app/tasks.md
git add .kiro/specs/taskflow-app/tasks.md
git commit -m "Mark task 8.1 as complete"

# 7. Push and create PR
git push origin feature/task-8.1
pnpm pr:task:create 8.1

# 8. Review PR on GitHub and merge
```

This creates a well-documented PR with all context from your task!
