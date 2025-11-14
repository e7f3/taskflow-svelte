/**
 * Tests for filteredTasksStore
 *
 * Learning Note - Testing Derived Stores:
 * Derived stores automatically recompute when dependencies change.
 * We test by:
 * 1. Setting up source stores (tasksStore, filtersStore)
 * 2. Reading derived store value
 * 3. Asserting filtered results
 */

import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  filteredTasksStore,
  filteredTodoTasks,
  filteredInProgressTasks,
  filteredDoneTasks,
} from './filteredTasksStore';
import { filtersStore } from '../filtersStore/filtersStore';
import { tasksStore } from '../tasksStore/tasksStore';
import type { Task } from '../../types/task.types';

describe('filteredTasksStore', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Fix bug in login',
      description: 'User cannot login',
      status: 'todo',
      priority: 'high',
      assignee: { id: 'alice', name: 'Alice', avatar: '👩‍💼' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: 'alice',
    },
    {
      id: '2',
      title: 'Add new feature',
      description: 'Implement dashboard',
      status: 'in-progress',
      priority: 'medium',
      assignee: { id: 'bob', name: 'Bob', avatar: '👨‍💻' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: 'bob',
    },
    {
      id: '3',
      title: 'Write tests',
      description: 'Add unit tests',
      status: 'done',
      priority: 'low',
      assignee: { id: 'alice', name: 'Alice', avatar: '👩‍💼' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: 'alice',
    },
  ];

  beforeEach(() => {
    // Reset stores
    tasksStore.setAll(mockTasks);
    filtersStore.clearFilters();
  });

  describe('filteredTasksStore', () => {
    it('should return all tasks when no filters', () => {
      const filtered = get(filteredTasksStore);
      expect(filtered).toHaveLength(3);
    });

    it('should filter by search query in title', () => {
      filtersStore.setSearchQuery('bug');
      
      const filtered = get(filteredTasksStore);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toContain('bug');
    });

    it('should filter by search query in description', () => {
      filtersStore.setSearchQuery('dashboard');
      
      const filtered = get(filteredTasksStore);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].description).toContain('dashboard');
    });

    it('should be case-insensitive', () => {
      filtersStore.setSearchQuery('FIX');
      
      const filtered = get(filteredTasksStore);
      expect(filtered).toHaveLength(1);
    });

    it('should filter by assignee', () => {
      filtersStore.setAssigneeFilter('alice');
      
      const filtered = get(filteredTasksStore);
      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.assignee?.id === 'alice')).toBe(true);
    });

    it('should filter by priority', () => {
      filtersStore.setPriorityFilter('high');
      
      const filtered = get(filteredTasksStore);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].priority).toBe('high');
    });

    it('should combine multiple filters with AND logic', () => {
      filtersStore.setAssigneeFilter('alice');
      filtersStore.setPriorityFilter('high');
      
      const filtered = get(filteredTasksStore);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should return empty array when no matches', () => {
      filtersStore.setSearchQuery('nonexistent');
      
      const filtered = get(filteredTasksStore);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('filteredTodoTasks', () => {
    it('should return only todo tasks', () => {
      const todos = get(filteredTodoTasks);
      expect(todos).toHaveLength(1);
      expect(todos[0].status).toBe('todo');
    });

    it('should apply filters to todo tasks', () => {
      filtersStore.setAssigneeFilter('alice');
      
      const todos = get(filteredTodoTasks);
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe('1');
    });
  });

  describe('filteredInProgressTasks', () => {
    it('should return only in-progress tasks', () => {
      const inProgress = get(filteredInProgressTasks);
      expect(inProgress).toHaveLength(1);
      expect(inProgress[0].status).toBe('in-progress');
    });

    it('should apply filters to in-progress tasks', () => {
      filtersStore.setSearchQuery('dashboard');
      
      const inProgress = get(filteredInProgressTasks);
      expect(inProgress).toHaveLength(1);
    });
  });

  describe('filteredDoneTasks', () => {
    it('should return only done tasks', () => {
      const done = get(filteredDoneTasks);
      expect(done).toHaveLength(1);
      expect(done[0].status).toBe('done');
    });

    it('should apply filters to done tasks', () => {
      filtersStore.setPriorityFilter('low');
      
      const done = get(filteredDoneTasks);
      expect(done).toHaveLength(1);
    });
  });
});
