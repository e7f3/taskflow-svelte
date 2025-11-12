#!/bin/bash
# Generate PR description from commits
# Usage: .github/scripts/generate-pr-description.sh [base-branch]

BASE_BRANCH="${1:-main}"
CURRENT_BRANCH=$(git branch --show-current)

# Check if there are commits
COMMIT_COUNT=$(git rev-list --count $BASE_BRANCH..$CURRENT_BRANCH 2>/dev/null || echo "0")

if [ "$COMMIT_COUNT" -eq "0" ]; then
    echo "No commits found between $BASE_BRANCH and $CURRENT_BRANCH"
    exit 1
fi

echo "## Description"
echo ""

# Get first commit message (full body) as description
# Use a delimiter to properly capture multi-line messages
FIRST_COMMIT=$(git log $BASE_BRANCH..$CURRENT_BRANCH --format="%B" --reverse -1)
echo "$FIRST_COMMIT"
echo ""

# Only show detailed changes if there are multiple commits
if [ "$COMMIT_COUNT" -gt "1" ]; then
    echo "## Detailed Changes"
    echo ""
    
    # Get all commit messages with full bodies
    git log $BASE_BRANCH..$CURRENT_BRANCH --reverse --format="### %s%n%n%b%n---" | sed 's/---$//'
    echo ""
fi

echo "## Files Changed"
echo ""
git diff --name-status $BASE_BRANCH..$CURRENT_BRANCH | head -n 20
echo ""

echo "## Commits ($COMMIT_COUNT)"
echo ""
git log $BASE_BRANCH..$CURRENT_BRANCH --format="- \`%h\` %s (%an, %ar)" --reverse
echo ""

echo "## Type of Change"
echo ""
echo "- [ ] 🐛 Bug fix"
echo "- [ ] ✨ New feature"
echo "- [ ] 💥 Breaking change"
echo "- [ ] 📝 Documentation update"
echo "- [ ] 🎨 Style/UI update"
echo "- [ ] ♻️ Code refactoring"
echo "- [ ] ⚡ Performance improvement"
echo "- [ ] ✅ Test update"
echo ""

echo "## Testing Checklist"
echo ""
echo "- [ ] Tested locally"
echo "- [ ] All tests pass (\`pnpm test\`)"
echo "- [ ] Linting passes (\`pnpm lint\` and \`pnpm lint:css\`)"
echo "- [ ] Type checking passes (\`pnpm check\`)"
echo "- [ ] Build succeeds (\`pnpm build\`)"
echo ""

echo "## Additional Notes"
echo ""
echo "<!-- Add any additional context, screenshots, or notes here -->"
