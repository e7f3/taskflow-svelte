<script lang="ts">
  /**
 * TaskCard component - displays a single task.
 *
 * Learning Note - Svelte 5 Props:
 *
 * Svelte 4 way:
 *   export let task;
 *   export let onEdit;
 *
 * Svelte 5 way:
 *   let { task, onEdit } = $props();
 *
 * Benefits:
 * - More like destructuring
 * - Better TypeScript inference
 * - Clearer intent
 */

  import { fade, fly } from 'svelte/transition';
  import styles from './TaskCard.module.css';
  import {
    deleteConfirmationModal,
    taskFormModal,
  } from '../../stores/taskModals/taskModals';
  import type { Task } from '../../types/task.types';

  /**
 * Component props interface.
 *
 * Learning Note:
 * We define props as an interface for type safety.
 * This is similar to React's prop types but enforced at compile time!
 */
  interface Props {
    /**
   * Task to display.
   */
    task: Task;

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
 * Destructure props using $props() rune.
 *
 * Learning Note:
 * This is Svelte 5's new way of declaring props.
 * Much cleaner than Svelte 4's export let!
 *
 * Note: We removed onEdit and onDelete props because TaskCard now handles
 * both edit and delete modals directly using the modal manager.
 * This eliminates prop drilling entirely!
 */
  const { task, onDragStart, onDragEnd }: Props = $props();

  /*
 * Assignee is already embedded in the task.
 *
 * Learning Note - Production-Ready Pattern:
 * Instead of storing just an ID and doing lookups,
 * we embed the assignee data in the task.
 *
 * This is how real APIs work - they return nested data
 * to avoid N+1 query problems and unnecessary client-side lookups.
 *
 * Much more efficient than:
 * let assignee = $derived(MOCK_USERS.find(u => u.id === task.assigneeId))
 */
  const assignee = $derived(task.assignee);

  /*
 * Compute priority class name.
 * Used for the colored indicator bar.
 */
  const priorityClass = $derived(
    styles[`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`],
  );

  /**
 * Handle drag start event.
 *
 * Learning Note - Native Drag & Drop:
 * Svelte makes it easy to use native browser APIs.
 * No need for external libraries!
 */
  function handleDragStart(e: DragEvent) {
    /*
   * Set drag data.
   * This allows the drop target to know what's being dragged.
   */
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', task.id);

    /*
   * Notify parent component.
   */
    onDragStart(task.id);
  }

  /**
 * Handle drag end event.
 */
  function handleDragEnd() {
    onDragEnd();
  }

  /**
 * Handle card click to edit.
 *
 * Learning Note - Direct Modal Management:
 * TaskCard directly opens the edit modal using the shared modal handler.
 * No need to pass events up to parent components!
 */
  function handleClick() {
    taskFormModal.open({ task });
  }

  /**
 * Handle keyboard events for accessibility.
 * Enter or Space key opens the task for editing.
 */
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      taskFormModal.open({ task });
    }
  }

  /**
 * Handle delete button click.
 *
 * Learning Note - Direct Modal Management:
 * Instead of passing the event up to the parent, TaskCard directly
 * opens the delete confirmation modal using the shared modal handler.
 *
 * Benefits:
 * - No prop drilling (onDelete callback removed)
 * - TaskCard owns its delete behavior
 * - Board doesn't need to know about TaskCard's delete flow
 * - Cleaner separation of concerns
 *
 * The modal itself still renders at the Board level (or could be at App level),
 * but TaskCard controls when it opens. This is the power of shared stores!
 */
  function handleDelete(e: MouseEvent) {
    e.stopPropagation(); // Don't trigger card click
    deleteConfirmationModal.open({ taskId: task.id });
  }
</script>

<!--
  TaskCard template.

  Learning Note - Svelte Transitions:
  Svelte has built-in transition directives that make animations easy!
  
  - in:fly - Animates element entering the DOM
  - out:fade - Animates element leaving the DOM
  
  Compare to React:
  - React: Need react-spring, framer-motion, or manual CSS
  - Svelte: Built-in, declarative, performant
  
  The transitions:
  - in:fly={{ y: 20, duration: 300 }} - Slides up from 20px below
  - out:fade={{ duration: 200 }} - Fades out when removed
  
  These run automatically when the element is added/removed from the DOM!
-->

<div
  class={styles.card}
  draggable="true"
  ondragstart={handleDragStart}
  ondragend={handleDragEnd}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  role="button"
  tabindex="0"
  in:fly={{ y: 20, duration: 300 }}
  out:fade={{ duration: 200 }}
>
  <!-- Priority indicator bar -->
  <div class="{styles.priorityIndicator} {priorityClass}"></div>

  <!-- Card content -->
  <div class={styles.content}>
    <!-- Title -->
    <h3 class={styles.title}>{task.title}</h3>

    <!-- Description (if exists) -->
    {#if task.description}
      <p class={styles.description}>{task.description}</p>
    {/if}

    <!-- Footer with assignee and actions -->
    <div class={styles.footer}>
      <!-- Assignee -->
      <div class={styles.assignee}>
        {#if assignee}
          <span class={styles.avatar}>{assignee.avatar}</span>
          <span class={styles.assigneeName}>{assignee.name}</span>
        {:else}
          <span class={styles.unassigned}>Unassigned</span>
        {/if}
      </div>

      <!-- Actions -->
      <div class={styles.actions}>
        <!-- Priority badge -->
        <span class="{styles.priorityBadge} {priorityClass}">
          {task.priority}
        </span>

        <!-- Delete button -->
        <button
          class={styles.deleteButton}
          onclick={handleDelete}
          aria-label="Delete task"
          type="button"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</div>

<!--
  Learning Note - No <style> tag:
  We use CSS Modules instead of scoped styles.
  This gives us:
  - Better organization (styles in separate file)
  - Reusability (can import in multiple components)
  - Type safety (TypeScript knows class names)
  - Still scoped (no conflicts)
-->
