/**
 * Modal Manager Tests
 *
 * Learning Note:
 * These tests cover:
 * - Basic operations (push, pop, close)
 * - Edge cases (empty stack, non-existent IDs)
 * - LIFO stack behavior
 * - Modal handlers
 * - Type-specific operations
 */

import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  modalManager,
  activeModal,
  createModalHandler,
} from './modalManager';

describe('modalManager', () => {
  beforeEach(() => {
    // Clear all modals before each test
    modalManager.closeAll();
  });

  describe('Basic Operations', () => {
    it('should start with empty stack', () => {
      const state = get(modalManager);
      expect(state.stack).toEqual([]);
      expect(state.stack.length).toBe(0);
    });

    it('should push a modal onto the stack', () => {
      const modalId = modalManager.push('test-modal');

      expect(modalId).toMatch(/^modal_/);
      const state = get(modalManager);
      expect(state.stack.length).toBe(1);
      expect(state.stack[0].type).toBe('test-modal');
      expect(state.stack[0].id).toBe(modalId);
    });

    it('should push modal with state', () => {
      const testState = { message: 'Hello', count: 42 };
      modalManager.push('test-modal', testState);

      const state = get(modalManager);
      expect(state.stack[0].state).toEqual(testState);
    });

    it('should pop the top modal', () => {
      modalManager.push('modal1');
      modalManager.push('modal2');

      modalManager.pop();

      const state = get(modalManager);
      expect(state.stack.length).toBe(1);
      expect(state.stack[0].type).toBe('modal1');
    });

    it('should pop specific modal by ID', () => {
      const id1 = modalManager.push('modal1');
      modalManager.push('modal2');
      modalManager.push('modal3');

      modalManager.pop(id1);

      const state = get(modalManager);
      expect(state.stack.length).toBe(2);
      expect(state.stack[0].type).toBe('modal2');
      expect(state.stack[1].type).toBe('modal3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle popping from empty stack', () => {
      modalManager.pop();

      const state = get(modalManager);
      expect(state.stack).toEqual([]);
    });

    it('should handle popping non-existent ID', () => {
      modalManager.push('modal1');
      modalManager.pop('non-existent-id');

      const state = get(modalManager);
      expect(state.stack.length).toBe(1);
    });

    it('should return undefined for getTop on empty stack', () => {
      const top = modalManager.getTop();
      expect(top).toBeUndefined();
    });

    it('should return undefined for getById with non-existent ID', () => {
      const modal = modalManager.getById('non-existent');
      expect(modal).toBeUndefined();
    });

    it('should return false for hasModals on empty stack', () => {
      expect(modalManager.hasModals()).toBe(false);
    });

    it('should handle closeType with no matching modals', () => {
      modalManager.push('modal1');
      modalManager.closeType('non-existent-type');

      const state = get(modalManager);
      expect(state.stack.length).toBe(1);
    });
  });

  describe('LIFO Stack Behavior', () => {
    it('should maintain LIFO order', () => {
      const id1 = modalManager.push('modal1');
      const id2 = modalManager.push('modal2');
      const id3 = modalManager.push('modal3');

      const state = get(modalManager);
      expect(state.stack[0].id).toBe(id1);
      expect(state.stack[1].id).toBe(id2);
      expect(state.stack[2].id).toBe(id3);
    });

    it('should return top modal correctly', () => {
      modalManager.push('modal1');
      modalManager.push('modal2');
      const id3 = modalManager.push('modal3');

      const top = modalManager.getTop();
      expect(top?.id).toBe(id3);
      expect(top?.type).toBe('modal3');
    });

    it('should pop in LIFO order', () => {
      modalManager.push('modal1');
      modalManager.push('modal2');
      modalManager.push('modal3');

      modalManager.pop();
      let top = modalManager.getTop();
      expect(top?.type).toBe('modal2');

      modalManager.pop();
      top = modalManager.getTop();
      expect(top?.type).toBe('modal1');

      modalManager.pop();
      top = modalManager.getTop();
      expect(top).toBeUndefined();
    });
  });

  describe('Type-Specific Operations', () => {
    it('should close all modals of a specific type', () => {
      modalManager.push('typeA');
      modalManager.push('typeB');
      modalManager.push('typeA');
      modalManager.push('typeC');

      modalManager.closeType('typeA');

      const state = get(modalManager);
      expect(state.stack.length).toBe(2);
      expect(state.stack[0].type).toBe('typeB');
      expect(state.stack[1].type).toBe('typeC');
    });

    it('should close all modals', () => {
      modalManager.push('modal1');
      modalManager.push('modal2');
      modalManager.push('modal3');

      modalManager.closeAll();

      const state = get(modalManager);
      expect(state.stack).toEqual([]);
      expect(modalManager.hasModals()).toBe(false);
    });

    it('should check if modals exist', () => {
      expect(modalManager.hasModals()).toBe(false);

      modalManager.push('modal1');
      expect(modalManager.hasModals()).toBe(true);

      modalManager.closeAll();
      expect(modalManager.hasModals()).toBe(false);
    });
  });

  describe('activeModal derived store', () => {
    it('should return undefined when stack is empty', () => {
      const active = get(activeModal);
      expect(active).toBeUndefined();
    });

    it('should return top modal when stack has items', () => {
      modalManager.push('modal1');
      const id2 = modalManager.push('modal2');

      const active = get(activeModal);
      expect(active?.id).toBe(id2);
      expect(active?.type).toBe('modal2');
    });

    it('should update reactively when stack changes', () => {
      const id1 = modalManager.push('modal1');
      let active = get(activeModal);
      expect(active?.id).toBe(id1);

      const id2 = modalManager.push('modal2');
      active = get(activeModal);
      expect(active?.id).toBe(id2);

      modalManager.pop();
      active = get(activeModal);
      expect(active?.id).toBe(id1);
    });
  });

  describe('Modal Handler', () => {
    it('should create a modal handler', () => {
      const handler = createModalHandler('test-modal');

      expect(handler.type).toBe('test-modal');
      expect(typeof handler.open).toBe('function');
      expect(typeof handler.close).toBe('function');
      expect(typeof handler.isOpen).toBe('function');
      expect(typeof handler.getState).toBe('function');
    });

    it('should open modal via handler', () => {
      const handler = createModalHandler('test-modal');
      const id = handler.open({ message: 'test' });

      expect(id).toMatch(/^modal_/);
      expect(handler.isOpen()).toBe(true);
    });

    it('should close modal via handler', () => {
      const handler = createModalHandler('test-modal');
      handler.open();

      expect(handler.isOpen()).toBe(true);

      handler.close();

      expect(handler.isOpen()).toBe(false);
    });

    it('should close specific instance by ID', () => {
      const handler = createModalHandler('test-modal');
      const id1 = handler.open({ num: 1 });
      const id2 = handler.open({ num: 2 });

      expect(handler.isOpen(id1)).toBe(true);
      expect(handler.isOpen(id2)).toBe(true);

      handler.close(id1);

      expect(handler.isOpen(id1)).toBe(false);
      expect(handler.isOpen(id2)).toBe(true);
    });

    it('should get state from handler', () => {
      const handler = createModalHandler<{ message: string }>('test-modal');
      const testState = { message: 'Hello World' };
      handler.open(testState);

      const state = handler.getState();
      expect(state).toEqual(testState);
    });

    it('should get state by ID', () => {
      const handler = createModalHandler<{ num: number }>('test-modal');
      const id1 = handler.open({ num: 1 });
      const id2 = handler.open({ num: 2 });

      expect(handler.getState(id1)).toEqual({ num: 1 });
      expect(handler.getState(id2)).toEqual({ num: 2 });
    });

    it('should return undefined for state when modal not open', () => {
      const handler = createModalHandler('test-modal');
      const state = handler.getState();
      expect(state).toBeUndefined();
    });

    it('should handle multiple handlers independently', () => {
      const handler1 = createModalHandler('modal1');
      const handler2 = createModalHandler('modal2');

      handler1.open();
      handler2.open();

      expect(handler1.isOpen()).toBe(true);
      expect(handler2.isOpen()).toBe(true);

      handler1.close();

      expect(handler1.isOpen()).toBe(false);
      expect(handler2.isOpen()).toBe(true);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle nested modals correctly', () => {
      const confirmHandler = createModalHandler('confirmation');
      const formHandler = createModalHandler('form');

      formHandler.open({ title: 'Edit Task' });
      confirmHandler.open({ message: 'Discard changes?' });

      const top = modalManager.getTop();
      expect(top?.type).toBe('confirmation');

      confirmHandler.close();

      const newTop = modalManager.getTop();
      expect(newTop?.type).toBe('form');
    });

    it('should handle multiple instances of same type', () => {
      const handler = createModalHandler('notification');

      const id1 = handler.open({ message: 'First' });
      const id2 = handler.open({ message: 'Second' });
      handler.open({ message: 'Third' });

      expect(modalManager.hasModals()).toBe(true);
      const state = get(modalManager);
      expect(state.stack.length).toBe(3);

      // Close middle one
      handler.close(id2);

      const updatedState = get(modalManager);
      expect(updatedState.stack.length).toBe(2);
      expect(handler.isOpen(id1)).toBe(true);
      expect(handler.isOpen(id2)).toBe(false);
    });

    it('should maintain state integrity across operations', () => {
      const handler1 = createModalHandler<{ count: number }>('counter');
      const handler2 = createModalHandler<{ name: string }>('user');

      handler1.open({ count: 1 });
      handler2.open({ name: 'Alice' });
      handler1.open({ count: 2 });

      expect(handler1.getState()).toEqual({ count: 2 });
      expect(handler2.getState()).toEqual({ name: 'Alice' });

      modalManager.closeType('counter');

      expect(handler1.isOpen()).toBe(false);
      expect(handler2.isOpen()).toBe(true);
      expect(handler2.getState()).toEqual({ name: 'Alice' });
    });
  });
});
