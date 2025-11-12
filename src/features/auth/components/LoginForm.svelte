<script lang="ts">
  /**
 * LoginForm component for user authentication.
 *
 * Learning Note - Svelte vs React Forms:
 *
 * React approach:
 * - useState for each field
 * - onChange handlers for each input
 * - Controlled components with value prop
 * - Manual form submission handling
 *
 * Svelte approach:
 * - $state rune for reactive variables
 * - bind:value for two-way binding (no onChange needed!)
 * - Simple form submission
 * - Much less boilerplate!
 *
 * Key Svelte features demonstrated:
 * - $state rune for reactive state
 * - $derived for computed values
 * - bind:value for two-way binding
 * - Event handlers (on:submit, on:click)
 * - Conditional rendering ({#if})
 * - CSS Modules for scoped styles
 */

  import Button from '@/shared/components/Button/Button.svelte';
  import Input from '@/shared/components/Input/Input.svelte';
  import styles from './LoginForm.module.css';
  import { authService } from '../services/authService';

  /*
 * Form field state using Svelte 5 runes.
 *
 * Learning Note - $state rune:
 * In Svelte 5, $state creates reactive variables.
 * When these change, the UI automatically updates!
 *
 * Compare to React:
 * const [username, setUsername] = useState('');
 * const [password, setPassword] = useState('');
 *
 * Svelte is simpler - just declare and use!
 */
  let username = $state('');
  let password = $state('');
  let error = $state('');
  let isLoading = $state(false);

  /*
 * Computed value using $derived rune.
 *
 * Learning Note - $derived rune:
 * Automatically recomputes when dependencies change.
 * Similar to React's useMemo but without dependency array!
 *
 * Compare to React:
 * const isFormValid = useMemo(() =>
 *   username.length >= 3 && password.length >= 3,
 *   [username, password]
 * );
 *
 * Svelte tracks dependencies automatically!
 */
  const isFormValid = $derived(username.length >= 3 && password.length >= 3);

  /**
 * Handles form submission.
 * Calls authService to authenticate user.
 *
 * Learning Note:
 * This is a regular async function, no special hooks needed!
 * In React, you might use useCallback to prevent recreating the function.
 * In Svelte, functions are just functions!
 */
  async function handleSubmit(event: SubmitEvent) {
    /*
   * Prevent default form submission (page reload).
   * Same as React!
   */
    event.preventDefault();

    /*
   * Clear any previous errors.
   */
    error = '';

    /*
   * Set loading state.
   * This disables the button and shows loading indicator.
   */
    isLoading = true;

    try {
      /*
     * Call auth service to log in.
     * This is an async operation (simulates API call).
     */
      const result = await authService.login(username, password);

      if (result.success) {
        /*
       * Login successful!
       * The authService already updated the store,
       * so the app will automatically show the main view.
       *
       * Learning Note:
       * No need to manually navigate or update state here.
       * The store update triggers reactivity throughout the app!
       */
        console.log('Login successful:', result.user.name);
      } else {
        /*
       * Login failed, show error message.
       */
        error = result.error;
      }
    } catch (err) {
      /*
     * Unexpected error (network issue, etc.)
     */
      error = 'An unexpected error occurred. Please try again.';
      console.error('Login error:', err);
    } finally {
      /*
     * Always reset loading state.
     */
      isLoading = false;
    }
  }
</script>

<!--
  Template section.

  Learning Note:
  Svelte templates look like HTML but with special syntax:
  - {variable} for interpolation
  - bind:value for two-way binding
  - on:event for event handlers
  - class: for dynamic classes
  - {#if} for conditionals
-->

<div class={styles.container}>
  <div class={styles.card}>
    <h1 class={styles.title}>Welcome to TaskFlow</h1>
    <p class={styles.subtitle}>Sign in to manage your tasks</p>

    <form class={styles.form} onsubmit={handleSubmit}>
      <!--
        Username input with two-way binding.

        Learning Note - bind:value:
        This is Svelte's killer feature!

        React way:
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        Svelte way:
        <input bind:value={username} />

        Much simpler! The binding is bidirectional:
        - Input changes update the variable
        - Variable changes update the input
      -->
      <div class={styles.field}>
        <label for="username" class={styles.label}>Username</label>
        <Input
          id="username"
          type="text"
          bind:value={username}
          placeholder="Enter username"
          disabled={isLoading}
          required
        />
      </div>

      <div class={styles.field}>
        <label for="password" class={styles.label}>Password</label>
        <Input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Enter password"
          disabled={isLoading}
          required
        />
      </div>

      <!--
        Error message with conditional rendering.

        Learning Note - {#if}:
        Svelte's conditional rendering is clean and readable.

        React way:
        {error && <div className="error">{error}</div>}

        Svelte way:
        {#if error}
          <div class="error">{error}</div>
        {/if}

        More explicit and easier to read!
      -->
      {#if error}
        <div class={styles.error}>{error}</div>
      {/if}

      <!--
        Submit button with dynamic disabled state.

        Learning Note:
        We can use JavaScript expressions directly in attributes.
        No need for ternary operators or complex logic!
      -->
      <!--
        Button text with conditional rendering.

        Learning Note - Conditional Text in Svelte:
        You have three options:

        1. Ternary (works, but not idiomatic Svelte):
           {isLoading ? 'Signing in...' : 'Sign In'}

        2. {#if} block (more Svelte-like):
           {#if isLoading}
             Signing in...
           {:else}
             Sign In
           {/if}

        3. For simple cases, ternary is fine, but {#if} is more readable
           for complex conditions or multiple elements.

        We'll use {#if} to be more idiomatic!
      -->
      <Button
        type="submit"
        variant="primary"
        size="large"
        disabled={!isFormValid}
        loading={isLoading}
      >
        {#if isLoading}
          Signing in...
        {:else}
          Sign In
        {/if}
      </Button>
    </form>

    <!--
      Helper text showing available test accounts.
    -->
    <div class={styles.hint}>
      <p class={styles.hintTitle}>Test Accounts:</p>
      <p class={styles.hintText}>
        alice / bob / charlie<br />
        Password: password123
      </p>
    </div>
  </div>
</div>

<!--
  Styles section.

  Learning Note - CSS Modules in Svelte:
  We import styles from a .module.css file.
  This gives us:
  - Scoped styles (no conflicts)
  - Type safety (TypeScript knows the class names)
  - Better organization (styles in separate file)

  Alternative: You could use <style> tag for component-scoped CSS,
  but CSS Modules are more flexible and reusable.
-->
