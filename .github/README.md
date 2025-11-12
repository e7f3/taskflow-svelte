# GitHub Workflows & Automation

This directory contains GitHub-specific configurations, workflows, and automation scripts.

## 📁 Directory Structure

```
.github/
├── workflows/           # GitHub Actions CI/CD
│   ├── ci.yml          # Continuous Integration
│   └── deploy.yml      # GitHub Pages deployment
├── scripts/            # Automation scripts
│   ├── generate-pr-description.sh      # General PR description
│   ├── create-pr.sh                    # Create general PR
│   ├── generate-task-pr.sh             # Task-based PR description
│   └── create-task-pr.sh               # Create task-based PR
├── ISSUE_TEMPLATE/     # Issue templates
│   └── feature_request.md
├── pull_request_template.md            # Default PR template
└── docs/               # Documentation
    ├── README.md                       # This file
    ├── PR_QUICK_REFERENCE.md          # Quick command reference
    ├── PR_WORKFLOW.md                 # General PR workflow
    ├── TASK_PR_WORKFLOW.md            # Task-based PR workflow
    └── EXAMPLE_USAGE.md               # Usage examples
```

## 🚀 Quick Start

### For Spec Tasks

```bash
# After completing a task from .kiro/specs/*/tasks.md
pnpm pr:task:create 8.1
```

### For General Changes

```bash
# For any other changes
pnpm pr:create
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [PR_QUICK_REFERENCE.md](PR_QUICK_REFERENCE.md) | Quick command reference and comparison |
| [TASK_PR_WORKFLOW.md](TASK_PR_WORKFLOW.md) | Complete guide for task-based PRs |
| [PR_WORKFLOW.md](PR_WORKFLOW.md) | Complete guide for general PRs |
| [EXAMPLE_USAGE.md](EXAMPLE_USAGE.md) | Real-world examples |

## 🛠️ Available Commands

### Task-Based PRs

```bash
pnpm pr:task <task-number>              # Generate description
pnpm pr:task:create <task-number>       # Create PR
```

### General PRs

```bash
pnpm pr:description                     # Generate description
pnpm pr:create                          # Create PR
```

## 🔄 CI/CD Workflows

### Continuous Integration (`ci.yml`)

Runs on every PR and push to main:
- ✅ Linting (ESLint, Stylelint)
- ✅ Type checking (TypeScript)
- ✅ Unit tests (Vitest)
- ✅ Build verification

### Deployment (`deploy.yml`)

Deploys to GitHub Pages on push to main:
- 📦 Builds production bundle
- 📦 Builds Storybook
- 🚀 Deploys to GitHub Pages

## 📋 PR Templates

### Default Template

Located at `pull_request_template.md`, auto-fills when creating PRs via GitHub UI.

### Dynamic Generation

Scripts in `scripts/` directory generate PR descriptions from:
- Git commits
- Task specifications
- File changes
- Spec requirements

## 🔧 Setup

### Prerequisites

```bash
# Install GitHub CLI (for auto-create commands)
sudo apt install gh  # Ubuntu/Debian
brew install gh      # macOS

# Authenticate
gh auth login
```

### Make Scripts Executable

```bash
chmod +x .github/scripts/*.sh
```

## 💡 Best Practices

1. **Use task-based workflow** for spec work
2. **Write descriptive commits** - they become PR descriptions
3. **Review generated descriptions** before creating PRs
4. **Link related issues** in commit messages
5. **Keep commits atomic** - one logical change per commit

## 🐛 Troubleshooting

See individual workflow documentation for detailed troubleshooting:
- [TASK_PR_WORKFLOW.md#troubleshooting](TASK_PR_WORKFLOW.md#troubleshooting)
- [PR_WORKFLOW.md#troubleshooting](PR_WORKFLOW.md#troubleshooting)

## 📖 Examples

### Complete a Spec Task

```bash
# 1. Create branch
git checkout -b feature/task-8.1

# 2. Implement task
# ... make changes ...

# 3. Commit
git commit -m "Implement TaskForm component with validation"

# 4. Push and create PR
git push origin feature/task-8.1
pnpm pr:task:create 8.1
```

### Quick Bug Fix

```bash
# 1. Create branch
git checkout -b fix/validation-bug

# 2. Fix bug
# ... make changes ...

# 3. Commit
git commit -m "Fix email validation regex pattern"

# 4. Push and create PR
git push origin fix/validation-bug
pnpm pr:create
```

## 🔗 Related Documentation

- [CI/CD Documentation](../docs/CI-CD.md)
- [Contributing Guidelines](../CONTRIBUTING.md) *(if exists)*
- [Code Style Guide](../docs/ESLINT.md)

## 🤝 Contributing

When adding new automation:

1. Add scripts to `scripts/` directory
2. Make scripts executable
3. Add npm script to `package.json`
4. Document in appropriate workflow guide
5. Add examples to `EXAMPLE_USAGE.md`
6. Update this README

## 📝 Notes

- All scripts use bash and are Linux/macOS compatible
- GitHub CLI is optional but recommended
- Scripts extract data from git history and spec files
- Generated descriptions can be edited before creating PRs
