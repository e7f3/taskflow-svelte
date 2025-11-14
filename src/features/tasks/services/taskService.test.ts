/**
 * Tests for taskService
 *
 * Learning Note - Testing Services:
 * Services coordinate between stores and other services.
 * We test by:
 * 1. Mocking dependencies (stores, storage)
 * 2. Calling service methods
 * 3. Asserting side effects (store updates, storage calls)
 */

import { get } from 'svelte/store';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { authStore } from '@/features/auth/stores/authStore';
import { storageService } from '@/shared/services/storageService';
import { taskService } from './taskService';
import { tasksStore } from '../stores/tasksStore/tasksStore';
import type { CreateTaskData } from '../types/task.types';

describe('taskService', () => {
  const mockUser = {
    id: 'user-1',
    username: 'alice',
    name: 'Alice Johnson',
    avatar: '👩‍💼',
  };

  const mockTaskData: CreateTaskData = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'medium',
    assignee: null,
  };

  beforeEach(() => {
    // Reset stores
    tasksStore.setAll([]);
    authStore.setAuthenticated(mockUser, 'test-token');
    
    // Spy on storage methods
    vi.spyOn(storageService, 'getItem').mockReturnValue(null);
    vi.spyOn(storageService, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createTask', () => {
    it('should create a task with generated fields', async () => {
      const task = await taskService.createTask(mockTaskData);
      
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.createdBy).toBe('user-1');
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should add task to store', async () => {
      await taskService.createTask(mockTaskData);
      
      const tasks = get(tasksStore);
      expect(tasks).toHaveLength(1);
    });

    it('should persist to storage', async () => {
      await taskService.createTask(mockTaskData);
      
      expect(storageService.setItem).toHaveBeenCalled();
    });

    it('should throw when no user logged in', async () => {
      authStore.clearAuthentication();
      
      await expect(taskService.createTask(mockTaskData)).rejects.toThrow(
        'User must be logged in',
      );
    });
  });

  describe('updateTask', () => {
    it('should update task fields', async () => {
      const task = await taskService.createTask(mockTaskData);
      
      taskService.updateTask(task.id, { title: 'Updated Title' });
      
      const updated = get(tasksStore.selectById(task.id));
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.description).toBe('Test Description'); // Unchanged
    });

    it('should update updatedAt timestamp', async () => {
      const task = await taskService.createTask(mockTaskData);
      const originalUpdatedAt = task.updatedAt;
      
      // Wait a bit to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 10));
      
      taskService.updateTask(task.id, { title: 'Updated' });
      
      const updated = get(tasksStore.selectById(task.id));
      expect(updated?.updatedAt).toBeGreaterThan(originalUpdatedAt);
    });

    it('should persist to storage', async () => {
      const task = await taskService.createTask(mockTaskData);
      vi.clearAllMocks();
      
      taskService.updateTask(task.id, { title: 'Updated' });
      
      expect(storageService.setItem).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should remove task from store', async () => {
      const task = await taskService.createTask(mockTaskData);
      
      taskService.deleteTask(task.id);
      
      const tasks = get(tasksStore);
      expect(tasks).toHaveLength(0);
    });

    it('should persist to storage', async () => {
      const task = await taskService.createTask(mockTaskData);
      vi.clearAllMocks();
      
      taskService.deleteTask(task.id);
      
      expect(storageService.setItem).toHaveBeenCalled();
    });
  });

  describe('moveTask', () => {
    it('should update task status', async () => {
      const task = await taskService.createTask(mockTaskData);
      
      taskService.moveTask(task.id, 'in-progress');
      
      const updated = get(tasksStore.selectById(task.id));
      expect(updated?.status).toBe('in-progress');
    });

    it('should update updatedAt timestamp', async () => {
      const task = await taskService.createTask(mockTaskData);
      const originalUpdatedAt = task.updatedAt;
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      taskService.moveTask(task.id, 'done');
      
      const updated = get(tasksStore.selectById(task.id));
      expect(updated?.updatedAt).toBeGreaterThan(originalUpdatedAt);
    });

    it('should persist to storage', async () => {
      const task = await taskService.createTask(mockTaskData);
      vi.clearAllMocks();
      
      taskService.moveTask(task.id, 'done');
      
      expect(storageService.setItem).toHaveBeenCalled();
    });
  });

  describe('saveTask', () => {
    it('should create new task when no taskId provided', async () => {
      const result = await taskService.saveTask(mockTaskData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.task).toBeDefined();
        expect(result.task.title).toBe('Test Task');
      }
    });

    it('should update existing task when taskId provided', async () => {
      const task = await taskService.createTask(mockTaskData);
      
      const result = await taskService.saveTask(
        { ...mockTaskData, title: 'Updated' },
        task.id,
      );
      
      expect(result.success).toBe(true);
      expect('task' in result && result.task.title).toBe('Updated');
    });

    it('should return error when task not found after update', async () => {
      const result = await taskService.saveTask(
        mockTaskData,
        'non-existent-id',
      );
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });

    it('should handle errors gracefully', async () => {
      authStore.clearAuthentication();
      
      const result = await taskService.saveTask(mockTaskData);
      
      expect(result.success).toBe(false);
      expect('error' in result && result.error).toBeDefined();
    });
  });

  describe('loadTasks', () => {
    it('should load tasks from storage', () => {
      const storedTasks = [
        { ...mockTaskData, id: '1', createdAt: Date.now(), updatedAt: Date.now(), createdBy: 'user-1' },
      ];
      vi.mocked(storageService.getItem).mockReturnValue(storedTasks);
      
      taskService.loadTasks();
      
      const tasks = get(tasksStore);
      expect(tasks).toHaveLength(1);
    });

    it('should load initial tasks when storage is empty', () => {
      vi.mocked(storageService.getItem).mockReturnValue(null);
      
      taskService.loadTasks();
      
      const tasks = get(tasksStore);
      expect(tasks.length).toBeGreaterThan(0); // INITIAL_TASKS
    });
  });
});
