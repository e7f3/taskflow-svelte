/**
 * Type definitions for the authentication service.
 *
 * Learning Note:
 * Services handle business logic and side effects.
 * They coordinate between stores, APIs, and other services.
 *
 * In React/Redux terms, services are like:
 * - Redux Thunks (async actions)
 * - Redux Sagas (side effect management)
 * - Custom hooks (but simpler, no rules of hooks!)
 *
 * But in Svelte, they're just plain TypeScript functions!
 */

import type { Timestamp } from '@/shared/types/common.types';
import type { User, LoginResult } from '../types/auth.types';

/**
 * Authentication service interface.
 * Defines all authentication operations.
 *
 * Learning Note:
 * This interface makes it easy to:
 * - Mock for testing
 * - Swap implementations (e.g., real API vs mock)
 * - Document the API contract
 * - Get IDE autocomplete
 */
export interface AuthService {
  /**
   * Attempts to authenticate a user with provided credentials.
   * On success, updates auth store and persists session.
   *
   * Flow:
   * 1. Validate credentials against mock data
   * 2. Generate session token
   * 3. Update authStore
   * 4. Persist to localStorage
   * 5. Return result
   *
   * @param username - The username to authenticate
   * @param password - The password to verify
   * @returns Promise resolving to login result (success or error)
   *
   * @example
   * ```typescript
   * const result = await authService.login('alice', 'password123');
   * if (result.success) {
   *   console.log('Logged in as:', result.user.name);
   * } else {
   *   console.error('Login failed:', result.error);
   * }
   * ```
   */
  login(username: string, password: string): Promise<LoginResult>;

  /**
   * Logs out the current user.
   * Clears auth store and removes persisted session.
   *
   * Flow:
   * 1. Clear authStore
   * 2. Remove from localStorage
   *
   * @example
   * ```typescript
   * authService.logout();
   * // User is now logged out, app shows login screen
   * ```
   */
  logout(): void;

  /**
   * Attempts to restore a previous session from storage.
   * Called on app initialization.
   *
   * Flow:
   * 1. Check localStorage for saved session
   * 2. If found, validate and restore to authStore
   * 3. Return whether session was restored
   *
   * @returns True if session was restored, false otherwise
   *
   * @example
   * ```typescript
   * // On app mount
   * const restored = authService.restoreSession();
   * if (restored) {
   *   console.log('Welcome back!');
   * }
   * ```
   */
  restoreSession(): boolean;

  /**
   * Gets all available users (for development/demo).
   * In production, this would come from an API.
   *
   * @returns Array of all users
   *
   * @example
   * ```typescript
   * const users = authService.getAllUsers();
   * // Use for assignee dropdown, etc.
   * ```
   */
  getAllUsers(): User[];
}

/**
 * Stored session data structure.
 * This is what gets saved to localStorage.
 *
 * Learning Note:
 * We separate this from AuthState because:
 * - Storage format might differ from runtime state
 * - We might not want to persist everything
 * - Makes it explicit what gets saved
 */
export interface StoredSession {
  /**
   * The authenticated user.
   */
  user: User;

  /**
   * Session token for authentication.
   */
  token: string;

  /**
   * Timestamp when session was created.
   * Could be used for session expiration.
   * Generated using Date.now().
   */
  createdAt: Timestamp;
}
