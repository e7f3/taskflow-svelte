/**
 * Tests for storageService.
 *
 * Learning Note:
 * Testing services in Svelte is straightforward - they're just functions!
 * No need for React Testing Library's renderHook or complex setup.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService, STORAGE_KEYS } from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('setItem', () => {
    it('should store item in localStorage', () => {
      const testData = { id: '1', name: 'Test' };

      storageService.setItem('test-key', testData);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData),
      );
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      // Should not throw
      expect(() => storageService.setItem('key', 'value')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('getItem', () => {
    it('should retrieve and parse item from localStorage', () => {
      const testData = { id: '1', name: 'Test' };
      localStorage.getItem = vi.fn(() => JSON.stringify(testData));

      const result = storageService.getItem<typeof testData>('test-key');

      expect(result).toEqual(testData);
    });

    it('should return null if item does not exist', () => {
      localStorage.getItem = vi.fn(() => null);

      const result = storageService.getItem('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null if JSON parsing fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.getItem = vi.fn(() => 'invalid json{');

      const result = storageService.getItem('key');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have namespaced keys', () => {
      expect(STORAGE_KEYS.AUTH).toBe('taskflow_auth');
      expect(STORAGE_KEYS.TASKS).toBe('taskflow_tasks');
      expect(STORAGE_KEYS.FILTERS).toBe('taskflow_filters');
    });
  });
});
