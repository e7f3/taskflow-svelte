/**
 * Type definitions for the task service.
 * 
 * Learning Note:
 * Services handle business logic - validation, persistence, coordination.
 * Stores just hold state. This separation keeps code clean and testable.
 */

import type { Task, TaskStatus, CreateTaskData, UpdateTaskData } from '../types/task.types';
import type { EntityId } from '@/shared/types/common.types';

/**
 * Task service interface.
 * Defines all task-related business operations.
 * 
 * Learning Note:
 * This service coordinates between:
 * - tasksStore (state management)
 * - storageService (persistence)
 * - authStore (current user for createdBy)
 * 
 * In Redux, this would be thunks or sagas.
 * In Svelte, it's just a plain object with methods!
 */
export interface TaskService {
  /**
   * Creates a new task with provided data.
   * Generates ID and timestamps automatically.
   * Sets createdBy to current user.
   * 
   * Flow:
   * 1. Get current user from authStore
   * 2. Generate unique ID
   * 3. Add timestamps
   * 4. Add to tasksStore
   * 5. Persist to storage
   * 6. Return created task
   * 
   * @param taskData - Task data without id, timestamps, createdBy
   * @returns The created task object
   * 
   * @example
   * ```typescript
   * const task = taskService.createTask({
   *   title: 'New task',
   *   description: 'Task details',
   *   status: 'todo',
   *   priority: 'high',
   *   assigneeId: '1'
   * });
   * ```
   */
  createTask(taskData: CreateTaskData): Promise<Task>;

  /**
   * Updates an existing task with new data.
   * Automatically updates the updatedAt timestamp.
   * 
   * Flow:
   * 1. Update task in tasksStore
   * 2. Persist to storage
   * 
   * @param taskId - ID of task to update
   * @param changes - Partial task data to merge
   * 
   * @example
   * ```typescript
   * taskService.updateTask('task-1', { 
   *   title: 'Updated title',
   *   priority: 'critical'
   * });
   * ```
   */
  updateTask(taskId: EntityId, changes: UpdateTaskData): void;

  /**
   * Deletes a task by ID.
   * 
   * Flow:
   * 1. Remove from tasksStore
   * 2. Persist to storage
   * 
   * @param taskId - ID of task to delete
   * 
   * @example
   * ```typescript
   * taskService.deleteTask('task-1');
   * ```
   */
  deleteTask(taskId: EntityId): void;

  /**
   * Moves a task to a different status column.
   * Used for drag-and-drop operations.
   * 
   * Flow:
   * 1. Update task status in tasksStore
   * 2. Update updatedAt timestamp
   * 3. Persist to storage
   * 
   * @param taskId - ID of task to move
   * @param newStatus - Target status column
   * 
   * @example
   * ```typescript
   * // Drag task from 'todo' to 'in-progress'
   * taskService.moveTask('task-1', 'in-progress');
   * ```
   */
  moveTask(taskId: EntityId, newStatus: TaskStatus): void;

  /**
   * Loads tasks from persistent storage.
   * Called on app initialization.
   * 
   * Flow:
   * 1. Load from storageService
   * 2. If found, set in tasksStore
   * 3. If not found, load initial mock data
   * 
   * @example
   * ```typescript
   * // On app mount
   * taskService.loadTasks();
   * ```
   */
  loadTasks(): void;

  /**
   * Persists current tasks to storage.
   * Called after any task modification.
   * 
   * This is private in implementation but included in interface
   * for testing purposes.
   * 
   * @example
   * ```typescript
   * taskService.persistTasks();
   * ```
   */
  persistTasks(): void;
}
