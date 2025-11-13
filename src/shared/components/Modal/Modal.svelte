<script lang="ts">
  /**
   * Reusable Modal component using native <dialog> element.
   *
   * Learning Note - Native Dialog:
   * The <dialog> element provides built-in modal functionality:
   * - Escape key closes it automatically
   * - Focus is trapped inside
   * - Backdrop is styled with ::backdrop pseudo-element
   * - Accessible by default (ARIA roles, keyboard navigation)
   *
   * We use showModal() instead of show() for modal behavior.
   */

  import styles from './Modal.module.css';
  import type { Snippet } from 'svelte';

  interface Props {
    /**
     * Whether the modal is open.
     */
    isOpen?: boolean;

    /**
     * Callback when modal is closed (Escape key or backdrop click).
     */
    onClose?: () => void;

    /**
     * Optional modal title displayed at the top.
     */
    title?: string;

    /**
     * Modal content (children).
     */
    children?: Snippet;
  }

  let { children, isOpen = false, onClose, title }: Props = $props();

  /**
   * DOM element reference.
   */
  let dialogElement = $state<HTMLDialogElement | null>(null);

  /**
   * Manage dialog open/close state.
   *
   * Learning Note - $effect for side effects:
   * This effect runs whenever isOpen changes.
   * We explicitly open or close the dialog based on the prop.
   * No cleanup needed here since we handle both states.
   */
  $effect(() => {
    if (isOpen && dialogElement) {
      dialogElement.showModal();
    } else if (!isOpen && dialogElement) {
      dialogElement.close();
    }
  });

  /**
   * Handles dialog cancel event (Escape key).
   *
   * Learning Note:
   * The native <dialog> element automatically closes on Escape key.
   * We intercept this event to call our onClose callback.
   */
  function handleCancel(event: Event) {
    event.preventDefault();
    onClose?.();
  }

  /**
   * Handles backdrop click to close modal.
   * Clicking outside the dialog content closes it.
   */
  function handleBackdropClick(event: MouseEvent) {
    // Only close if clicking directly on the dialog (backdrop)
    if (event.target === dialogElement) {
      onClose?.();
    }
  }
</script>

<!--
  Modal template using native <dialog> element.

  Learning Note:
  - No need for {#if isOpen} wrapper - dialog handles visibility
  - The dialog element is always in the DOM but hidden when closed
  - This prevents unnecessary DOM creation/destruction
-->
<dialog
  bind:this={dialogElement}
  class={styles.dialog}
  oncancel={handleCancel}
  onclick={handleBackdropClick}
>
  {#if title}
    <h2 class={styles.title}>
      {title}
    </h2>
  {/if}

  {#if children}
    <div class={styles.content}>
      {@render children()}
    </div>
  {/if}
</dialog>