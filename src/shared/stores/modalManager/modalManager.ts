/**
 * Modal Manager Store
 *
 * Learning Note - Advanced State Management:
 * This implements a centralized modal management system using:
 * - Svelte stores for reactive state
 * - LIFO stack for nested modals
 * - Factory pattern for modal handlers
 *
 * Benefits over component-level modals:
 * - No prop drilling
 * - Single rendering point (App root)
 * - Automatic z-index management
 * - Can trigger modals from anywhere (even services!)
 */

import { writable, derived, get } from 'svelte/store';
import type {
  ModalId,
  ModalInstance,
  ModalStackState,
  ModalHandler,
} from './modalManager.types';

/**
 * Generate unique modal ID.
 *
 * Learning Note:
 * We use crypto.randomUUID() for guaranteed uniqueness.
 * This is the same approach used for task IDs throughout the app.
 */
function generateModalId(): ModalId {
  return `modal_${crypto.randomUUID()}`;
}

/**
 * Internal modal stack store.
 */
const modalStackStore = writable<ModalStackState>({
  stack: [],
});

/**
 * Modal Manager API
 *
 * Learning Note:
 * This is the core API for managing the modal stack.
 * Components and services use this to open/close modals.
 */
export const modalManager = {
  /**
   * Subscribe to the modal stack.
   * Used by ModalRenderer component to render active modals.
   */
  subscribe: modalStackStore.subscribe,

  /**
   * Push a modal onto the stack.
   * Returns the modal ID.
   */
  push<TState = any>(type: string, state?: TState): ModalId {
    const id = generateModalId();
    const modal: ModalInstance<TState> = {
      id,
      type,
      state,
      openedAt: Date.now(),
    };

    modalStackStore.update((current) => ({
      stack: [...current.stack, modal],
    }));

    return id;
  },

  /**
   * Pop a modal from the stack by ID.
   * If no ID provided, pops the top modal.
   */
  pop(id?: ModalId): void {
    modalStackStore.update((current) => {
      if (!id) {
        // Pop top modal
        return {
          stack: current.stack.slice(0, -1),
        };
      }

      // Remove specific modal by ID
      return {
        stack: current.stack.filter((m) => m.id !== id),
      };
    });
  },

  /**
   * Close all modals of a specific type.
   */
  closeType(type: string): void {
    modalStackStore.update((current) => ({
      stack: current.stack.filter((m) => m.type !== type),
    }));
  },

  /**
   * Close all modals.
   */
  closeAll(): void {
    modalStackStore.set({ stack: [] });
  },

  /**
   * Get the current top modal (active modal).
   */
  getTop(): ModalInstance | undefined {
    const state = get(modalStackStore);
    return state.stack[state.stack.length - 1];
  },

  /**
   * Get a specific modal by ID.
   */
  getById(id: ModalId): ModalInstance | undefined {
    const state = get(modalStackStore);
    return state.stack.find((m) => m.id === id);
  },

  /**
   * Check if any modal is open.
   */
  hasModals(): boolean {
    const state = get(modalStackStore);
    return state.stack.length > 0;
  },
};

/**
 * Derived store for the currently active (top) modal.
 *
 * Learning Note:
 * This is useful for components that only care about the active modal.
 * Returns undefined when no modals are open (empty stack).
 */
export const activeModal = derived(modalStackStore, ($stack) => {
  // Handle empty stack edge case explicitly
  if ($stack.stack.length === 0) {
    return undefined;
  }
  return $stack.stack[$stack.stack.length - 1];
});

/**
 * Create a modal handler for a specific modal type.
 *
 * Learning Note - Factory Pattern:
 * This creates a handler object that encapsulates all operations
 * for a specific modal type. Similar to React's custom hooks pattern.
 *
 * @example
 * ```typescript
 * const confirmModal = createModalHandler<ConfirmationProps>('confirmation');
 *
 * // In component:
 * confirmModal.open({ message: 'Delete this?' });
 *
 * // Check if open:
 * if (confirmModal.isOpen()) { ... }
 *
 * // Close:
 * confirmModal.close();
 * ```
 */
export function createModalHandler<TState = unknown>(
  type: string,
): ModalHandler<TState> {
  return {
    type,

    open(state?: TState): ModalId {
      return modalManager.push(type, state);
    },

    close(id?: ModalId): void {
      if (id) {
        modalManager.pop(id);
      } else {
        // Close most recent instance of this type
        const state = get(modalStackStore);
        const modal = [...state.stack]
          .reverse()
          .find((m) => m.type === type);

        if (modal) {
          modalManager.pop(modal.id);
        }
      }
    },

    isOpen(id?: ModalId): boolean {
      const state = get(modalStackStore);

      if (id) {
        return state.stack.some((m) => m.id === id && m.type === type);
      }

      return state.stack.some((m) => m.type === type);
    },

    getState(id?: ModalId): TState | undefined {
      const state = get(modalStackStore);

      if (id) {
        const modal = state.stack.find((m) => m.id === id && m.type === type);
        return modal?.state as TState | undefined;
      }

      // Get most recent instance
      const modal = [...state.stack]
        .reverse()
        .find((m) => m.type === type);

      return modal?.state as TState | undefined;
    },
  };
}

/**
 * Re-export types for convenience.
 */
export type { ModalId, ModalInstance, ModalHandler } from './modalManager.types';
