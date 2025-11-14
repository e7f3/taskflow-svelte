/**
 * Filter Store Types
 *
 * Defines the shape of the filter state used to filter tasks.
 *
 * Learning Note:
 * Separating types into their own file makes them reusable
 * and keeps the store implementation clean.
 */

import type { Priority } from '@/features/tasks/types/task.types';
import type { EntityId } from '@/shared/types/common.types';

/**
 * Filter state for task filtering.
 *
 * All filters are optional - when undefined, that filter is not applied.
 * Multiple filters are combined with AND logic.
 */
export interface FilterState {
  /**
   * Search query to filter by task title or description.
   * Case-insensitive partial match.
   */
  searchQuery?: string;

  /**
   * Filter by assignee ID.
   * Only shows tasks assigned to this user.
   */
  assigneeId?: EntityId;

  /**
   * Filter by priority level.
   * Only shows tasks with this priority.
   */
  priority?: Priority;
}
