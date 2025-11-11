---
inclusion: always
---

# TaskFlow Product Overview

TaskFlow is a simplified task tracking application inspired by Monday.com, designed as a learning project for Svelte 5. It demonstrates modern frontend development patterns with a focus on practical, real-world application architecture.

## Core Features

- **Task Management**: Create, edit, delete, and organize tasks across board columns
- **Drag & Drop**: Native browser drag-and-drop for moving tasks between status columns
- **Mock Authentication**: Simulated login system with predefined user accounts (alice, bob, charlie - all use password: password123)
- **Filtering & Search**: Filter tasks by assignee, priority, or search text
- **Local Persistence**: All data stored in browser localStorage for session continuity
- **Responsive Design**: Works on desktop and tablet devices

## Task Structure

Tasks contain:
- Title (required, min 3 characters)
- Description (optional)
- Status: "todo", "inProgress", or "done"
- Priority: "low", "medium", "high", or "critical"
- Assignee (optional, from predefined user list)

## User Accounts

Mock users for testing:
- Alice Johnson (👩‍💼) - username: alice
- Bob Smith (👨‍💻) - username: bob
- Charlie Davis (👨‍🎨) - username: charlie

All passwords: password123
