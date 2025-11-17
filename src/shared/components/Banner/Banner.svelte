<script lang="ts">
  /**
   * Reusable Banner component for displaying notifications and alerts.
   *
   * Learning Note:
   * This component demonstrates:
   * - Variant-based styling (info, warning, error, success)
   * - Flexible content with snippets
   * - Accessible alert patterns
   * - CSS Modules for scoped styles
   * - Type-safe variant handling with Record type
   */

  import styles from './Banner.module.css';
  import type { Snippet } from 'svelte';

  /**
   * Banner variant type.
   *
   * Learning Note - Union Types:
   * We define a union type for variants to ensure type safety.
   * This prevents typos and provides autocomplete in IDEs.
   */
  type BannerVariant = 'info' | 'warning' | 'error' | 'success';

  interface Props {
    /**
     * Banner variant determines color scheme and icon.
     */
    variant?: BannerVariant;

    /**
     * Banner title (optional).
     */
    title?: string;

    /**
     * Banner message content.
     */
    message?: string;

    /**
     * Custom icon (optional, defaults based on variant).
     */
    icon?: string;

    /**
     * Banner content (children) for custom layouts.
     */
    children?: Snippet;
  }

  let {
    variant = 'info',
    title,
    message,
    icon,
    children,
  }: Props = $props();

  /**
   * Default icons for each variant.
   *
   * Learning Note - Record Type:
   * Using Record<BannerVariant, string> ensures:
   * 1. All variants have an icon defined
   * 2. No extra keys can be added
   * 3. TypeScript will error if we miss a variant
   *
   * This is better than a plain object because it's type-safe!
   */
  const defaultIcons: Record<BannerVariant, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  };

  /**
   * Compute the icon to display.
   */
  const displayIcon = $derived(icon ?? defaultIcons[variant]);

  /**
   * Compute banner class with variant.
   */
  const bannerClass = $derived(
    [
      styles.banner,
      styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    ].join(' '),
  );
</script>

<div class={bannerClass} role="alert">
  <span class={styles.icon} aria-hidden="true">{displayIcon}</span>
  <div class={styles.content}>
    {#if title}
      <strong class={styles.title}>{title}</strong>
    {/if}
    {#if message}
      <p class={styles.message}>{message}</p>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
