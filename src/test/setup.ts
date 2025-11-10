/**
 * Test setup file.
 * Runs before all tests.
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Mock localStorage for tests.
 */
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

globalThis.localStorage = localStorageMock as any;
