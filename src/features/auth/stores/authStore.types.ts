/**
 * Type definitions for the authentication store.
 *
 * Learning Note:
 * Separating store types from implementation provides:
 * - Clear API contract
 * - Better IDE autocomplete
 * - Easier testing (can mock the interface)
 * - Self-documenting code
 */

import type { AuthState, User } from '../types/auth.types';
import type { Writable } from 'svelte/store';

/**
 * Authentication store interface.
 * Defines all methods available on the auth store.
 *
 * Learning Note:
 * This extends Writable to include Svelte's subscribe method,
 * plus our custom methods for auth operations.
 *
 * In React/Redux terms, this is like:
 * - The store interface (what you can do with the store)
 * - Action creators (the methods)
 * - Selectors (via subscribe/$store)
 * All in one clean interface!
 */
export interface AuthStore extends Writable<AuthState> {
  /**
   * Sets authenticated state with user and token.
   * Called by authService after successful login.
   *
   * This updates the store to indicate the user is logged in
   * and stores their information and session token.
   *
   * @param user - Authenticated user object
   * @param token - Session token for maintaining the session
   *
   * @example
   * ```typescript
   * // After successful login
   * authStore.setAuthenticated(user, 'token-123');
   * ```
   */
  setAuthenticated(user: User, token: string): void;

  /**
   * Clears authentication state and returns to logged-out state.
   * Called by authService on logout.
   *
   * This resets the store to its initial state:
   * - isAuthenticated: false
   * - currentUser: null
   * - sessionToken: null
   *
   * @example
   * ```typescript
   * // On logout button click
   * authStore.clearAuthentication();
   * ```
   */
  clearAuthentication(): void;

  /**
   * Updates only the current user information.
   * Keeps authentication state intact (user stays logged in).
   *
   * Useful for:
   * - Profile updates (name, avatar)
   * - Preference changes
   * - Any user data update that doesn't require re-authentication
   *
   * @param user - Updated user object
   *
   * @example
   * ```typescript
   * // After user updates their profile
   * const updatedUser = { ...currentUser, name: 'New Name' };
   * authStore.updateUser(updatedUser);
   * ```
   */
  updateUser(user: User): void;
}
