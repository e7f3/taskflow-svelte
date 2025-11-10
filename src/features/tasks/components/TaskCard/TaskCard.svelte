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

import type { Task } from '../../types/task.types';
import styles from './TaskCard.module.css';

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
   * Callback when user clicks to edit task.
   */
  onEdit: (task: Task) => void;

  /**
   * Callback when user clicks delete button.
   */
  onDelete: (taskId: string) => void;

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
 */
let { task, onEdit, onDelete, onDragStart, onDragEnd }: Props = $props();

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
let assignee = $derived(task.assignee);

/*
 * Compute priority class name.
 * Used for the colored indicator bar.
 */
let priorityClass = $derived(
  styles[`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`]
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
 */
function handleClick() {
  onEdit(task);
}

/**
 * Handle keyboard events for accessibility.
 * Enter or Space key opens the task for editing.
 */
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onEdit(task);
  }
}

/**
 * Handle delete button click.
 * 
 * Learning Note - Event Modifiers:
 * We use stopPropagation to prevent the card click event.
 * In Svelte, you can use |stopPropagation modifier on the element.
 */
function handleDelete(e: MouseEvent) {
  e.stopPropagation(); // Don't trigger card click
  onDelete(task.id);
}
</script>

<!--
  TaskCard template.
  
  Learning Note:
  - draggable="true" makes the element draggable
  - ondragstart/ondragend are Svelte 5 event handlers
  - onclick is the new way (was on:click in Svelte 4)
  - class: directive for dynamic classes
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
