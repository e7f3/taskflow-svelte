<!--
  Main App component - Root component that handles authentication flow.
  
  Learning Note - App Architecture:
  This component demonstrates:
  - Conditional rendering based on auth state
  - Session restoration on app load
  - Coordinating multiple features (auth, tasks)
  - Reactive store subscriptions
  
  Compare to React:
  - React: Would use useEffect for onMount, useSelector for store
  - Svelte: onMount hook + $ prefix for stores
  - Svelte's approach is simpler and more declarative
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import LoginForm from '@/features/auth/components/LoginForm.svelte';
  import { authService } from '@/features/auth/services/authService';
  import { authStore } from '@/features/auth/stores/authStore';
  import Board from '@/features/tasks/components/Board/Board.svelte';
  import { taskService } from '@/features/tasks/services/taskService';
  import Header from '@/shared/components/Header/Header.svelte';

  /**
   * Subscribe to auth store.
   * 
   * Learning Note - Store Subscriptions:
   * The $ prefix automatically subscribes to the store.
   * When authStore updates, this component re-renders.
   * 
   * This is reactive by default - no need for:
   * - useEffect dependencies
   * - Manual subscription/unsubscription
   * - Memoization
   */
  const auth = $derived($authStore);

  /**
   * Compute authentication status.
   * 
   * Learning Note - Derived Values:
   * $derived creates a computed value that updates automatically.
   * Similar to React's useMemo but simpler - no dependency array!
   */
  const isAuthenticated = $derived(auth.isAuthenticated);

  /**
   * Initialize app on mount.
   * 
   * Learning Note - Lifecycle:
   * onMount runs after component is first rendered.
   * Similar to React's useEffect with empty dependency array.
   * 
   * Key differences:
   * - Svelte: onMount(() => { ... })
   * - React: useEffect(() => { ... }, [])
   * 
   * Svelte's onMount is simpler and more explicit.
   */
  onMount(() => {
    /*
     * Try to restore previous session from localStorage.
     * If successful, user is automatically logged in.
     * 
     * This provides a seamless experience:
     * - User logs in once
     * - Session persists across page refreshes
     * - No need to log in again until session expires
     */
    authService.restoreSession();

    /*
     * Load tasks after session restoration.
     * 
     * Note: We load tasks here regardless of auth state because:
     * - Tasks are stored in localStorage (no server)
     * - They're available even when logged out
     * - In production, you'd only load after authentication
     * 
     * Learning Note:
     * In a real app with a backend, you'd:
     * 1. Restore session
     * 2. Check if authenticated
     * 3. Only then fetch tasks from API
     */
    taskService.loadTasks();
  });
</script>

<!--
  Learning Note - Conditional Rendering:
  
  Svelte uses {#if} blocks for conditional rendering.
  This is more readable than JSX's ternary operators or && operators.
  
  Compare:
  - React: {isAuthenticated ? <Board /> : <LoginForm />}
  - Svelte: {#if isAuthenticated} <Board /> {:else} <LoginForm /> {/if}
  
  Svelte's syntax is:
  - More explicit
  - Easier to read
  - Supports {:else if} for multiple conditions
  - No need for fragments
-->
<main>
  {#if isAuthenticated}
    <!--
      Authenticated view:
      - Header with user info and logout
      - Board with tasks and filters
      
      Learning Note:
      These components automatically react to store changes.
      When user logs out, this entire block disappears.
    -->
    <Header />
    <div class="content">
      <Board />
    </div>
  {:else}
    <!--
      Not authenticated view:
      - Login form
      
      Learning Note:
      When user logs in, LoginForm disappears and Board appears.
      This happens automatically through store reactivity!
    -->
    <div class="loginContainer">
      <LoginForm />
    </div>
  {/if}
</main>

<!--
  Learning Note - Scoped Styles:
  
  Styles in Svelte components are scoped by default.
  No need for CSS Modules or CSS-in-JS!
  
  These styles only apply to this component.
  Child components (Header, Board) have their own styles.
-->
<style>
  main {
    display: flex;
    flex-direction: column;

    min-height: 100vh;

    font-family: var(--font-family, sans-serif);

    background-color: #f5f5f5;
  }

  /*
   * Content area for authenticated view.
   * Contains the Board component.
   */
  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  /*
   * Login container - centers the login form.
   *
   * Learning Note:
   * We use flexbox to center the login form both
   * horizontally and vertically on the page.
   */
  .loginContainer {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;

    min-height: 100vh;
    padding: var(--spacing-lg);
  }
</style>

<!--
  Learning Note - Why This Pattern Works:
  
  1. Single Source of Truth:
     - authStore holds authentication state
     - All components react to it
     - No prop drilling needed
  
  2. Automatic Reactivity:
     - Login updates authStore
     - App re-renders automatically
     - Shows authenticated view
  
  3. Session Persistence:
     - Session saved to localStorage
     - Restored on app load
     - User stays logged in
  
  4. Clean Separation:
     - App handles routing (login vs main)
     - Header handles user display
     - Board handles tasks
     - Each component has clear responsibility
  
  Compare to React:
  - React: Need Context Provider, useContext, useEffect
  - Svelte: Just import store and use $ prefix
  - Much simpler!
  
  This is the power of Svelte's reactivity system!
-->
