<!--
  Header component - Application header with branding and user info.
  
  Learning Note - Component Structure:
  Svelte 5 components use the new runes syntax:
  - $props() for component props
  - $derived() for computed values
  - $state() for local state
  
  This is simpler than React's useState, useMemo, etc.
  Everything is just reactive by default!
-->
<script lang="ts">
  import { authService } from '@/features/auth/services/authService';
  import { authStore } from '@/features/auth/stores/authStore';
  import Button from '@/shared/components/Button/Button.svelte';
  import styles from './Header.module.css';

  /**
   * Learning Note - Store Subscriptions:
   * 
   * In Svelte, the $ prefix automatically subscribes to a store.
   * The component will re-render whenever the store updates.
   * 
   * Compare to React:
   * - React: const auth = useSelector(state => state.auth)
   * - Svelte: const auth = $authStore
   * 
   * Svelte's approach is:
   * - More concise
   * - No hooks rules
   * - Automatic cleanup
   * - Works anywhere in the component
   */
  const auth = $derived($authStore);

  /**
   * Handle logout button click.
   * Calls authService.logout() which:
   * 1. Clears the auth store
   * 2. Removes session from localStorage
   * 3. Triggers re-render showing login screen
   * 
   * Learning Note:
   * No need for useCallback in Svelte!
   * Functions are stable by default.
   */
  function handleLogout() {
    authService.logout();
  }
</script>

<!--
  Learning Note - Template Syntax:
  
  Svelte templates use standard HTML with special directives:
  - {expression} for dynamic content
  - {#if} for conditionals
  - {#each} for loops
  - class:name={condition} for conditional classes
  
  This is more intuitive than JSX!
-->
<header class={styles.header}>
  <div class={styles.container}>
    <!-- App branding -->
    <div class={styles.branding}>
      <h1 class={styles.title}>TaskFlow</h1>
    </div>

    <!-- User info and logout -->
    {#if auth.isAuthenticated && auth.currentUser}
      <div class={styles.userSection}>
        <div class={styles.userInfo}>
          {#if auth.currentUser.avatar}
            <span class={styles.avatar} aria-hidden="true">
              {auth.currentUser.avatar}
            </span>
          {/if}
          <span class={styles.userName}>{auth.currentUser.name}</span>
        </div>

        <Button
          variant="secondary"
          size="small"
          onclick={handleLogout}
        >
          Logout
        </Button>
      </div>
    {/if}
  </div>
</header>

<!--
  Learning Note - Why Svelte is Great for Headers:
  
  1. Automatic Reactivity:
     - No need to manually subscribe/unsubscribe
     - No useEffect cleanup
     - Just works!
  
  2. Simple Conditionals:
     - {#if} is clearer than {condition && <Component />}
     - No need for ternaries
     - More readable
  
  3. No Props Drilling:
     - Stores are global
     - Import anywhere
     - No Context Provider needed
  
  4. Scoped Styles:
     - CSS Modules keep styles isolated
     - No className conflicts
     - No CSS-in-JS runtime
-->
