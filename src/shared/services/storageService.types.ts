/**
 * Type definitions for the storage service.
 * 
 * Learning Note:
 * Separating types from implementation has several benefits:
 * - Better organization and discoverability
 * - Types can be imported without importing implementation
 * - Easier to mock for testing
 * - Clear contract/interface for the service
 * - Better IDE autocomplete and documentation
 */

/**
 * Storage service interface defining the contract for localStorage operations.
 * 
 * This interface ensures type safety and provides clear documentation
 * for all storage operations in the application.
 * 
 * Learning Note:
 * In React with TypeScript, you might create a context with this interface.
 * In Svelte, we just export a typed object that implements this interface.
 * 
 * Benefits of defining an interface:
 * - Easy to create mock implementations for testing
 * - Clear API contract
 * - Can swap implementations (e.g., sessionStorage, IndexedDB)
 * - Better TypeScript inference
 */
export interface StorageService {
  /**
   * Stores an item in localStorage with JSON serialization.
   * Handles errors gracefully if storage is unavailable.
   * 
   * Error handling:
   * - QuotaExceededError: localStorage is full
   * - SecurityError: localStorage is disabled (private browsing)
   * - Other errors: Unexpected issues
   * 
   * @param key - Storage key (namespace your keys to avoid conflicts)
   * @param value - Value to store (will be JSON stringified)
   * 
   * @example
   * ```typescript
   * storageService.setItem('tasks', [task1, task2]);
   * storageService.setItem('auth', { user, token });
   * ```
   */
  setItem<T>(key: string, value: T): void;

  /**
   * Retrieves and deserializes an item from localStorage.
   * Returns null if item doesn't exist or parsing fails.
   * 
   * Type safety:
   * Use the generic parameter to specify the expected type.
   * TypeScript will enforce this type in your code.
   * 
   * @param key - Storage key to retrieve
   * @returns Parsed value or null if not found/invalid
   * 
   * @example
   * ```typescript
   * const tasks = storageService.getItem<Task[]>('tasks');
   * if (tasks) {
   *   // TypeScript knows tasks is Task[]
   *   tasks.forEach(task => console.log(task.title));
   * }
   * ```
   */
  getItem<T>(key: string): T | null;

  /**
   * Removes an item from localStorage.
   * Safe to call even if the key doesn't exist.
   * 
   * Use cases:
   * - Logout (remove auth token)
   * - Clear cache
   * - Delete user data
   * 
   * @param key - Storage key to remove
   * 
   * @example
   * ```typescript
   * // Logout
   * storageService.removeItem('auth');
   * 
   * // Clear all app data
   * storageService.removeItem('tasks');
   * storageService.removeItem('filters');
   * ```
   */
  removeItem(key: string): void;

  /**
   * Checks if localStorage is available and working.
   * Useful for showing warnings if storage is disabled.
   * 
   * How it works:
   * Attempts to write and read a test value.
   * If successful, localStorage is available.
   * 
   * @returns True if localStorage is accessible and working
   * 
   * @example
   * ```typescript
   * if (!storageService.isAvailable()) {
   *   // Show warning banner
   *   console.warn('Data will not persist across sessions');
   * }
   * ```
   */
  isAvailable(): boolean;

  /**
   * Clears all items from localStorage.
   * Use with caution - this affects all apps on the same domain!
   * 
   * Learning Note:
   * In a real app, you'd want to clear only your app's keys.
   * Consider using a namespace prefix for all your keys.
   * 
   * @example
   * ```typescript
   * // Clear all data (use sparingly!)
   * storageService.clear();
   * ```
   */
  clear(): void;
}

/**
 * Storage keys used throughout the application.
 * Centralizing keys prevents typos and makes refactoring easier.
 * 
 * Learning Note:
 * Using constants for storage keys is a best practice:
 * - Prevents typos (compile-time checking)
 * - Easy to refactor (change in one place)
 * - Self-documenting code
 * - Can add namespace prefix easily
 * 
 * @example
 * ```typescript
 * // Instead of:
 * localStorage.setItem('tasks', data);
 * 
 * // Use:
 * storageService.setItem(STORAGE_KEYS.TASKS, data);
 * ```
 */
export const STORAGE_KEYS = {
  /**
   * Key for storing authentication state.
   * Contains: { user: User, token: string }
   */
  AUTH: 'taskflow_auth',

  /**
   * Key for storing all tasks.
   * Contains: Task[]
   */
  TASKS: 'taskflow_tasks',

  /**
   * Key for storing filter preferences.
   * Contains: FilterState
   */
  FILTERS: 'taskflow_filters',
} as const;

/**
 * Type for storage keys.
 * Ensures only valid keys from STORAGE_KEYS can be used.
 * 
 * Learning Note:
 * This creates a union type of all values in STORAGE_KEYS.
 * TypeScript will enforce that only these specific strings can be used.
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Error types that can occur during storage operations.
 * Useful for specific error handling.
 */
export enum StorageErrorType {
  /**
   * localStorage quota exceeded (usually 5-10MB limit).
   */
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  /**
   * localStorage access denied (private browsing, security settings).
   */
  SECURITY_ERROR = 'SECURITY_ERROR',

  /**
   * JSON parsing failed (corrupted data).
   */
  PARSE_ERROR = 'PARSE_ERROR',

  /**
   * Unknown error occurred.
   */
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class for storage operations.
 * Provides more context than generic Error.
 * 
 * Learning Note:
 * Custom error classes help with error handling and debugging.
 * You can catch specific error types and handle them differently.
 */
export class StorageError extends Error {
  /**
   * Type of storage error that occurred.
   */
  type: StorageErrorType;

  /**
   * Storage key that caused the error.
   */
  key: string;

  /**
   * Original error if available.
   */
  originalError?: Error;

  constructor(
    type: StorageErrorType,
    key: string,
    message: string,
    originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
    this.type = type;
    this.key = key;
    this.originalError = originalError;
  }
}
