<script lang="ts">
  /**
   * TaskForm component for creating and editing tasks.
   *
   * Learning Note - Form Patterns in Svelte 5:
   *
   * This component demonstrates several key Svelte 5 patterns:
   *
   * 1. $state rune for mutable form fields:
   *    - Use $state for values that need to be bound to inputs
   *    - These are reactive and can be modified by user input
   *
   * 2. $derived rune for computed values:
   *    - Use $derived for values calculated from other state
   *    - Automatically recomputes when dependencies change
   *    - Example: form validation, error messages
   *
   * 3. $effect rune for side effects:
   *    - Runs when component mounts or dependencies change
   *    - Can return cleanup function
   *    - Example: focus management, dialog lifecycle
   *
   * 4. Native <dialog> element:
   *    - Modern HTML5 element with built-in accessibility
   *    - Handles Escape key, focus trapping, backdrop
   *    - Use showModal() for modal behavior
   *
   * Compare to React:
   * - No useState/useEffect/useMemo hooks needed
   * - No dependency arrays to manage
   * - Simpler, more intuitive API
   */

  import { authService } from '@/features/auth/services/authService';
  import type { EntityId } from '@/shared/types/common.types';
  import styles from './TaskForm.module.css';
  import { PRIORITY_VALUES } from '../../types/task.types';
  import type {
    CreateTaskData,
    Task,
    TaskSaveResult,
    Priority,
    TaskStatus,
  } from '../../types/task.types';

  /**
   * Component props interface.
   *
   * Learning Note:
   * Props are defined as an interface and destructured using $props().
   * This is Svelte 5's new way - cleaner than Svelte 4's export let!
   */
  interface Props {
    /**
     * Optional task to edit. If provided, form is in edit mode.
     * If undefined, form is in create mode.
     */
    task?: Task;

    /**
     * Callback when user saves the form.
     * Receives task data and optional task ID (for edits).
     * Returns a promise with success/error result.
     */
    onSave: (taskData: CreateTaskData, taskId?: EntityId) => Promise<TaskSaveResult>;

    /**
     * Callback when user cancels the form.
     */
    onCancel: () => void;
  }

  /**
   * Default values for new tasks.
   */
  const DEFAULT_PRIORITY: Priority = 'medium';
  const DEFAULT_STATUS: TaskStatus = 'todo';

  /**
   * Status options for the dropdown.
   */
  const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  const { task, onSave, onCancel }: Props = $props();

  /**
   * Form field state using $state rune.
   *
   * Learning Note - $state vs $derived:
   * - Use $state for values that can be modified (form inputs)
   * - Use $derived for computed values (validation, formatting)
   *
   * These are initialized from the task prop (edit mode) or defaults (create mode).
   * The $state rune makes them reactive - when they change, the UI updates automatically.
   */
  let title = $state(task?.title ?? '');
  let description = $state(task?.description ?? '');
  let assigneeId = $state<EntityId | null>(task?.assignee?.id ?? null);
  let priority = $state<Priority>(task?.priority ?? DEFAULT_PRIORITY);
  let status = $state<TaskStatus>(task?.status ?? DEFAULT_STATUS);
  let error = $state('');
  let isLoading = $state(false);

  /**
   * DOM element references.
   */
  let titleInputElement = $state<HTMLInputElement | null>(null);
  let dialogElement = $state<HTMLDialogElement | null>(null);

  /**
   * Get list of available users for assignee dropdown.
   * This is a constant, not reactive state.
   */
  const availableUsers = authService.getAllUsers();

  /**
   * Form validation using $derived rune.
   *
   * Learning Note:
   * $derived automatically recomputes when dependencies (title) change.
   * No need for dependency arrays like React's useMemo!
   */
  const isFormValid = $derived(title.trim().length >= 3);

  /**
   * Validation error message for title field.
   * Only shows error if user has started typing.
   */
  const titleError = $derived(
    title.length > 0 && title.trim().length < 3 ? 'Title must be at least 3 characters' : '',
  );

  /**
   * Compute assignee object from selected ID.
   * This converts the ID back to the full assignee object for saving.
   */
  const selectedAssignee = $derived(
    assigneeId ? (availableUsers.find((u) => u.id === assigneeId) ?? null) : null,
  );

  /**
   * Focus the title input when component mounts.
   *
   * Learning Note - $effect:
   * Runs after component is mounted and DOM is ready.
   * No dependency array needed - Svelte tracks dependencies automatically.
   */
  $effect(() => {
    titleInputElement?.focus();
  });

  /**
   * Manage dialog lifecycle.
   *
   * Learning Note - $effect with cleanup:
   * The returned function runs when the component unmounts.
   * This ensures the dialog is properly closed.
   */
  $effect(() => {
    dialogElement?.showModal();

    return () => {
      dialogElement?.close();
    };
  });

  /**
   * Handles form submission.
   * Validates data and calls onSave callback.
   *
   * Learning Note:
   * This is a regular async function - no special hooks needed!
   * In React, you might use useCallback to memoize it.
   * In Svelte, functions are just functions!
   */
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    // Clear previous errors
    error = '';
    isLoading = true;

    try {
      const result = await onSave(
        {
          title: title.trim(),
          description: description.trim(),
          assignee: selectedAssignee
            ? {
              id: selectedAssignee.id,
              name: selectedAssignee.name,
              avatar: selectedAssignee.avatar,
            }
            : null,
          priority,
          status,
        },
        task?.id,
      );

      if (!result.success) {
        error = result.error;
      } else {
        // Success! Close the dialog
        handleClose();
      }
    } catch (err) {
      // Unexpected error
      error = 'An unexpected error occurred. Please try again.';
      console.error('Task save error:', err);
    } finally {
      isLoading = false;
    }
  }

  /**
   * Handles dialog close/cancel.
   * Calls onCancel callback and closes the dialog.
   */
  function handleClose() {
    onCancel();
    dialogElement?.close();
  }

  /**
   * Handles dialog cancel event (Escape key).
   *
   * Learning Note:
   * The native <dialog> element automatically closes on Escape key.
   * We intercept this event to call our onCancel callback.
   */
  function handleCancel(event: Event) {
    event.preventDefault();
    handleClose();
  }
</script>

<!--
  TaskForm template.

  Learning Note - Native <dialog> Element:
  The <dialog> element provides built-in modal functionality:
  - Escape key closes it automatically
  - Focus is trapped inside
  - Backdrop is styled with ::backdrop pseudo-element
  - Accessible by default (ARIA roles, keyboard navigation)

  We use showModal() instead of show() for modal behavior.
-->
<dialog bind:this={dialogElement} class={styles.dialog} oncancel={handleCancel}>
  <h1 class={styles.title}>
    {#if task}
      Edit Task
    {:else}
      Create New Task
    {/if}
  </h1>

  <!--
      Form with two-way binding.

      Learning Note - bind:value:
      Svelte's killer feature! Creates bidirectional binding:
      - Input changes update the variable
      - Variable changes update the input

      No onChange handlers needed like in React!
    -->
  <form class={styles.form} onsubmit={handleSubmit}>
    <!-- Title Field -->
    <div class={styles.field}>
      <label for="title" class={styles.label}>
        Title <span class={styles.required}>*</span>
      </label>
      <input
        id="title"
        type="text"
        class={styles.input}
        bind:value={title}
        bind:this={titleInputElement}
        placeholder="Enter task title (min 3 characters)"
        disabled={isLoading}
        required
        aria-invalid={titleError ? 'true' : 'false'}
        aria-describedby={titleError ? 'title-error' : undefined}
      />
      {#if titleError}
        <span id="title-error" class={styles.fieldError}>
          {titleError}
        </span>
      {/if}
    </div>

    <!-- Description Field -->
    <div class={styles.field}>
      <label for="description" class={styles.label}>Description</label>
      <textarea
        id="description"
        class={styles.textarea}
        bind:value={description}
        placeholder="Enter task description (optional)"
        disabled={isLoading}
        rows="3"
      ></textarea>
    </div>

    <!-- Assignee Field -->
    <div class={styles.field}>
      <label for="assignee" class={styles.label}>Assignee</label>
      <select
        id="assignee"
        class={styles.select}
        bind:value={assigneeId}
        disabled={isLoading}>
        <option value={null}>Unassigned</option>
        {#each availableUsers as user (user.id)}
          <option value={user.id}>
            {user.avatar}
            {user.name}
          </option>
        {/each}
      </select>
    </div>

    <!-- Priority Field -->
    <div class={styles.field}>
      <label for="priority" class={styles.label}>Priority</label>
      <select
        id="priority"
        class={styles.select}
        bind:value={priority}
        disabled={isLoading}>
        {#each PRIORITY_VALUES as priorityOption (priorityOption)}
          <option value={priorityOption}>
            {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
          </option>
        {/each}
      </select>
    </div>

    <!-- Status Field (useful for editing) -->
    <div class={styles.field}>
      <label for="status" class={styles.label}>Status</label>
      <select
        id="status"
        class={styles.select}
        bind:value={status}
        disabled={isLoading}>
        {#each STATUS_OPTIONS as statusOption (statusOption.value)}
          <option value={statusOption.value}>
            {statusOption.label}
          </option>
        {/each}
      </select>
    </div>

    <!-- Error Message -->
    {#if error}
      <div class={styles.error} role="alert">
        {error}
      </div>
    {/if}

    <!-- Action Buttons -->
    <div class={styles.buttonsContainer}>
      <button
        type="button"
        class="{styles.button} {styles.buttonSecondary}"
        onclick={handleClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="submit"
        class="{styles.button} {styles.buttonPrimary}"
        disabled={!isFormValid || isLoading}
      >
        {#if isLoading}
          Saving...
        {:else if task}
          Update Task
        {:else}
          Create Task
        {/if}
      </button>
    </div>
  </form>
</dialog>
