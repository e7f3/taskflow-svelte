#!/bin/bash
# Create PR for a completed task with auto-generated description
# Usage: .github/scripts/create-task-pr.sh <task-number> [spec-name] [base-branch]

TASK_NUMBER="$1"
SPEC_NAME="${2:-taskflow-app}"
BASE_BRANCH="${3:-main}"

if [ -z "$TASK_NUMBER" ]; then
    echo "Error: Task number required"
    echo "Usage: $0 <task-number> [spec-name] [base-branch]"
    echo "Example: $0 8.1 taskflow-app main"
    exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Generate description
DESCRIPTION=$(.github/scripts/generate-task-pr.sh "$TASK_NUMBER" "$SPEC_NAME" "$BASE_BRANCH")

if [ $? -ne 0 ]; then
    echo "Error generating PR description"
    exit 1
fi

# Extract task title for PR title
SPEC_DIR=".kiro/specs/$SPEC_NAME"
TASKS_FILE="$SPEC_DIR/tasks.md"
TASK_LINE=$(grep -E "^\s*-\s*\[.\]\s*${TASK_NUMBER}\s+" "$TASKS_FILE" | head -n 1)
TASK_TITLE=$(echo "$TASK_LINE" | sed -E 's/^\s*-\s*\[.\]\s*[0-9.]+\*?\s*//')

# Create PR title
PR_TITLE="Task $TASK_NUMBER: $TASK_TITLE"

# Create PR with generated description
echo "Creating PR: $PR_TITLE"
echo ""
echo "$DESCRIPTION" | gh pr create \
    --title "$PR_TITLE" \
    --body-file - \
    --base "$BASE_BRANCH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ PR created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Review the PR on GitHub"
    echo "2. Add screenshots if needed"
    echo "3. Check off completed items in the checklist"
    echo "4. Request review from team members"
else
    echo ""
    echo "❌ Failed to create PR"
    exit 1
fi
