<script lang="ts">
  /**
   * Reusable Select component.
   *
   * Learning Note:
   * This component wraps a native <select> element with consistent styling.
   * It uses $bindable() for two-way binding with parent components.
   */

  import styles from './Select.module.css';
  import type { Snippet } from 'svelte';

  interface Props {
    /**
     * Selected value (controlled component).
     */
    value: string | number | null;

    /**
     * Select ID for label association.
     */
    id?: string;

    /**
     * Whether the select is disabled.
     */
    disabled?: boolean;

    /**
     * Whether the select is required.
     */
    required?: boolean;

    /**
     * Error message to display.
     */
    error?: string;

    /**
     * Additional CSS class.
     */
    class?: string;

    /**
     * Select options (children).
     */
    children?: Snippet;
  }

  let {
    value = $bindable(),
    id,
    disabled = false,
    required = false,
    error,
    class: className,
    children,
  }: Props = $props();

  let selectClass = $derived(
    [
      styles.select,
      error ? styles.selectError : '',
      className || '',
    ].filter(Boolean).join(' '),
  );
</script>

<select
  {id}
  {disabled}
  {required}
  bind:value
  class={selectClass}
  aria-invalid={!!error}
>
  {@render children?.()}
</select>
