#!/bin/bash
# Generate PR description from commits
# Usage: .github/scripts/generate-pr-description.sh [base-branch]

BASE_BRANCH="${1:-main}"
CURRENT_BRANCH=$(git branch --show-current)

echo "## Description"
echo ""
echo "<!-- Auto-generated from commits -->"
echo ""

# Get first commit message as description
FIRST_COMMIT=$(git log $BASE_BRANCH..$CURRENT_BRANCH --format="%s" --reverse | head -n 1)
echo "$FIRST_COMMIT"
echo ""

echo "## Changes Made"
echo ""
git log $BASE_BRANCH..$CURRENT_BRANCH --format="- %s" --reverse
echo ""

echo "## Commits"
echo ""
git log $BASE_BRANCH..$CURRENT_BRANCH --format="- %h %s (%an)" --reverse
echo ""

echo "## Type of Change"
echo ""
echo "- [ ] 🐛 Bug fix"
echo "- [ ] ✨ New feature"
echo "- [ ] 💥 Breaking change"
echo "- [ ] 📝 Documentation update"
echo "- [ ] 🎨 Style/UI update"
echo "- [ ] ♻️ Code refactoring"
echo ""

echo "## Checklist"
echo ""
echo "- [ ] Code follows project style"
echo "- [ ] Self-reviewed"
echo "- [ ] Tests added/updated"
echo "- [ ] All tests pass"
echo "- [ ] Linting passes"
