/**
 * Authentication store implementation.
 *
 * Learning Note - Svelte Stores vs Redux:
 *
 * Redux approach:
 * - Create action types (LOGIN, LOGOUT)
 * - Create action creators
 * - Create reducer with switch statement
 * - Use dispatch() to update state
 * - Use useSelector() to read state
 * - Lots of boilerplate!
 *
 * Svelte approach:
 * - Create a writable store
 * - Add custom methods for updates
 * - Subscribe with $ prefix
 * - Much simpler!
 *
 * Key differences:
 * - No actions/reducers - just methods
 * - No dispatch - call methods directly
 * - No selectors - subscribe directly
 * - Automatic reactivity with $store syntax
 *
 * @example
 * ```svelte
 * <script>
 *   import { authStore } from './stores/authStore';
 *
 *   // Read state (automatically reactive)
 *   let isAuthenticated = $derived($authStore.isAuthenticated);
 *
 *   // Update state
 *   function login() {
 *     authStore.setAuthenticated(user, token);
 *   }
 * </script>
 * ```
 */

import { writable } from 'svelte/store';
import type { AuthStore } from './authStore.types';
import type { AuthState, User } from '../types/auth.types';

/**
 * Initial authentication state.
 * User starts logged out.
 */
const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  sessionToken: null,
};

/**
 * Creates the authentication store with custom methods.
 *
 * Learning Note - Store Factory Pattern:
 * We wrap the store creation in a function to add custom methods.
 * This is similar to Redux Toolkit's createSlice but simpler.
 *
 * The pattern:
 * 1. Create writable store
 * 2. Destructure subscribe, set, update
 * 3. Return object with subscribe + custom methods
 * 4. Custom methods use set/update internally
 *
 * Why this pattern?
 * - Encapsulates update logic
 * - Provides clear API
 * - Prevents direct state mutation
 * - Similar to Redux actions but without boilerplate
 *
 * @returns Typed auth store implementing AuthStore interface
 */
function createAuthStore(): AuthStore {
  /*
   * Create the base writable store.
   *
   * writable() creates a store that can be:
   * - Read with subscribe() or $ prefix
   * - Updated with set() or update()
   */
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    /*
     * Expose subscribe, set, and update from the writable store.
     * These are required by the Writable interface.
     *
     * Learning Note:
     * - subscribe: Allows components to read with $ syntax
     * - set: Allows direct state replacement (used internally)
     * - update: Allows state updates based on current value (used internally)
     *
     * In React, you'd use useSelector(state => state.auth).
     * In Svelte, you just use $authStore in components.
     */
    subscribe,
    set,
    update,

    setAuthenticated(user: User, token: string) {
      /*
       * set() replaces the entire store value.
       *
       * Learning Note:
       * Unlike Redux where you must return a new object,
       * Svelte's set() handles immutability for you.
       * You just pass the new state!
       */
      set({
        isAuthenticated: true,
        currentUser: user,
        sessionToken: token,
      });
    },

    clearAuthentication() {
      /*
       * Reset to initial state.
       * All subscribers are notified automatically.
       */
      set(initialState);
    },

    updateUser(user: User) {
      /*
       * update() is useful when you need the current state.
       * It receives current state and returns new state.
       *
       * Learning Note:
       * This is like a Redux reducer but without the switch statement!
       */
      update((state) => ({
        ...state,
        currentUser: user,
      }));
    },
  };
}

/**
 * Global authentication store instance.
 * Import and use this in components and services.
 *
 * Learning Note - Store as Singleton:
 * Unlike React Context which needs a Provider,
 * Svelte stores are just imported directly.
 * They're singletons - one instance shared across the app.
 *
 * This is simpler than:
 * - Redux: createStore, Provider, useSelector
 * - React Context: createContext, Provider, useContext
 *
 * Just import and use!
 *
 * @example
 * ```svelte
 * <script>
 *   import { authStore } from '@/features/auth/stores/authStore';
 *
 *   // Reactive subscription (automatically updates)
 *   let user = $derived($authStore.currentUser);
 *
 *   // Call methods
 *   function logout() {
 *     authStore.clearAuthentication();
 *   }
 * </script>
 *
 * {#if $authStore.isAuthenticated}
 *   <p>Welcome, {$authStore.currentUser?.name}!</p>
 *   <button onclick={logout}>Logout</button>
 * {/if}
 * ```
 */
export const authStore = createAuthStore();

/*
 * Re-export types for convenience.
 */
export type { AuthStore } from './authStore.types';

/*
 * Learning Note - Why this pattern works:
 *
 * 1. Simple API: Just import and use
 * 2. Type-safe: TypeScript knows the shape via AuthStore interface
 * 3. Reactive: $ prefix auto-subscribes
 * 4. Testable: Easy to mock the AuthStore interface
 * 5. No boilerplate: No actions, reducers, or middleware
 *
 * Compare to Redux:
 * - Redux: ~50 lines (actions, reducer, types)
 * - Svelte: ~20 lines (just the store)
 *
 * Both do the same thing, but Svelte is much simpler!
 *
 * Benefits of typed interface:
 * - Clear API contract
 * - Better IDE autocomplete
 * - Easier to mock for testing
 * - Self-documenting code
 */
