# PR Creation Quick Reference

## Choose Your Workflow

### 📋 Task-Based PR (Recommended for Spec Work)

When completing tasks from `.kiro/specs/*/tasks.md`:

```bash
# Generate PR description for task
pnpm pr:task 8.1

# Create PR automatically
pnpm pr:task:create 8.1

# With custom spec
pnpm pr:task:create 2.3 my-spec-name

# With custom base branch
pnpm pr:task:create 8.1 taskflow-app develop
```

**See:** [TASK_PR_WORKFLOW.md](TASK_PR_WORKFLOW.md)

---

### 🔧 General PR (For Non-Task Work)

For general changes not tied to a specific task:

```bash
# Generate PR description from commits
pnpm pr:description

# Create PR automatically
pnpm pr:create

# With custom base branch
pnpm pr:create develop
```

**See:** [PR_WORKFLOW.md](PR_WORKFLOW.md)

---

### 🖱️ Manual PR (GitHub UI)

Traditional approach:

1. Push branch: `git push origin your-branch`
2. Go to GitHub
3. Click "Create Pull Request"
4. Template auto-fills - edit as needed

---

## Command Comparison

| Command | Use Case | Output |
|---------|----------|--------|
| `pnpm pr:task 8.1` | Generate task PR description | Markdown to stdout |
| `pnpm pr:task:create 8.1` | Create task PR automatically | Creates PR on GitHub |
| `pnpm pr:description` | Generate general PR description | Markdown to stdout |
| `pnpm pr:create` | Create general PR automatically | Creates PR on GitHub |

## Prerequisites

### For `pr:task*` commands:
- Task exists in `.kiro/specs/*/tasks.md`
- Branch has commits
- (Optional) GitHub CLI for `pr:task:create`

### For `pr:create` commands:
- GitHub CLI installed and authenticated
- Branch pushed to remote

## Installation

### GitHub CLI (Required for auto-create)

```bash
# Ubuntu/Debian
sudo apt install gh

# macOS
brew install gh

# Authenticate
gh auth login
```

## Examples

### Example 1: Complete Task 8.1

```bash
git checkout -b feature/task-8.1
# ... make changes ...
git commit -m "Implement TaskForm component"
git push origin feature/task-8.1
pnpm pr:task:create 8.1
```

### Example 2: Quick Bug Fix

```bash
git checkout -b fix/validation-error
# ... fix bug ...
git commit -m "Fix email validation regex"
git push origin fix/validation-error
pnpm pr:create
```

### Example 3: Preview Before Creating

```bash
# Generate and review
pnpm pr:task 8.1 > pr.md
cat pr.md

# Edit if needed
nano pr.md

# Create manually with edited description
gh pr create --title "Task 8.1: ..." --body-file pr.md
```

## Tips

✅ **DO:**
- Use task-based workflow for spec work
- Write descriptive commit messages
- Review generated description before creating PR
- Use conventional commits for better categorization

❌ **DON'T:**
- Create PRs without commits
- Use vague commit messages like "wip" or "fix"
- Skip the review step
- Forget to link related issues

## Troubleshooting

**"Task not found"**
- Check task number format in tasks.md
- Ensure task number matches exactly (e.g., `8.1` not `8.1.`)

**"No commits found"**
- Verify you have commits: `git log main..HEAD`
- Check you're on the right branch

**"Permission denied"**
- Make scripts executable: `chmod +x .github/scripts/*.sh`

**"gh not found"**
- Install GitHub CLI (see Installation above)

## More Information

- **Task-based PRs:** [TASK_PR_WORKFLOW.md](TASK_PR_WORKFLOW.md)
- **General PRs:** [PR_WORKFLOW.md](PR_WORKFLOW.md)
- **Examples:** [EXAMPLE_USAGE.md](EXAMPLE_USAGE.md)
