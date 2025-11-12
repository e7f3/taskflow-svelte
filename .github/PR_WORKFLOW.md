# Pull Request Workflow

This document explains how to use PR templates and automation in this project.

## Quick Start

### Option 1: Manual PR (GitHub UI)

1. Push your branch: `git push origin your-branch`
2. Go to GitHub and click "Create Pull Request"
3. The template will auto-fill - edit as needed

### Option 2: Generate PR Description Locally

Generate a PR description from your commits:

```bash
pnpm pr:description
```

This outputs a formatted description you can copy/paste into GitHub.

### Option 3: Create PR with GitHub CLI (Recommended)

Automatically create a PR with description from commits:

```bash
pnpm pr:create
```

This requires [GitHub CLI](https://cli.github.com/) to be installed and authenticated.

## How It Works

### Static Template

The file `.github/pull_request_template.md` is used by GitHub when creating PRs through the UI. It provides a consistent structure but requires manual filling.

### Dynamic Generation

The scripts in `.github/scripts/` generate PR descriptions from your commit messages:

**`generate-pr-description.sh`**
- Extracts commit messages from your branch
- Formats them into a PR description
- Includes checklist and type of change

**`create-pr.sh`**
- Uses `generate-pr-description.sh` to create description
- Automatically creates PR using GitHub CLI
- Sets title from branch name

## Best Practices

### Write Good Commit Messages

Since PR descriptions are generated from commits, write clear messages:

```bash
# Good
git commit -m "Add reusable Button component with variants"
git commit -m "Fix input validation error handling"

# Bad
git commit -m "wip"
git commit -m "fix stuff"
```

### Conventional Commits (Optional)

Consider using conventional commit format:

```bash
git commit -m "feat: add Button component with primary/secondary variants"
git commit -m "fix: resolve input validation edge case"
git commit -m "docs: update component usage examples"
git commit -m "refactor: extract common form logic"
```

The scripts can be enhanced to parse these and auto-categorize changes.

## Advanced: Auto-Categorize Changes

You can enhance `generate-pr-description.sh` to detect change types from commits:

```bash
# Detect type from conventional commits
if echo "$COMMITS" | grep -q "^feat:"; then
    echo "- [x] ✨ New feature"
else
    echo "- [ ] ✨ New feature"
fi
```

## GitHub Actions Integration (Future)

You could create a GitHub Action to:
1. Auto-comment on PRs with commit summary
2. Validate PR description completeness
3. Auto-label PRs based on changes

Example workflow:

```yaml
name: PR Description Check
on:
  pull_request:
    types: [opened, edited]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR description
        run: |
          if [ -z "${{ github.event.pull_request.body }}" ]; then
            echo "::error::PR description is empty"
            exit 1
          fi
```

## Tips

1. **Keep commits atomic** - One logical change per commit
2. **Squash before PR** - If you have many WIP commits, squash them
3. **Review generated description** - Always review before creating PR
4. **Update template** - Customize `.github/pull_request_template.md` for your needs

## Troubleshooting

**Script not executable:**
```bash
chmod +x .github/scripts/*.sh
```

**GitHub CLI not found:**
```bash
# Install gh CLI
# Ubuntu/Debian
sudo apt install gh

# macOS
brew install gh

# Then authenticate
gh auth login
```

**Wrong base branch:**
```bash
# Specify base branch
pnpm pr:create main
# or
.github/scripts/generate-pr-description.sh develop
```
