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

  import styles from './Board.module.css';
  import { taskService } from '../../services/taskService';
  import { tasksStore } from '../../stores/tasksStore';
  import Column from '../Column/Column.svelte';
  import type { Task, TaskStatus } from '../../types/task.types';

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
   * Handle task edit.
   * TODO: Open edit modal (will implement in task 8).
   */
  function handleEditTask(task: Task) {
    console.log('Edit task:', task);
  // Will implement TaskForm modal in next task
  }

  /**
   * Handle task delete.
   * Show confirmation and delete if confirmed.
   *
   * Learning Note:
   * Using browser's native confirm dialog for simplicity.
   * In production, you'd use a custom modal component.
   */
  function handleDeleteTask(taskId: string) {
    /*
     * Show confirmation dialog.
     */
    const confirmed = confirm('Are you sure you want to delete this task?');

    if (confirmed) {
      /*
       * Delete task via service.
       * Service updates store and persists to storage.
       */
      taskService.deleteTask(taskId);
    }
  }
</script>

<!--
  Board template.

  Learning Note:
  - Three Column components side by side
  - Each gets filtered tasks for its status
  - All share the same event handlers
  - Responsive grid layout via CSS
-->

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
  Learning Note - Reactivity Flow:

  1. User drags task to new column
  2. handleDrop calls taskService.moveTask()
  3. Service updates tasksStore
  4. Store update triggers reactivity
  5. $tasksStore updates
  6. $derived recomputes filtered tasks
  7. Column components re-render with new tasks
  8. UI updates automatically!

  No manual state management needed!
  This is the power of Svelte's reactivity.
-->
