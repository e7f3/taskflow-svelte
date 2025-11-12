#!/bin/bash
# Generate PR documentation after completing a task
# Usage: .github/scripts/generate-task-pr.sh <task-number> [spec-name]

TASK_NUMBER="$1"
SPEC_NAME="${2:-taskflow-app}"
BASE_BRANCH="${3:-main}"

if [ -z "$TASK_NUMBER" ]; then
    echo "Error: Task number required"
    echo "Usage: $0 <task-number> [spec-name] [base-branch]"
    echo "Example: $0 8.1 taskflow-app main"
    exit 1
fi

SPEC_DIR=".kiro/specs/$SPEC_NAME"
TASKS_FILE="$SPEC_DIR/tasks.md"
REQUIREMENTS_FILE="$SPEC_DIR/requirements.md"
DESIGN_FILE="$SPEC_DIR/design.md"

# Check if spec exists
if [ ! -f "$TASKS_FILE" ]; then
    echo "Error: Tasks file not found at $TASKS_FILE"
    exit 1
fi

# Extract task details from tasks.md
TASK_LINE=$(grep -E "^\s*-\s*\[.\]\s*${TASK_NUMBER}\s+" "$TASKS_FILE" | head -n 1)
TASK_TITLE=$(echo "$TASK_LINE" | sed -E 's/^\s*-\s*\[.\]\s*[0-9.]+\*?\s*//')

if [ -z "$TASK_TITLE" ]; then
    echo "Error: Task $TASK_NUMBER not found in $TASKS_FILE"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Get commits since base branch
COMMITS=$(git log $BASE_BRANCH..$CURRENT_BRANCH --format="- %s" --reverse 2>/dev/null)
COMMIT_COUNT=$(git rev-list --count $BASE_BRANCH..$CURRENT_BRANCH 2>/dev/null || echo "0")

# Get changed files
CHANGED_FILES=$(git diff --name-only $BASE_BRANCH..$CURRENT_BRANCH 2>/dev/null | head -n 20)
FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l)

# Extract related requirements (look for Requirements: mentions in task)
REQUIREMENTS=$(grep -A 20 "^\s*-\s*\[.\]\s*${TASK_NUMBER}\s+" "$TASKS_FILE" | grep -E "_Requirements:|_Requirement:" | sed 's/.*_Requirements*: *//' | sed 's/_$//')

# Generate PR description
cat << EOF
## Task: $TASK_TITLE

**Task Number:** $TASK_NUMBER  
**Spec:** $SPEC_NAME  
**Branch:** $CURRENT_BRANCH

## Description

Completed task $TASK_NUMBER from the $SPEC_NAME specification.

$TASK_TITLE

## Related Requirements

$REQUIREMENTS

## Changes Made

$COMMITS

## Files Changed ($FILE_COUNT files)

\`\`\`
$CHANGED_FILES
\`\`\`

## Commits ($COMMIT_COUNT commits)

$(git log $BASE_BRANCH..$CURRENT_BRANCH --format="- \`%h\` %s (%an, %ar)" --reverse 2>/dev/null)

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI update
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update
- [ ] 🔧 Configuration change

## Testing Checklist

- [ ] Tested locally
- [ ] All tests pass (\`pnpm test\`)
- [ ] Linting passes (\`pnpm lint\` and \`pnpm lint:css\`)
- [ ] Type checking passes (\`pnpm check\`)
- [ ] Build succeeds (\`pnpm build\`)
- [ ] Storybook stories updated (if applicable)

## Spec References

- **Tasks:** [\`$TASKS_FILE\`]($TASKS_FILE)
- **Requirements:** [\`$REQUIREMENTS_FILE\`]($REQUIREMENTS_FILE)
- **Design:** [\`$DESIGN_FILE\`]($DESIGN_FILE)

## Additional Notes

<!-- Add any additional context, screenshots, or notes here -->

---

**Generated automatically from task $TASK_NUMBER**
EOF
