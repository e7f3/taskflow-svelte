<script lang="ts">
  /**
   * Board component - main task board with three columns.
   *
   * Learning Note - Store Integration:
   * This component demonstrates:
   * - Subscribing to stores with $ prefix
   * - Using derived stores for computed values
   * - Calling service methods
   * - Managing local component state
   * - Coordinating multiple child components
   */

  import Button from '@/shared/components/Button/Button.svelte';
  import ConfirmationModal from '@/shared/components/ConfirmationModal/ConfirmationModal.svelte';
  import type { EntityId } from '@/shared/types/common.types';
  import styles from './Board.module.css';
  import { taskService } from '../../services/taskService';
  import {
    filteredTodoTasks,
    filteredInProgressTasks,
    filteredDoneTasks,
  } from '../../stores/filteredTasksStore/filteredTasksStore';
  import {
    taskFormModal,
    deleteConfirmationModal,
  } from '../../stores/taskModals/taskModals';
  import { tasksStore } from '../../stores/tasksStore/tasksStore';
  import Column from '../Column/Column.svelte';
  import FilterBar from '../FilterBar/FilterBar.svelte';
  import TaskForm from '../TaskForm/TaskForm.svelte';
  import type {
    Task,
    TaskStatus,
    CreateTaskData,
    TaskSaveResult,
  } from '../../types/task.types';

  /*
   * Subscribe to filtered task stores.
   *
   * Learning Note - Derived Store Architecture:
   * Instead of filtering in the component, we use derived stores.
   * This separates concerns:
   * - filteredTasksStore: handles filtering logic
   * - Board: handles UI coordination
   *
   * Benefits:
   * - Filtering logic is reusable and testable
   * - Component is simpler and focused on UI
   * - Automatic reactivity when tasks or filters change
   */
  const todoTasks = $derived($filteredTodoTasks);
  const inProgressTasks = $derived($filteredInProgressTasks);
  const doneTasks = $derived($filteredDoneTasks);

  // Keep reference to all tasks for drag operations
  const allTasks = $derived($tasksStore);

  /*
   * Track the currently dragged task.
   * Used to prevent highlighting the source column during drag.
   */
  let draggedTask = $state<Task | null>(null);

  /*
   * Derived state from modal handlers.
   *
   * Learning Note - Modal Manager Integration:
   * Instead of manually tracking modal state with $state variables,
   * we import pre-configured modal handlers from taskModals.ts.
   *
   * Benefits:
   * - Centralized modal configuration
   * - Reusable across components
   * - Type-safe state management
   * - Cleaner component code
   * - Single source of truth
   *
   * We use $derived to reactively compute modal state.
   * This automatically updates when the modal manager changes.
   */
  const showTaskForm = $derived(taskFormModal.isOpen());
  const editingTask = $derived(taskFormModal.getState()?.task ?? null);

  const showDeleteConfirmation = $derived(deleteConfirmationModal.isOpen());
  const taskToDelete = $derived(
    deleteConfirmationModal.getState()?.taskId ?? null,
  );

  /**
   * Handle drag start.
   * Track which task is being dragged for visual feedback.
   */
  function handleDragStart(taskId: string) {
    draggedTask = allTasks.find((t) => t.id === taskId) || null;
  }

  /**
   * Handle drag end.
   * Clear the dragged task reference.
   */
  function handleDragEnd() {
    draggedTask = null;
  }

  /**
   * Handle task drop in a column.
   * Move the task to the new status.
   *
   * Learning Note:
   * We call the service method, which:
   * 1. Updates the store
   * 2. Persists to localStorage
   * 3. Triggers reactivity (component re-renders)
   *
   * No need to manually update state like in Redux!
   */
  function handleDrop(taskId: string, newStatus: TaskStatus) {
    taskService.moveTask(taskId, newStatus);
  }

  /**
   * Handle opening create task modal.
   *
   * Learning Note - Modal Manager:
   * We use the imported modal handler to open the modal.
   * Empty object means create mode (no task to edit).
   *
   * Note: TaskCard also uses taskFormModal.open({ task }) for editing.
   * Both create and edit use the same modal, just with different state!
   */
  function handleCreateTask() {
    taskFormModal.open({});
  }

  /**
   * Handle task form submission.
   *
   * Learning Note - Delegation to Service:
   * We delegate business logic to the service layer.
   * The component just coordinates between UI and service.
   *
   * This makes the component thinner and the service more testable.
   */
  async function handleSaveTask(
    taskData: CreateTaskData,
    taskId?: EntityId,
  ): Promise<TaskSaveResult> {
    return await taskService.saveTask(taskData, taskId);
  }

  /**
   * Handle task form cancel.
   * Closes the modal using the modal handler.
   *
   * Learning Note - Modal Manager:
   * The modal handler automatically manages cleanup.
   * No need to manually reset state variables!
   */
  function handleCancelTaskForm() {
    taskFormModal.close();
  }



  /**
   * Handle delete confirmation.
   * Actually deletes the task and closes the modal.
   *
   * Learning Note:
   * We get the taskId from the modal state instead of
   * tracking it in a separate variable.
   */
  function handleConfirmDelete() {
    if (taskToDelete) {
      taskService.deleteTask(taskToDelete);
    }
    deleteConfirmationModal.close();
  }

  /**
   * Handle delete cancellation.
   * Closes the confirmation modal.
   */
  function handleCancelDelete() {
    deleteConfirmationModal.close();
  }
</script>

<!--
  Board template.

  Learning Note:
  - Add Task button at the top
  - Three Column components side by side
  - Each gets filtered tasks for its status
  - All share the same event handlers
  - TaskForm modal conditionally rendered
  - Responsive grid layout via CSS
-->

<div class={styles.boardContainer}>
  <div class={styles.boardHeader}>
    <Button variant="primary" onclick={handleCreateTask}>
      + Add Task
    </Button>
  </div>

  <!-- Filter Bar -->
  <FilterBar />

  <div class={styles.board}>
    <Column
      status="todo"
      title="To Do"
      tasks={todoTasks}
      {draggedTask}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />

    <Column
      status="in-progress"
      title="In Progress"
      tasks={inProgressTasks}
      {draggedTask}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />

    <Column
      status="done"
      title="Done"
      tasks={doneTasks}
      {draggedTask}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  </div>

  <!--
    TaskForm modal.

    Learning Note - Conditional Rendering:
    We use {#if} to conditionally render the TaskForm.
    When showTaskForm is true, the modal appears.
    The task prop determines create vs edit mode.
  -->
  {#if showTaskForm}
    <TaskForm
      isOpen={showTaskForm}
      task={editingTask ?? undefined}
      onSave={handleSaveTask}
      onCancel={handleCancelTaskForm}
    />
  {/if}

  <!--
    Delete confirmation modal.

    Learning Note - Component Composition:
    We use our ConfirmationModal component instead of browser confirm().
    This provides better UX and consistency with our design system.
  -->
  {#if showDeleteConfirmation}
    <ConfirmationModal
      isOpen={showDeleteConfirmation}
      title="Delete Task"
      message="Are you sure you want to delete this task? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="danger"
      onConfirm={handleConfirmDelete}
      onCancel={handleCancelDelete}
    />
  {/if}
</div>

<!--
  Learning Note - Reactivity Flow with Modal Manager:

  1. User clicks "Add Task" button
  2. handleCreateTask calls taskFormHandler.open({})
  3. Modal manager updates its internal store
  4. $derived(taskFormHandler.isOpen()) recomputes to true
  5. TaskForm modal appears
  6. User fills form and clicks Save
  7. handleSaveTask calls taskService.createTask()
  8. Service updates tasksStore
  9. Store update triggers reactivity
  10. $tasksStore updates
  11. $derived recomputes filtered tasks
  12. Column components re-render with new task
  13. UI updates automatically!

  Benefits of Modal Manager:
  - Centralized modal state (no scattered $state variables)
  - Support for multiple modals of same type
  - LIFO stack for proper modal layering
  - Type-safe state management
  - Cleaner component code

  This is the power of Svelte's reactivity + smart abstractions!
-->
