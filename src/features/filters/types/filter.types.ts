/**
 * Filter feature type definitions.
 *
 * This file contains types for filtering and searching tasks.
 */

import type { Priority } from '@/features/tasks/types/task.types';
import type { EntityId } from '@/shared/types/common.types';

/**
 * Active filter criteria for task list.
 * All filters are applied with AND logic (must match all active filters).
 *
 * Learning Note:
 * This interface defines the shape of our filters store.
 * When any field changes, Svelte's reactivity will automatically
 * re-filter the task list through a derived store.
 *
 * Example state:
 * {
 *   searchQuery: "bug",
 *   assigneeId: "1",
 *   priority: "high"
 * }
 * This would show only high-priority bugs assigned to user "1".
 */
export interface FilterState {
  /**
   * Text search query for filtering tasks.
   * Searches in both task title and description (case-insensitive).
   * Empty string means no search filter active.
   *
   * Implementation:
   * - Debounced by 300ms to avoid excessive filtering
   * - Case-insensitive matching
   * - Searches both title and description fields
   *
   * Example: "authentication", "bug", "urgent"
   */
  searchQuery: string;

  /**
   * Filter tasks by assigned user.
   * Null means show tasks for all users (no filter).
   * When set, only shows tasks assigned to this user ID.
   *
   * Special cases:
   * - null: Show all tasks regardless of assignee
   * - "unassigned": Show only unassigned tasks (assigneeId === null)
   * - specific ID: Show only tasks assigned to that user
   *
   * Example: "1", "2", null
   */
  assigneeId: EntityId | null;

  /**
   * Filter tasks by priority level.
   * Null means show tasks of all priorities (no filter).
   * When set, only shows tasks with matching priority.
   *
   * Used for:
   * - Focusing on high-priority work
   * - Hiding low-priority tasks
   * - Priority-based views
   *
   * Example: "high", "critical", null
   */
  priority: Priority | null;
}

/**
 * Options for the assignee filter dropdown.
 * Includes special "All" and "Unassigned" options plus all users.
 *
 * Learning Note:
 * This type helps build the filter dropdown UI with type safety.
 */
export interface AssigneeFilterOption {
  /**
   * Value to set in filterState.assigneeId.
   * null for "All", "unassigned" for unassigned tasks, or user ID.
   */
  value: EntityId | null | 'unassigned';

  /**
   * Display label for the dropdown option.
   * Example: "All Users", "Unassigned", "Alice Johnson"
   */
  label: string;
}

/**
 * Options for the priority filter dropdown.
 * Includes "All" option plus all priority levels.
 */
export interface PriorityFilterOption {
  /**
   * Value to set in filterState.priority.
   * null for "All" or a specific priority level.
   */
  value: Priority | null;

  /**
   * Display label for the dropdown option.
   * Example: "All Priorities", "High", "Critical"
   */
  label: string;
}
