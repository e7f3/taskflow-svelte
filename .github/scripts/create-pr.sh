#!/bin/bash
# Create PR with auto-generated description from commits
# Usage: .github/scripts/create-pr.sh [base-branch]

BASE_BRANCH="${1:-main}"
CURRENT_BRANCH=$(git branch --show-current)

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Generate description
DESCRIPTION=$(.github/scripts/generate-pr-description.sh "$BASE_BRANCH")

# Get title from branch name or first commit
TITLE=$(echo "$CURRENT_BRANCH" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

# Create PR with generated description
echo "Creating PR: $TITLE"
echo ""
echo "$DESCRIPTION" | gh pr create --title "$TITLE" --body-file -

echo ""
echo "✅ PR created successfully!"
