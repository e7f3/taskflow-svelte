<script lang="ts">
  /**
 * Reusable Button component.
 * 
 * Learning Note:
 * This component demonstrates Svelte 5's snippet feature for children content.
 * It supports different variants (primary, secondary, danger) and sizes.
 */

  import styles from './Button.module.css';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    /**
    * Button variant style.
   */
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  
    /**
   * Button size.
   */
    size?: 'small' | 'medium' | 'large';
  
    /**
   * Button type (button, submit, reset).
   */
    type?: 'button' | 'submit' | 'reset';
  
    /**
   * Whether the button is disabled.
   */
    disabled?: boolean;
  
    /**
   * Whether the button is in loading state.
   */
    loading?: boolean;
  
    /**
   * Click handler.
   */
    onclick?: (event: MouseEvent) => void;
  
    /**
   * Additional CSS class.
   */
    class?: string;
  
    /**
   * Button content (children).
   */
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'medium',
    type = 'button',
    disabled = false,
    loading = false,
    onclick,
    class: className,
    children,
    ...restProps
  }: Props = $props();

  let buttonClass = $derived(
    [
      styles.button,
      styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
      className || '',
    ].filter(Boolean).join(' '),
  );
</script>

<button
  {type}
  class={buttonClass}
  disabled={disabled || loading}
  {onclick}
  {...restProps}
>
  {#if loading}
    <span class={styles.spinner}></span>
  {/if}
  {@render children?.()}
</button>
