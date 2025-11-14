// src/test/setup.ts
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect , vi } from 'vitest';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

/**
 * Mock localStorage for tests.
 * Provides a simple in-memory implementation.
 */
const storage = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => storage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => {
    storage.set(key, value);
  }),
  removeItem: vi.fn((key: string) => {
    storage.delete(key);
  }),
  clear: vi.fn(() => {
    storage.clear();
  }),
  get length() {
    return storage.size;
  },
  key: vi.fn((index: number) => {
    return Array.from(storage.keys())[index] ?? null;
  }),
};

globalThis.localStorage = localStorageMock as any;
globalThis.sessionStorage = localStorageMock as any;