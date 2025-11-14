<script lang="ts">
  /**
   * Reusable ConfirmationModal component.
   *
   * Learning Note:
   * This component wraps our Modal component to create a specialized
   * confirmation dialog. It demonstrates component composition - building
   * complex components from simpler ones.
   */

  import styles from './ConfirmationModal.module.css';
  import Button from '../Button/Button.svelte';
  import Modal from '../Modal/Modal.svelte';

  interface Props {
    /**
     * Whether the modal is open.
     */
    isOpen?: boolean;

    /**
     * Modal title.
     */
    title?: string;

    /**
     * Confirmation message.
     */
    message: string;

    /**
     * Confirm button text.
     */
    confirmText?: string;

    /**
     * Cancel button text.
     */
    cancelText?: string;

    /**
     * Confirm button variant (danger for destructive actions).
     */
    confirmVariant?: 'primary' | 'danger';

    /**
     * Callback when user confirms.
     */
    onConfirm: () => void;

    /**
     * Callback when user cancels.
     */
    onCancel: () => void;
  }

  let {
    isOpen = false,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'primary',
    onConfirm,
    onCancel,
  }: Props = $props();
</script>

<Modal {isOpen} onClose={onCancel} {title}>
  <div class={styles.content}>
    <p class={styles.message}>{message}</p>

    <div class={styles.actions}>
      <Button variant="secondary" onclick={onCancel}>
        {cancelText}
      </Button>
      <Button variant={confirmVariant} onclick={onConfirm}>
        {confirmText}
      </Button>
    </div>
  </div>
</Modal>
