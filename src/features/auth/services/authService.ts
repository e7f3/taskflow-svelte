/**
 * Authentication service implementation.
 * Handles login, logout, and session management with mock data.
 * 
 * Learning Note - Services vs Stores:
 * - Stores: Hold state (what)
 * - Services: Handle logic (how)
 * 
 * This separation makes code:
 * - Easier to test (mock services, not stores)
 * - More maintainable (logic in one place)
 * - More reusable (services can be used anywhere)
 * 
 * In React/Redux:
 * - This would be a thunk or saga
 * - Much more complex setup
 * - More boilerplate
 * 
 * In Svelte:
 * - Just a plain object with methods
 * - Simple and straightforward
 * - No special setup needed
 */

import { authStore } from '../stores/authStore';
import { storageService, STORAGE_KEYS } from '@/shared/services/storageService';
import type { User, LoginResult } from '../types/auth.types';
import type { AuthService, StoredSession } from './authService.types';

/**
 * Mock user accounts for development and learning.
 * In production, this would come from a backend API.
 * 
 * Learning Note:
 * These are the test accounts you can use to log in:
 * - Username: alice, Password: password123
 * - Username: bob, Password: password123
 * - Username: charlie, Password: password123
 */
export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'alice',
    name: 'Alice Johnson',
    avatar: '👩‍💼',
  },
  {
    id: '2',
    username: 'bob',
    name: 'Bob Smith',
    avatar: '👨‍💻',
  },
  {
    id: '3',
    username: 'charlie',
    name: 'Charlie Davis',
    avatar: '👨‍🎨',
  },
];

/**
 * Mock credentials for authentication.
 * All users share the same password for simplicity.
 * 
 * In production:
 * - Passwords would be hashed and verified server-side
 * - Never store passwords in frontend code!
 * - Use secure authentication (OAuth, JWT, etc.)
 * 
 * Learning Note:
 * Record<User['username'], string> creates a type where:
 * - Keys must be valid usernames from User type
 * - Values are password strings
 * 
 * This is more type-safe than Record<string, string> because:
 * - TypeScript ensures keys match actual usernames
 * - Catches typos at compile time
 * - Self-documenting (shows which users exist)
 * 
 * Alternative approaches:
 * 1. Record<string, string> - too loose, any string key
 * 2. Record<User['username'], string> - better, but username is still string
 * 3. Record<typeof MOCK_USERS[number]['username'], string> - derives from actual users
 * 
 * We use approach 2 as a good balance of type safety and simplicity.
 */
export const MOCK_CREDENTIALS: Record<User['username'], string> = {
  alice: 'password123',
  bob: 'password123',
  charlie: 'password123',
};

/**
 * Authentication service implementation.
 * Implements the AuthService interface.
 * 
 * Learning Note:
 * We use a plain object instead of a class because:
 * - Simpler (no 'this' binding issues)
 * - No need for 'new' keyword
 * - Easier to tree-shake
 * - More functional style
 * - Still fully type-safe!
 */
export const authService: AuthService = {
  async login(username: string, password: string): Promise<LoginResult> {
    /*
     * Simulate network delay for realistic UX.
     * In production, this would be an actual API call.
     * 
     * Learning Note:
     * async/await works the same in Svelte as in React.
     * No special handling needed!
     */
    await new Promise((resolve) => setTimeout(resolve, 500));

    /*
     * Find user by username.
     * In production, this would be done server-side.
     */
    const user = MOCK_USERS.find((u) => u.username === username);

    /*
     * Validate credentials.
     * Check both user exists and password matches.
     */
    if (!user || MOCK_CREDENTIALS[username] !== password) {
      /*
       * Return error result.
       * 
       * Learning Note:
       * This is a discriminated union - TypeScript knows
       * when success is false, the error property exists.
       */
      return {
        success: false,
        error: 'Invalid username or password',
      };
    }

    /*
     * Generate mock session token.
     * In production, this would come from the server.
     * 
     * Format: "mock-token-{userId}-{timestamp}"
     */
    const token = `mock-token-${user.id}-${Date.now()}`;

    /*
     * Update the auth store.
     * This makes the user logged in throughout the app.
     * 
     * Learning Note:
     * All components subscribed to authStore will
     * automatically re-render with the new state!
     */
    authStore.setAuthenticated(user, token);

    /*
     * Persist session to localStorage.
     * This allows the user to stay logged in after page refresh.
     * 
     * Learning Note:
     * We use STORAGE_KEYS constant to avoid typos.
     * TypeScript ensures we use valid keys!
     */
    const session: StoredSession = {
      user,
      token,
      createdAt: Date.now(),
    };
    storageService.setItem(STORAGE_KEYS.AUTH, session);

    /*
     * Return success result.
     * 
     * Learning Note:
     * TypeScript knows when success is true,
     * the user property exists and error doesn't.
     */
    return {
      success: true,
      user,
    };
  },

  logout(): void {
    /*
     * Clear the auth store.
     * This logs the user out throughout the app.
     * 
     * Learning Note:
     * All components will automatically update to show
     * the login screen when isAuthenticated becomes false.
     */
    authStore.clearAuthentication();

    /*
     * Remove persisted session.
     * User will need to log in again on next visit.
     */
    storageService.removeItem(STORAGE_KEYS.AUTH);
  },

  restoreSession(): boolean {
    /*
     * Try to load saved session from localStorage.
     * Returns null if no session exists or parsing fails.
     */
    const stored = storageService.getItem<StoredSession>(STORAGE_KEYS.AUTH);

    /*
     * No saved session found.
     */
    if (!stored) {
      return false;
    }

    /*
     * Validate session data.
     * Make sure it has the required fields.
     * 
     * Learning Note:
     * In production, you'd also:
     * - Check if token is expired
     * - Validate token with server
     * - Handle invalid/corrupted data
     */
    if (!stored.user || !stored.token) {
      // Invalid session data, remove it
      storageService.removeItem(STORAGE_KEYS.AUTH);
      return false;
    }

    /*
     * Optional: Check if session is expired.
     * For example, expire after 7 days:
     * 
     * const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
     * if (Date.now() - stored.createdAt > SEVEN_DAYS) {
     *   storageService.removeItem(STORAGE_KEYS.AUTH);
     *   return false;
     * }
     */

    /*
     * Restore session to auth store.
     * User is now logged in!
     */
    authStore.setAuthenticated(stored.user, stored.token);

    return true;
  },

  getAllUsers(): User[] {
    /*
     * Return all mock users.
     * Used for assignee dropdowns, user lists, etc.
     * 
     * Learning Note:
     * In production, this would be an API call:
     * - Might be paginated
     * - Might have search/filter
     * - Would require authentication
     * 
     * For now, we just return the mock data.
     */
    return MOCK_USERS;
  },
};

/*
 * Re-export types for convenience.
 */
export type { AuthService, StoredSession } from './authService.types';

/*
 * Learning Note - Service Pattern Benefits:
 * 
 * 1. Separation of Concerns:
 *    - Store: Holds state
 *    - Service: Handles logic
 *    - Component: Renders UI
 * 
 * 2. Testability:
 *    - Easy to mock authService
 *    - Test logic without UI
 *    - Test UI without real auth
 * 
 * 3. Reusability:
 *    - Use service from any component
 *    - Use service from other services
 *    - No component coupling
 * 
 * 4. Maintainability:
 *    - Logic in one place
 *    - Easy to find and update
 *    - Clear responsibilities
 * 
 * Compare to React/Redux:
 * - Redux Thunk: More boilerplate, action types, etc.
 * - Redux Saga: Even more complex, generators, effects
 * - Custom Hooks: Tied to components, rules of hooks
 * 
 * Svelte services are just plain TypeScript!
 */
