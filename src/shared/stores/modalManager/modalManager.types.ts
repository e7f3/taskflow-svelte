/**
 * Modal Manager Types
 *
 * Learning Note:
 * This implements a sophisticated modal management system with:
 * - LIFO stack for handling nested modals
 * - Unique IDs for precise modal control
 * - Type-safe modal state passing
 */

/**
 * Unique identifier for a modal instance.
 */
export type ModalId = string;

/**
 * Modal instance in the stack.
 * Each modal has a unique ID and optional state.
 */
export interface ModalInstance<TState = any> {
  /**
   * Unique identifier for this modal instance.
   */
  id: ModalId;

  /**
   * Modal type identifier (e.g., 'confirmation', 'taskForm').
   */
  type: string;

  /**
   * Optional state/props to pass to the modal component.
   */
  state?: TState;

  /**
   * Timestamp when modal was opened (for debugging/analytics).
   */
  openedAt: number;
}

/**
 * Modal stack state.
 * Uses LIFO (Last In, First Out) - only the top modal is active.
 */
export interface ModalStackState {
  /**
   * Stack of open modals.
   * Last item in array is the currently active modal.
   */
  stack: ModalInstance[];
}

/**
 * Modal handler interface.
 * Provides methods to control a specific modal type.
 */
export interface ModalHandler<TState = any> {
  /**
   * Modal type identifier.
   */
  readonly type: string;

  /**
   * Opens this modal with optional state.
   * Returns the modal ID for later reference.
   */
  open: (state?: TState) => ModalId;

  /**
   * Closes this modal by ID.
   * If no ID provided, closes the most recent instance of this type.
   */
  close: (id?: ModalId) => void;

  /**
   * Checks if this modal type is currently open.
   */
  isOpen: (id?: ModalId) => boolean;

  /**
   * Gets the state of a specific modal instance.
   */
  getState: (id?: ModalId) => TState | undefined;
}
