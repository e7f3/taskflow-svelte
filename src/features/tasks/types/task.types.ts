/**
 * Task management feature type definitions.
 *
 * This file contains all types related to tasks, including
 * task data, status, priority, and operations.
 */

import type { EntityId, Timestamp } from '@/shared/types/common.types';

/**
 * Represents the current status/stage of a task in the workflow.
 * Tasks progress from 'todo' → 'in-progress' → 'done'.
 *
 * Learning Note:
 * Using string literal unions instead of enums gives better
 * TypeScript inference and is more idiomatic in modern TS.
 *
 * Mapping to columns:
 * - 'todo' → "To Do" column
 * - 'in-progress' → "In Progress" column
 * - 'done' → "Done" column
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export const PRIORITY_VALUES = ['low', 'medium', 'high', 'critical'] as const;

/**
 * Priority level for task urgency and importance.
 * Used for visual indicators (colored bars) and filtering.
 *
 * Visual representation:
 * - 'low' → Gray (#c4c4c4)
 * - 'medium' → Orange (#fdab3d)
 * - 'high' → Red (#ff6b6b)
 * - 'critical' → Dark Red (#e44258)
 */
export type Priority = typeof PRIORITY_VALUES[number];

/**
 * Lightweight assignee info embedded in tasks.
 * Contains just enough data for display without full User object.
 *
 * Learning Note:
 * In production, your API would return this nested in the task.
 * This avoids N+1 queries and unnecessary lookups.
 *
 * Example API response:
 * {
 *   "id": "1",
 *   "title": "Task",
 *   "assignee": { "id": "1", "name": "Alice", "avatar": "👩‍💼" }
 * }
 */
export interface TaskAssignee {
  /**
   * User ID.
   */
  id: EntityId;

  /**
   * Display name.
   */
  name: string;

  /**
   * Avatar emoji or image URL.
   */
  avatar?: string;
}

/**
 * Represents a single task/work item in the system.
 * Tasks can be created, edited, moved between columns, and deleted.
 *
 * Learning Note:
 * In Svelte, when you update a task object in a store, Svelte's
 * reactivity automatically updates all components using that task.
 * No need for immutable updates like in Redux!
 */
export interface Task {
  /**
   * Unique identifier for the task.
   * Generated using crypto.randomUUID().
   *
   * Used as:
   * - Key in {#each} blocks for efficient rendering
   * - Reference for updates and deletes
   * - Drag-and-drop data transfer
   *
   * Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  id: EntityId;

  /**
   * Short descriptive title of the task.
   * Displayed prominently on task cards.
   *
   * Constraints:
   * - Required field
   * - Minimum length: 3 characters
   * - Maximum length: ~100 characters (UI constraint)
   *
   * Example: "Implement user authentication", "Fix navigation bug"
   */
  title: string;

  /**
   * Detailed description of the task requirements.
   * Optional field, can be empty string.
   * Supports multi-line text.
   *
   * Displayed in:
   * - Task card (truncated)
   * - Task edit form (full text)
   * - Search results
   *
   * Example: "Add login form with email and password fields.
   * Validate inputs and show error messages."
   */
  description: string;

  /**
   * Current workflow status of the task.
   * Determines which column the task appears in.
   *
   * Changed by:
   * - Drag-and-drop between columns
   * - Edit form status dropdown
   *
   * Default: 'todo' for new tasks
   */
  status: TaskStatus;

  /**
   * Priority level for the task.
   * Affects visual styling (colored bar on left of card).
   * Can be used for filtering and sorting.
   *
   * Default: 'medium' for new tasks
   */
  priority: Priority;

  /**
   * Assigned user information.
   * Null if task is unassigned.
   *
   * Learning Note:
   * We embed assignee data in the task (denormalized).
   * This is more realistic and performant than storing just an ID
   * and doing lookups for every task card render.
   *
   * In production, your API would include this nested data.
   *
   * Used for:
   * - Displaying assignee name and avatar on task card
   * - Filtering tasks by assignee
   * - "My tasks" view
   *
   * Example: { id: "1", name: "Alice", avatar: "👩‍💼" }
   */
  assignee: TaskAssignee | null;

  /**
   * Timestamp (milliseconds since epoch) when task was created.
   * Set automatically on task creation using Date.now().
   * Never modified after creation.
   *
   * Used for:
   * - Sorting tasks by creation date
   * - Displaying "created X days ago"
   * - Audit trail
   *
   * Example: 1704067200000 (2024-01-01 00:00:00 UTC)
   */
  createdAt: Timestamp;

  /**
   * Timestamp (milliseconds since epoch) of last modification.
   * Updated whenever task properties change using Date.now().
   *
   * Used for:
   * - Sorting by recently updated
   * - Displaying "updated X minutes ago"
   * - Audit trail
   *
   * Example: 1704153600000 (2024-01-02 00:00:00 UTC)
   */
  updatedAt: Timestamp;

  /**
   * ID of the user who created this task.
   * References the authenticated user at creation time.
   * Never changes after creation.
   *
   * Used for:
   * - Audit trail
   * - "Created by" display
   * - Filtering tasks created by specific users
   *
   * Example: "1", "2"
   */
  createdBy: EntityId;
}

/**
 * Data required to create a new task.
 * Omits fields that are auto-generated (id, timestamps, createdBy).
 *
 * Learning Note:
 * TypeScript's utility types like Omit are powerful for deriving
 * types from existing interfaces. This ensures consistency.
 *
 * Used by:
 * - TaskForm component (create mode)
 * - taskService.createTask()
 */
export type CreateTaskData = Omit<
  Task,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy'
>;

/**
 * Data that can be updated on an existing task.
 * All fields are optional - only provided fields will be updated.
 *
 * Learning Note:
 * Partial<T> makes all properties optional. Combined with Pick,
 * we can specify exactly which fields are updatable.
 *
 * Used by:
 * - TaskForm component (edit mode)
 * - taskService.updateTask()
 */
export type UpdateTaskData = Partial<
  Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assignee'>
>;

/**
 * Helper type for grouping tasks by status.
 * Used in Board component to organize tasks into columns.
 *
 * Learning Note:
 * Record<K, V> creates an object type with keys of type K and values of type V.
 * This is more type-safe than using a plain object.
 *
 * Example:
 * {
 *   'todo': [task1, task2],
 *   'in-progress': [task3],
 *   'done': [task4, task5]
 * }
 */
export type TasksByStatus = Record<TaskStatus, Task[]>;

/**
 * Result of submitting new / edited task
 */
export type TaskSaveResult =
| {
  success: true;
  task: Task;
} | {
  success: false;
  error: string;
}
