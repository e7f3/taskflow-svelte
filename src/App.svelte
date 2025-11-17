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
  import LoginForm from '@/features/auth/components/LoginForm.svelte';
  import { authService } from '@/features/auth/services/authService';
  import { authStore } from '@/features/auth/stores/authStore';
  import Board from '@/features/tasks/components/Board/Board.svelte';
  import { taskService } from '@/features/tasks/services/taskService';
  import Banner from '@/shared/components/Banner/Banner.svelte';
  import Header from '@/shared/components/Header/Header.svelte';
  import { storageService } from '@/shared/services/storageService';

  /**
   * Check localStorage availability.
   *
   * Learning Note - Graceful Degradation:
   * We check if localStorage is available before using it.
   * If not available (private browsing, disabled, etc.),
   * the app continues to work with in-memory state only.
   *
   * This is a best practice for web apps:
   * - Don't assume browser features are available
   * - Provide fallback behavior
   * - Inform user of limitations
   */
  const isStorageAvailable = storageService.isAvailable();

  /**
   * Error state for initialization failures.
   *
   * Learning Note - Error Handling:
   * We track errors that occur during initialization
   * to show user-friendly error messages.
   */
  let initError = $state<string | null>(null);

  /**
   * Restore session BEFORE component renders.
   *
   * Learning Note - Svelte vs React useLayoutEffect:
   *
   * React approach:
   * ```jsx
   * useLayoutEffect(() => {
   *   restoreSession();
   * }, []);
   * ```
   *
   * Svelte approach:
   * - Code at module level runs before component mounts
   * - Similar to useLayoutEffect but even earlier
   * - Runs synchronously during module evaluation
   *
   * This prevents flash of login form because:
   * 1. Session restored before first render
   * 2. Store updated before component subscribes
   * 3. Component renders with correct auth state
   *
   * We wrap in try-catch for error handling without needing loading state!
   */
  try {
    authService.restoreSession();
    taskService.loadTasks();
  } catch (error) {
    /**
     * Handle initialization errors.
     * Log for debugging and show user-friendly message.
     */
    console.error('Failed to initialize app:', error);
    initError = 'Failed to load application. Please refresh the page.';
  }

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
   * 
   * Because we restored the session above, this will
   * already have the correct value on first render!
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
  
  No loading state needed because session is restored
  before component renders (similar to useLayoutEffect)!
-->
<main>
  <!--
    Error state - shown if initialization fails.
    
    Learning Note - Error Handling UX:
    When something goes wrong during initialization, we:
    - Show a clear error message
    - Explain what happened
    - Suggest next steps (refresh page)
    - Use error variant for visual distinction
  -->
  {#if initError}
    <Banner variant="error" title="Initialization Error" message={initError} />
  {/if}

  <!--
    Storage availability warning banner.
    
    Learning Note - Graceful Degradation UI:
    When a feature is unavailable, we:
    1. Show a clear warning to the user
    2. Explain what's affected
    3. Let the app continue working
    
    This is better than:
    - Blocking the entire app
    - Showing a cryptic error
    - Silently failing
    
    We use the reusable Banner component with the warning variant.
  -->
  {#if !isStorageAvailable}
    <Banner
      variant="warning"
      title="Storage Unavailable"
      message="Your data won't be saved between sessions. This may be due to private browsing mode or browser settings."
    />
  {/if}

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
      
      Note: LoginForm handles its own layout and background,
      so we render it directly without a wrapper.
    -->
    <LoginForm />
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
