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
  import { tasksStore } from '../../stores/tasksStore';
  import Column from '../Column/Column.svelte';
  import TaskForm from '../TaskForm/TaskForm.svelte';
  import type {
    Task,
    TaskStatus,
    CreateTaskData,
    TaskSaveResult,
  } from '../../types/task.types';

  /*
   * Subscribe to tasks store.
   *
   * Learning Note - $ prefix:
   * The $ prefix automatically subscribes to the store.
   * When the store updates, this component re-renders.
   *
   * Compare to React:
   * const tasks = useSelector(state => state.tasks);
   *
   * Svelte is simpler - just $tasksStore!
   */
  const allTasks = $derived($tasksStore);

  /*
   * Filter tasks by status for each column.
   *
   * Learning Note - $derived:
   * These automatically recompute when allTasks changes.
   * Similar to React's useMemo but without dependency arrays!
   *
   * The compiler tracks dependencies automatically.
   */
  const todoTasks = $derived(allTasks.filter((t) => t.status === 'todo'));
  const inProgressTasks = $derived(
    allTasks.filter((t) => t.status === 'in-progress'),
  );
  const doneTasks = $derived(allTasks.filter((t) => t.status === 'done'));

  /*
   * Track the currently dragged task.
   * Used to prevent highlighting the source column during drag.
   */
  let draggedTask = $state<Task | null>(null);

  /*
   * Track TaskForm modal state.
   *
   * Learning Note - Modal State Management:
   * We use $state to track:
   * - showTaskForm: whether the modal is open
   * - editingTask: the task being edited (null for create mode)
   *
   * This is simpler than React's useState pattern!
   */
  let showTaskForm = $state(false);
  let editingTask = $state<Task | null>(null);

  /*
   * Track confirmation modal state.
   * Stores the task ID to delete when user confirms.
   */
  let showDeleteConfirmation = $state(false);
  let taskToDelete = $state<EntityId | null>(null);

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
   * Learning Note:
   * We set editingTask to null to indicate create mode.
   * Then open the modal by setting showTaskForm to true.
   */
  function handleCreateTask() {
    editingTask = null;
    showTaskForm = true;
  }

  /**
   * Handle task edit.
   * Opens the TaskForm modal in edit mode.
   *
   * Learning Note:
   * We set editingTask to the task being edited.
   * TaskForm will detect this and show "Edit Task" instead of "Create Task".
   */
  function handleEditTask(task: Task) {
    editingTask = task;
    showTaskForm = true;
  }

  /**
   * Handle task save (create or update).
   *
   * Learning Note - Async Handlers:
   * This function is called by TaskForm when the user saves.
   * It determines whether to create or update based on taskId.
   * Returns a TaskSaveResult to indicate success/failure.
   */
  async function handleSaveTask(
    taskData: CreateTaskData,
    taskId?: EntityId,
  ): Promise<TaskSaveResult> {
    try {
      if (taskId) {
        // Update existing task
        taskService.updateTask(taskId, taskData);
        // Get the updated task from the store
        const updatedTask = allTasks.find((t) => t.id === taskId);
        if (!updatedTask) {
          throw new Error('Task not found after update');
        }
        return { success: true, task: updatedTask };
      } else {
        // Create new task
        const task = await taskService.createTask(taskData);
        return { success: true, task };
      }
    } catch (error) {
      console.error('Error saving task:', error);
      return {
        success: false,
        error: 'Failed to save task. Please try again.',
      };
    }
  }

  /**
   * Handle task form cancel.
   * Closes the modal and clears editing state.
   */
  function handleCancelTaskForm() {
    showTaskForm = false;
    editingTask = null;
  }

  /**
   * Handle task delete request.
   * Opens confirmation modal.
   *
   * Learning Note:
   * Instead of using browser's confirm(), we use our custom ConfirmationModal.
   * This provides better UX and matches our design system.
   */
  function handleDeleteTask(taskId: EntityId) {
    taskToDelete = taskId;
    showDeleteConfirmation = true;
  }

  /**
   * Handle delete confirmation.
   * Actually deletes the task.
   */
  function handleConfirmDelete() {
    if (taskToDelete) {
      taskService.deleteTask(taskToDelete);
    }
    showDeleteConfirmation = false;
    taskToDelete = null;
  }

  /**
   * Handle delete cancellation.
   * Closes the confirmation modal.
   */
  function handleCancelDelete() {
    showDeleteConfirmation = false;
    taskToDelete = null;
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

  <div class={styles.board}>
    <Column
      status="todo"
      title="To Do"
      tasks={todoTasks}
      {draggedTask}
      onDrop={handleDrop}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />

    <Column
      status="in-progress"
      title="In Progress"
      tasks={inProgressTasks}
      {draggedTask}
      onDrop={handleDrop}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />

    <Column
      status="done"
      title="Done"
      tasks={doneTasks}
      {draggedTask}
      onDrop={handleDrop}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
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
  Learning Note - Reactivity Flow:

  1. User clicks "Add Task" button
  2. handleCreateTask sets showTaskForm = true
  3. TaskForm modal appears
  4. User fills form and clicks Save
  5. handleSaveTask calls taskService.createTask()
  6. Service updates tasksStore
  7. Store update triggers reactivity
  8. $tasksStore updates
  9. $derived recomputes filtered tasks
  10. Column components re-render with new task
  11. UI updates automatically!

  No manual state management needed!
  This is the power of Svelte's reactivity.
-->
