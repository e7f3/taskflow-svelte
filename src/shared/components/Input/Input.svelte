<script lang="ts">
  /**
 * Reusable Input component.
 * 
 * Learning Note:
 * This is a controlled input component that uses Svelte 5's $props() rune.
 * It supports all standard HTML input attributes and adds custom styling.
 */

  import styles from './Input.module.css';

  interface Props {
    /**
   * Input value (controlled component).
   */
    value: string;
  
    /**
   * Input type (text, password, email, etc.).
   */
    type?: string;
  
    /**
   * Input ID for label association.
   */
    id?: string;
  
    /**
   * Placeholder text.
   */
    placeholder?: string;
  
    /**
   * Whether the input is disabled.
   */
    disabled?: boolean;
  
    /**
   * Whether the input is required.
   */
    required?: boolean;
  
    /**
   * Error message to display.
   */
    error?: string;
  
    /**
   * ARIA invalid state.
   */
    'aria-invalid'?: boolean;
  
    /**
   * ARIA described by (for error messages).
   */
    'aria-describedby'?: string;
  
    /**
   * Additional CSS class.
   */
    class?: string;
  }

  let {
    value = $bindable(),
    type = 'text',
    id,
    placeholder,
    disabled = false,
    required = false,
    error,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedby,
    class: className,
  }: Props = $props();

  let inputClass = $derived(
    [
      styles.input,
      error ? styles.inputError : '',
      className || '',
    ].filter(Boolean).join(' '),
  );
</script>

<input
  {type}
  {id}
  {placeholder}
  {disabled}
  {required}
  bind:value
  class={inputClass}
  aria-invalid={ariaInvalid || !!error}
  aria-describedby={ariaDescribedby}
/>
