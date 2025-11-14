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
  import Button from '@/shared/components/Button/Button.svelte';
  import Input from '@/shared/components/Input/Input.svelte';
  import Modal from '@/shared/components/Modal/Modal.svelte';
  import Select from '@/shared/components/Select/Select.svelte';
  import Textarea from '@/shared/components/Textarea/Textarea.svelte';
  import type { EntityId } from '@/shared/types/common.types';
  import styles from './TaskForm.module.css';
  import { taskService } from '../../services/taskService';
  import { taskFormModal } from '../../stores/taskModals/taskModals';
  import { PRIORITY_VALUES } from '../../types/task.types';
  import type {
    Task,
    Priority,
    TaskStatus,
  } from '../../types/task.types';

  /**
   * Component props interface.
   *
   * Learning Note - Self-Contained Component:
   * TaskForm now manages its own save/cancel logic directly.
   * No need for callback props - it uses services and stores directly.
   * This makes it more encapsulated and easier to test.
   */
  interface Props {
    /**
     * Whether the modal is open.
     */
    isOpen?: boolean;

    /**
     * Optional task to edit. If provided, form is in edit mode.
     * If undefined, form is in create mode.
     */
    task?: Task;
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

  const { isOpen = false, task }: Props = $props();

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
   * Handles form submission.
   * Directly calls taskService and manages modal state.
   *
   * Learning Note - Direct Service Usage:
   * Instead of using callback props, we directly:
   * 1. Call taskService.saveTask() for business logic
   * 2. Call taskFormModal.close() to close the modal
   *
   * This makes TaskForm self-contained and removes unnecessary prop drilling.
   * Components can and should use services directly!
   */
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    // Clear previous errors
    error = '';
    isLoading = true;

    try {
      const result = await taskService.saveTask(
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
        // Success! Close the modal
        taskFormModal.close();
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
   * Handles form cancellation.
   * Directly closes the modal using the modal manager.
   *
   * Learning Note:
   * No need for a callback prop - we can directly access the modal manager.
   * This is simpler and more direct than prop drilling.
   */
  function handleCancel() {
    taskFormModal.close();
  }


</script>

<!--
  TaskForm template.

  Learning Note - Using Modal Component:
  We use our reusable Modal component instead of native <dialog>.
  The Modal handles:
  - Opening/closing state
  - Escape key handling
  - Backdrop clicks
  - Accessibility features

  This keeps TaskForm focused on form logic, not modal behavior.
-->
<Modal {isOpen} onClose={handleCancel} title={task ? 'Edit Task' : 'Create New Task'}>
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
      <Input
        id="title"
        type="text"
        bind:value={title}
        placeholder="Enter task title (min 3 characters)"
        disabled={isLoading}
        required
        error={titleError}
      />
    </div>

    <!-- Description Field -->
    <div class={styles.field}>
      <label for="description" class={styles.label}>Description</label>
      <Textarea
        id="description"
        bind:value={description}
        placeholder="Enter task description (optional)"
        disabled={isLoading}
        rows={3}
      />
    </div>

    <!-- Assignee Field -->
    <div class={styles.field}>
      <label for="assignee" class={styles.label}>Assignee</label>
      <Select
        id="assignee"
        bind:value={assigneeId}
        disabled={isLoading}>
        <option value={null}>Unassigned</option>
        {#each availableUsers as user (user.id)}
          <option value={user.id}>
            {user.avatar}
            {user.name}
          </option>
        {/each}
      </Select>
    </div>

    <!-- Priority Field -->
    <div class={styles.field}>
      <label for="priority" class={styles.label}>Priority</label>
      <Select
        id="priority"
        bind:value={priority}
        disabled={isLoading}>
        {#each PRIORITY_VALUES as priorityOption (priorityOption)}
          <option value={priorityOption}>
            {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
          </option>
        {/each}
      </Select>
    </div>

    <!-- Status Field (useful for editing) -->
    <div class={styles.field}>
      <label for="status" class={styles.label}>Status</label>
      <Select
        id="status"
        bind:value={status}
        disabled={isLoading}>
        {#each STATUS_OPTIONS as statusOption (statusOption.value)}
          <option value={statusOption.value}>
            {statusOption.label}
          </option>
        {/each}
      </Select>
    </div>

    <!-- Error Message -->
    {#if error}
      <div class={styles.error} role="alert">
        {error}
      </div>
    {/if}

    <!-- Action Buttons -->
    <div class={styles.buttonsContainer}>
      <Button
        type="button"
        variant="secondary"
        onclick={handleCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={!isFormValid}
        loading={isLoading}
      >
        {#if isLoading}
          Saving...
        {:else if task}
          Update Task
        {:else}
          Create Task
        {/if}
      </Button>
    </div>
  </form>
</Modal>
