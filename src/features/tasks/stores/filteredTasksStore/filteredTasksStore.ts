/**
 * Filtered Tasks Store
 *
 * Derived store that combines tasks and filters to provide filtered task data.
 * This separates filtering logic from UI components.
 *
 * Learning Note - Derived Stores:
 * Derived stores automatically recompute when their dependencies change.
 * This is perfect for filtering logic - when either tasks or filters change,
 * the filtered results update automatically.
 */

import { derived } from 'svelte/store';
import { filtersStore } from '../filtersStore/filtersStore';
import { tasksStore } from '../tasksStore/tasksStore';

/**
 * Derived store that provides filtered tasks.
 *
 * Combines tasksStore and filtersStore to automatically filter tasks
 * based on current filter criteria.
 */
export const filteredTasksStore = derived(
  [tasksStore, filtersStore],
  ([$tasks, $filters]) => {
    return $tasks.filter((task) => {
      // Search filter (case-insensitive, checks title and description)
      if ($filters.searchQuery) {
        const query = $filters.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description
          ?.toLowerCase()
          .includes(query);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      // Assignee filter
      if ($filters.assigneeId) {
        if (task.assignee?.id !== $filters.assigneeId) {
          return false;
        }
      }

      // Priority filter
      if ($filters.priority) {
        if (task.priority !== $filters.priority) {
          return false;
        }
      }

      return true;
    });
  },
);

/**
 * Priority order mapping for sorting.
 * Higher number = higher priority.
 *
 * Learning Note - Priority Sorting:
 * We map priority strings to numbers so we can sort numerically.
 * This ensures critical tasks appear first, then high, medium, low.
 */
const PRIORITY_ORDER = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;

/**
 * Sorts tasks by priority (critical → high → medium → low).
 *
 * Learning Note:
 * Array.sort() with a comparator function.
 * Negative return = a comes first
 * Positive return = b comes first
 * Zero = keep original order
 */
function sortByPriority<T extends { priority: string }>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    const priorityA = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] || 0;
    const priorityB = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] || 0;
    return priorityB - priorityA; // Descending order (highest priority first)
  });
}

/**
 * Derived stores for tasks by status.
 *
 * These automatically filter the already-filtered tasks by status
 * and sort them by priority (critical → high → medium → low).
 *
 * Triple transformation: tasks → filters → status → priority sort
 */
export const filteredTodoTasks = derived(filteredTasksStore, ($filteredTasks) =>
  sortByPriority($filteredTasks.filter((task) => task.status === 'todo')),
);

export const filteredInProgressTasks = derived(
  filteredTasksStore,
  ($filteredTasks) =>
    sortByPriority(
      $filteredTasks.filter((task) => task.status === 'in-progress'),
    ),
);

export const filteredDoneTasks = derived(filteredTasksStore, ($filteredTasks) =>
  sortByPriority($filteredTasks.filter((task) => task.status === 'done')),
);
