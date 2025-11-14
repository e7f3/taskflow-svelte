/**
 * Type definitions for the tasks store.
 *
 * Learning Note:
 * We extend EntityStore to get all the standard CRUD operations,
 * then add task-specific methods like moveTask.
 *
 * This is cleaner than defining everything manually!
 */

import type { EntityStore } from '@/shared/stores/createEntityStore';
import type { EntityId } from '@/shared/types/common.types';
import type { Task, TaskStatus } from '../../types/task.types';

/**
 * Tasks store interface.
 * Extends EntityStore with task-specific operations.
 *
 * Learning Note:
 * By extending EntityStore, we get:
 * - subscribe, set, update (from Writable)
 * - addOne, addMany, updateOne, updateMany (CRUD)
 * - removeOne, removeMany, setAll, removeAll (more CRUD)
 * - selectById, selectAll, selectByIds (selectors)
 *
 * We only need to add task-specific methods!
 */
export interface TasksStore extends EntityStore<Task> {
  /**
   * Moves a task to a different status column.
   * Convenience method for drag-and-drop operations.
   *
   * This is task-specific logic, so we add it here.
   * It's just a wrapper around updateOne, but more semantic.
   *
   * @param taskId - ID of task to move
   * @param newStatus - Target status column
   *
   * @example
   * ```typescript
   * // Move task from 'todo' to 'in-progress'
   * tasksStore.moveTask('task-1', 'in-progress');
   * ```
   */
  moveTask(taskId: EntityId, newStatus: TaskStatus): void;
}
