/**
 * Authentication feature type definitions.
 *
 * This file contains all types related to user authentication,
 * user profiles, and session management.
 */

import type { EntityId } from '@/shared/types/common.types';

/**
 * Represents a user in the system.
 * Used for authentication and task assignment.
 *
 * Learning Note:
 * In Svelte (unlike React), you don't need to worry about object reference
 * equality for reactivity. Svelte's compiler tracks changes at the property level.
 */
export interface User {
  /**
   * Unique identifier for the user.
   * Generated using crypto.randomUUID().
   *
   * Example: "550e8400-e29b-41d4-a716-446655440000"
   */
  id: EntityId;

  /**
   * Username for login authentication.
   * Must be unique across all users.
   * Used in the login form.
   *
   * Constraints:
   * - Required field
   * - Must be unique
   * - Case-sensitive
   *
   * Example: "alice", "bob"
   */
  username: string;

  /**
   * Display name shown in the UI.
   * Can contain spaces and special characters.
   * Shown in the header and task cards.
   *
   * Example: "Alice Johnson", "Bob Smith"
   */
  name: string;

  /**
   * Optional emoji or image URL for user avatar.
   * Displayed in task cards and user selection dropdowns.
   *
   * In this app, we use emoji for simplicity.
   * In production, this would typically be an image URL.
   *
   * Example: "👩‍💼", "👨‍💻", "https://example.com/avatar.jpg"
   */
  avatar?: string;
}

/**
 * Authentication state for the application.
 * Tracks current user session and authentication status.
 *
 * Learning Note:
 * This interface defines the shape of our auth store.
 * In React with Redux, this would be part of your root state.
 * In Svelte, this is the type for a single store.
 */
export interface AuthState {
  /**
   * Whether a user is currently logged in.
   * Controls routing between login screen and main app.
   *
   * When true: Show main app (Header + Board)
   * When false: Show LoginForm
   */
  isAuthenticated: boolean;

  /**
   * Currently authenticated user object.
   * Null when no user is logged in.
   *
   * Used to:
   * - Display user info in header
   * - Set createdBy field on new tasks
   * - Filter "my tasks"
   */
  currentUser: User | null;

  /**
   * Session token for maintaining authentication.
   * Stored in localStorage for session persistence.
   *
   * In this mock app, it's a simple string.
   * In production, this would be a JWT or similar secure token.
   *
   * Example: "mock-token-1-1704067200000"
   */
  sessionToken: string | null;
}

/**
 * Credentials submitted during login.
 * Used by the LoginForm component.
 *
 * Learning Note:
 * We keep this separate from User because login data
 * is different from stored user data (e.g., includes password).
 */
export interface LoginCredentials {
  /**
   * Username entered in login form.
   */
  username: string;

  /**
   * Password entered in login form.
   * Never stored or logged in production!
   */
  password: string;
}

/**
 * Result of a login attempt.
 * Returned by authService.login().
 *
 * Learning Note:
 * This is a discriminated union type - TypeScript can narrow
 * the type based on the 'success' field.
 */
export type LoginResult =
  | {
      /**
       * Login succeeded.
       */
      success: true;
      /**
       * The authenticated user.
       */
      user: User;
    }
  | {
      /**
       * Login failed.
       */
      success: false;
      /**
       * Error message to display to user.
       * Example: "Invalid username or password"
       */
      error: string;
    };
