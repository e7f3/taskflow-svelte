/**
 * Task Modal Handlers
 *
 * Centralized modal management for task-related modals.
 * This keeps modal logic separate from components.
 *
 * Learning Note:
 * By extracting modal handlers to a separate file, we:
 * - Keep components focused on UI logic
 * - Make modal types reusable across components
 * - Provide a single source of truth for task modals
 * - Enable easier testing and maintenance
 */

import { createModalHandler } from '@/shared/stores/modalManager/modalManager';
import type { EntityId } from '@/shared/types/common.types';
import type { Task } from '../types/task.types';

/**
 * State for the TaskForm modal.
 * Contains the task being edited (undefined for create mode).
 */
export interface TaskFormModalState {
  task?: Task;
}

/**
 * State for the delete confirmation modal.
 * Contains the ID of the task to delete.
 */
export interface DeleteConfirmationModalState {
  taskId: EntityId;
}

/**
 * Modal handler for the TaskForm modal.
 * Used for both creating and editing tasks.
 *
 * Usage:
 * - taskFormModal.open({}) - Create new task
 * - taskFormModal.open({ task }) - Edit existing task
 * - taskFormModal.close() - Close the modal
 * - taskFormModal.isOpen() - Check if modal is open
 * - taskFormModal.getState() - Get current modal state
 */
export const taskFormModal = createModalHandler<TaskFormModalState>('task-form');

/**
 * Modal handler for the delete confirmation modal.
 *
 * Usage:
 * - deleteConfirmationModal.open({ taskId }) - Show confirmation
 * - deleteConfirmationModal.close() - Close the modal
 * - deleteConfirmationModal.getState() - Get taskId to delete
 */
export const deleteConfirmationModal = createModalHandler<DeleteConfirmationModalState>('delete-confirmation');
