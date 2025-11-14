/**
 * Tests for tasksStore
 *
 * Learning Note - Testing Svelte Stores:
 * Stores are just objects with subscribe methods.
 * We can test them by:
 * 1. Subscribing to get current value
 * 2. Calling store methods
 * 3. Asserting the new value
 *
 * No need for complex mocking - stores are pure logic!
 */

import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { tasksStore } from './tasksStore';
import type { Task } from '../../types/task.types';

describe('tasksStore', () => {
  // Sample task for testing
  const mockTask: Task = {
    id: 'test-1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'medium',
    assignee: { id: '1', name: 'Alice', avatar: '👩‍💼' },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: '1',
  };

  beforeEach(() => {
    // Reset store before each test
    tasksStore.setAll([]);
  });

  describe('addOne', () => {
    it('should add a task to empty store', () => {
      tasksStore.addOne(mockTask);
      const tasks = get(tasksStore);
      
      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toEqual(mockTask);
    });

    it('should add multiple tasks', () => {
      const task2 = { ...mockTask, id: 'test-2', title: 'Task 2' };
      
      tasksStore.addOne(mockTask);
      tasksStore.addOne(task2);
      
      const tasks = get(tasksStore);
      expect(tasks).toHaveLength(2);
    });
  });

  describe('updateOne', () => {
    it('should update existing task', () => {
      tasksStore.addOne(mockTask);
      
      tasksStore.updateOne('test-1', { title: 'Updated Title' });
      
      const tasks = get(tasksStore);
      expect(tasks[0].title).toBe('Updated Title');
      expect(tasks[0].description).toBe('Test Description'); // Other fields unchanged
    });

    it('should not throw when updating non-existent task', () => {
      expect(() => {
        tasksStore.updateOne('non-existent', { title: 'New' });
      }).not.toThrow();
    });
  });

  describe('removeOne', () => {
    it('should remove existing task', () => {
      tasksStore.addOne(mockTask);
      
      tasksStore.removeOne('test-1');
      
      const tasks = get(tasksStore);
      expect(tasks).toHaveLength(0);
    });

    it('should not throw when removing non-existent task', () => {
      expect(() => {
        tasksStore.removeOne('non-existent');
      }).not.toThrow();
    });
  });

  describe('finding tasks', () => {
    it('should find task by id', () => {
      tasksStore.addOne(mockTask);
      
      const tasks = get(tasksStore);
      const task = tasks.find(t => t.id === 'test-1');
      
      expect(task).toEqual(mockTask);
    });

    it('should return undefined for non-existent id', () => {
      const tasks = get(tasksStore);
      const task = tasks.find(t => t.id === 'non-existent');
      expect(task).toBeUndefined();
    });
  });

  describe('moveTask', () => {
    it('should update task status', () => {
      tasksStore.addOne(mockTask);
      
      tasksStore.moveTask('test-1', 'in-progress');
      
      const tasks = get(tasksStore);
      expect(tasks[0].status).toBe('in-progress');
    });

    it('should not throw when moving non-existent task', () => {
      expect(() => {
        tasksStore.moveTask('non-existent', 'done');
      }).not.toThrow();
    });
  });

  describe('setAll', () => {
    it('should replace all tasks', () => {
      tasksStore.addOne(mockTask);
      
      const newTasks = [
        { ...mockTask, id: 'new-1' },
        { ...mockTask, id: 'new-2' },
      ];
      tasksStore.setAll(newTasks);
      
      const tasks = get(tasksStore);
      expect(tasks).toHaveLength(2);
      expect(tasks[0].id).toBe('new-1');
    });
  });
});
