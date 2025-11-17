<script lang="ts">
  /**
   * Reusable Spinner component for loading states.
   *
   * Learning Note:
   * A simple, accessible loading spinner using CSS animations.
   * Uses ARIA attributes for screen reader support.
   */

  import styles from './Spinner.module.css';

  interface Props {
    /**
     * Size of the spinner.
     */
    size?: 'small' | 'medium' | 'large';

    /**
     * Optional label for accessibility.
     */
    label?: string;
  }

  let { size = 'medium', label = 'Loading...' }: Props = $props();

  /**
   * Compute spinner class with size.
   */
  const spinnerClass = $derived(
    [
      styles.spinner,
      styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    ].join(' '),
  );
</script>

<div class={styles.container} role="status" aria-live="polite">
  <div class={spinnerClass} aria-label={label}></div>
  <span class={styles.srOnly}>{label}</span>
</div>
