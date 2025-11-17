<script lang="ts">
  /**
   * Reusable Textarea component.
   *
   * Learning Note:
   * This component wraps a native <textarea> element with consistent styling.
   * It supports auto-resizing and all standard textarea attributes.
   */

  import styles from './Textarea.module.css';

  interface Props {
    /**
     * Textarea value (controlled component).
     */
    value: string;

    /**
     * Textarea ID for label association.
     */
    id?: string;

    /**
     * Placeholder text.
     */
    placeholder?: string;

    /**
     * Whether the textarea is disabled.
     */
    disabled?: boolean;

    /**
     * Whether the textarea is required.
     */
    required?: boolean;

    /**
     * Number of visible rows.
     */
    rows?: number;

    /**
     * Error message to display.
     */
    error?: string;

    /**
     * Additional CSS class.
     */
    class?: string;
  }

  let {
    value = $bindable(),
    id,
    placeholder,
    disabled = false,
    required = false,
    rows = 3,
    error,
    class: className,
  }: Props = $props();

  let textareaClass = $derived(
    [
      styles.textarea,
      error ? styles.textareaError : '',
      className || '',
    ].filter(Boolean).join(' '),
  );
</script>

<textarea
  {id}
  {placeholder}
  {disabled}
  {required}
  {rows}
  bind:value
  class={textareaClass}
  aria-invalid={!!error}
></textarea>
