/**
 * Tasks store implementation using createEntityStore.
 * 
 * Learning Note - Before and After:
 * 
 * BEFORE (manual implementation):
 * - ~100 lines of code
 * - Manually implement each CRUD method
 * - Repeat patterns for add, update, remove
 * 
 * AFTER (using factory):
 * - ~20 lines of code
 * - Get all CRUD methods for free
 * - Only implement task-specific logic
 * 
 * This is the power of reusable utilities!
 */

import { createEntityStore } from '@/shared/stores/createEntityStore';
import type { Task, TaskStatus } from '../types/task.types';
import type { TasksStore } from './tasksStore.types';
import type { EntityId } from '@/shared/types/common.types';

/**
 * Creates the tasks store with entity operations.
 * 
 * Learning Note:
 * We use createEntityStore to get all the standard CRUD operations,
 * then add task-specific methods on top.
 * 
 * This is like extending a class, but with composition!
 * 
 * @returns Typed tasks store implementing TasksStore interface
 */
function createTasksStore(): TasksStore {
  /*
   * Create base entity store.
   * This gives us all the CRUD operations automatically!
   */
  const baseStore = createEntityStore<Task>();

  /*
   * Return store with all base methods plus task-specific ones.
   * 
   * Learning Note:
   * We spread the baseStore to get all its methods,
   * then add our custom moveTask method.
   * 
   * This is composition - we're building on top of existing functionality!
   */
  return {
    ...baseStore,

    moveTask(taskId: EntityId, newStatus: TaskStatus) {
      /*
       * Move task by updating its status.
       * This is just a convenience wrapper around updateOne.
       * 
       * Learning Note:
       * We could call baseStore.updateOne directly in components,
       * but having a dedicated moveTask method makes the code more readable:
       * 
       * tasksStore.moveTask('1', 'done')  // Clear intent!
       * vs
       * tasksStore.updateOne('1', { status: 'done' })  // Less clear
       */
      baseStore.updateOne(taskId, { status: newStatus });
    },
  };
}

/**
 * Global tasks store instance.
 * Import and use this in components and services.
 * 
 * Learning Note:
 * This store now has all these methods:
 * 
 * From EntityStore:
 * - subscribe, set, update (Writable interface)
 * - addOne(task), addMany(tasks)
 * - updateOne(id, changes), updateMany(updates)
 * - removeOne(id), removeMany(ids)
 * - setAll(tasks), removeAll()
 * - selectById(id), selectAll(), selectByIds(ids)
 * 
 * Task-specific:
 * - moveTask(id, status)
 * 
 * All with just ~20 lines of code!
 * 
 * @example
 * ```svelte
 * <script>
 *   import { tasksStore } from '@/features/tasks/stores/tasksStore';
 *   
 *   // Use entity store methods
 *   tasksStore.addOne(newTask);
 *   tasksStore.updateOne('1', { title: 'Updated' });
 *   tasksStore.removeOne('1');
 *   
 *   // Use task-specific method
 *   tasksStore.moveTask('1', 'done');
 *   
 *   // Use selectors
 *   let task = $derived($tasksStore.selectById('1'));
 *   let allTasks = $derived($tasksStore);
 * </script>
 * ```
 */
export const tasksStore = createTasksStore();

/*
 * Re-export types for convenience.
 */
export type { TasksStore } from './tasksStore.types';

/*
 * Learning Note - Why this is better:
 * 
 * 1. Less code:
 *    - Manual: ~100 lines
 *    - Factory: ~20 lines
 * 
 * 2. Consistent API:
 *    - All entity stores use same methods
 *    - Easy to learn and remember
 *    - Predictable behavior
 * 
 * 3. Maintainable:
 *    - Bug fixes in one place (createEntityStore)
 *    - Easy to add features to all stores
 *    - Clear separation of concerns
 * 
 * 4. Flexible:
 *    - Can still add custom methods (like moveTask)
 *    - Can override base methods if needed
 *    - Full control when necessary
 * 
 * This is professional Svelte code!
 */
