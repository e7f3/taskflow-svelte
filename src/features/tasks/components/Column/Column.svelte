<script lang="ts">
  /**
 * Column component - represents a status column (To Do, In Progress, Done).
 *
 * Learning Note - Component Composition:
 * This component demonstrates:
 * - Rendering child components in a loop ({#each})
 * - Drop zone implementation
 * - Passing callbacks to children
 * - Empty state handling
 * - Smooth list reordering with flip animation
 */

  import { flip } from 'svelte/animate';
  import styles from './Column.module.css';
  import TaskCard from '../TaskCard/TaskCard.svelte';
  import type { Task, TaskStatus } from '../../types/task.types';

  /**
 * Component props.
 */
  interface Props {
    /**
   * Column status (determines which tasks to show).
   */
    status: TaskStatus;

    /**
   * Column title for display.
   */
    title: string;

    /**
   * Tasks to display in this column.
   */
    tasks: Task[];

    /**
   * Currently dragged task (from parent Board component).
   * Used to prevent highlighting when dragging within same column.
   */
    draggedTask: Task | null;

    /**
   * Callback when a task is dropped in this column.
   */
    onDrop: (taskId: string, newStatus: TaskStatus) => void;

    /**
   * Callback when drag starts.
   */
    onDragStart: (taskId: string) => void;

    /**
   * Callback when drag ends.
   */
    onDragEnd: () => void;
  }

  /*
 * Learning Note - Removed onEditTask and onDeleteTask props:
 * TaskCard now handles both edit and delete modals directly using the modal manager.
 * Column is now a pure presentation component that only handles drag-and-drop!
 * This eliminates all unnecessary prop drilling.
 */
  const { status, title, tasks, draggedTask, onDrop, onDragStart, onDragEnd }: Props =
    $props();

  /*
 * Track whether a task is being dragged over this column.
 * Used for visual feedback (highlight drop zone).
 */
  let isOver = $state(false);

  /**
 * Handle drag over event.
 * This allows the column to accept drops.
 *
 * Learning Note:
 * preventDefault() is required to allow dropping.
 * Without it, the drop event won't fire!
 *
 * Performance optimization:
 * We check draggedTask.status (O(1)) instead of tasks.some() (O(n)).
 * This is called on every mouse movement during drag, so we keep it cheap!
 * Just a simple property comparison - no array iteration needed.
 */
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';

    // Only highlight if dragging from a different column
    // O(1) operation - just comparing two strings!
    isOver = draggedTask ? draggedTask.status !== status : true;
  }

  /**
 * Handle drag leave event.
 * Remove highlight when drag leaves the column.
 */
  function handleDragLeave() {
    isOver = false;
  }

  /**
 * Handle drop event.
 * Extract task ID and notify parent to move the task.
 *
 * Learning Note:
 * The task ID was set in TaskCard's dragstart handler.
 * We retrieve it here and pass it up to the parent.
 */
  function handleDrop(e: DragEvent) {
    e.preventDefault();

    /*
   * Get the task ID from drag data.
   */
    const taskId = e.dataTransfer!.getData('text/plain');

    /*
   * Notify parent to move the task.
   */
    onDrop(taskId, status);

    /*
   * Remove highlight.
   */
    isOver = false;
  }
</script>

<!--
  Column template.

  Learning Note:
  - class: directive for conditional classes
  - {#each} for rendering lists
  - {#if} for conditional rendering
  - (task.id) is the key for efficient updates
-->

<div class={styles.column}>
  <!-- Column header -->
  <div class={styles.header}>
    <h2 class={styles.title}>{title}</h2>
    <span class={styles.count}>{tasks.length}</span>
  </div>

  <!-- Drop zone area -->
  <div
    class={styles.dropZone}
    class:dragOver={isOver}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    role="region"
    aria-label="{title} tasks"
  >
    <!--
      Task list with flip animation.

      Learning Note - Svelte Animations:
      The animate:flip directive creates smooth reordering animations!
      
      When tasks move positions (drag-and-drop, filtering, sorting),
      Svelte automatically animates them to their new positions.
      
      Compare to React:
      - React: Need react-flip-move or manual FLIP calculations
      - Svelte: Just add animate:flip!
      
      The flip animation:
      - Calculates First and Last positions
      - Inverts the transform
      - Plays the animation
      - All automatically!
      
      Duration of 300ms provides smooth, natural movement.
    -->
    {#each tasks as task (task.id)}
      <div animate:flip={{ duration: 300 }}>
        <TaskCard {task} {onDragStart} {onDragEnd} />
      </div>
    {/each}

    <!--
      Empty state.
      Show message when column has no tasks.

      Learning Note:
      {#if} blocks can be nested and combined with {#each}.
      This is cleaner than React's conditional rendering!
    -->
    {#if tasks.length === 0}
      <div class={styles.emptyState}>
        <p class={styles.emptyText}>No tasks</p>
      </div>
    {/if}
  </div>
</div>

<!--
  Learning Note - Prop Shorthand:

  When prop name matches variable name, you can use shorthand:
  {task} instead of task={task}
  {onDragStart} instead of onDragStart={onDragStart}

  This is similar to ES6 object shorthand!
-->
