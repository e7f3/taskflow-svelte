/**
 * Storage service implementation providing safe localStorage access.
 *
 * Learning Note - Services in Svelte:
 * Unlike React where you might use custom hooks for side effects,
 * Svelte uses plain JavaScript/TypeScript services. This is simpler
 * and more testable since services are just functions, not hooks.
 *
 * Benefits:
 * - Can be used anywhere (not just in components)
 * - Easy to test (no need for React Testing Library)
 * - No rules of hooks to worry about
 * - Can be called conditionally or in loops
 *
 * Architecture:
 * - Types defined in storageService.types.ts
 * - Implementation here
 * - Clear separation of concerns
 *
 * @example
 * ```typescript
 * import { storageService, STORAGE_KEYS } from './storageService';
 *
 * // Save data
 * storageService.setItem(STORAGE_KEYS.AUTH, { user, token });
 *
 * // Retrieve data
 * const auth = storageService.getItem<AuthData>(STORAGE_KEYS.AUTH);
 * ```
 */

import type { StorageService } from './storageService.types';

/**
 * Storage service implementation.
 * Implements the StorageService interface with full error handling.
 *
 * Learning Note:
 * We use 'satisfies' to ensure our object implements the interface
 * while still allowing TypeScript to infer the exact types.
 * This gives us both type safety and precise inference.
 */
export const storageService: StorageService = {
  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      /*
       * Log error but don't throw - we want the app to continue
       * working even if localStorage fails.
       *
       * In production, you might want to:
       * - Send error to monitoring service (Sentry, etc.)
       * - Show user notification
       * - Fall back to in-memory storage
       */
      console.error(`Failed to save to localStorage (key: ${key}):`, error);

      // Check for specific error types
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded. Consider clearing old data.');
        } else if (error.name === 'SecurityError') {
          console.warn('localStorage access denied. Private browsing mode?');
        }
      }
    }
  },

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);

      // Item doesn't exist
      if (item === null) {
        return null;
      }

      /*
       * Parse JSON and cast to expected type.
       *
       * Note: This is a type assertion, not validation!
       * In production, you might want to use a validation library
       * like Zod or Yup to ensure the data matches the expected shape.
       */
      return JSON.parse(item) as T;
    } catch (error) {
      /*
       * Parsing failed or localStorage access denied.
       * Return null to indicate failure.
       */
      console.error(`Failed to read from localStorage (key: ${key}):`, error);
      return null;
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from localStorage (key: ${key}):`, error);
    }
  },

  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      const testValue = 'test';

      // Try to write
      localStorage.setItem(testKey, testValue);

      // Try to read
      const retrieved = localStorage.getItem(testKey);

      // Clean up
      localStorage.removeItem(testKey);

      // Check if read value matches written value
      return retrieved === testValue;
    } catch {
      /*
       * Any error means localStorage is not available.
       * Common causes:
       * - Private browsing mode
       * - Storage disabled in browser settings
       * - SecurityError in some contexts
       */
      return false;
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

/*
 * Re-export types and constants for convenience.
 * This allows importing everything from one file:
 *
 * import { storageService, STORAGE_KEYS, StorageError } from './storageService';
 */
export { STORAGE_KEYS, StorageError, StorageErrorType } from './storageService.types';
export type { StorageService, StorageKey } from './storageService.types';

/*
 * Learning Note - Why not a class?
 *
 * We could have written this as a class:
 *
 * class StorageService {
 *   setItem<T>(key: string, value: T) { ... }
 *   getItem<T>(key: string): T | null { ... }
 * }
 * export const storageService = new StorageService();
 *
 * But the plain object approach is simpler:
 * - No 'this' binding issues
 * - No need for 'new' keyword
 * - Easier to tree-shake unused methods
 * - More functional programming style
 * - Implements interface directly
 *
 * This is a common pattern in modern JavaScript/TypeScript.
 */
