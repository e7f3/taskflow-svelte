/**
 * Task service implementation.
 * Handles task CRUD operations and business logic.
 * 
 * Learning Note:
 * This service demonstrates the service layer pattern:
 * - Coordinates between stores
 * - Handles side effects (storage)
 * - Encapsulates business logic
 * - Provides clean API for components
 */

import { tasksStore } from '../stores/tasksStore';
import { authStore } from '@/features/auth/stores/authStore';
import { storageService, STORAGE_KEYS } from '@/shared/services/storageService';
import type { Task, TaskStatus, CreateTaskData, UpdateTaskData } from '../types/task.types';
import type { TaskService } from './taskService.types';
import type { EntityId } from '@/shared/types/common.types';
import { get } from 'svelte/store';

/**
 * Initial mock tasks for demonstration.
 * Loaded on first app launch if no tasks exist in localStorage.
 * 
 * Learning Note:
 * In production, initial data would come from an API.
 * For learning, we provide some sample tasks to explore the UI.
 */
export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Set up project repository',
    description: 'Initialize Git repository and set up project structure',
    status: 'done',
    priority: 'high',
    assignee: { id: '1', name: 'Alice Johnson', avatar: '👩‍💼' },
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    updatedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Design database schema',
    description: 'Create ERD and define table structures for the application',
    status: 'done',
    priority: 'high',
    assignee: { id: '2', name: 'Bob Smith', avatar: '👨‍💻' },
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    createdBy: '1',
  },
  {
    id: '3',
    title: 'Implement user authentication',
    description: 'Add login, logout, and session management functionality',
    status: 'in-progress',
    priority: 'critical',
    assignee: { id: '1', name: 'Alice Johnson', avatar: '👩‍💼' },
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    createdBy: '2',
  },
  {
    id: '4',
    title: 'Create API endpoints',
    description: 'Build RESTful API for task management operations',
    status: 'in-progress',
    priority: 'high',
    assignee: { id: '2', name: 'Bob Smith', avatar: '👨‍💻' },
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    createdBy: '1',
  },
  {
    id: '5',
    title: 'Write unit tests',
    description: 'Add test coverage for core functionality',
    status: 'todo',
    priority: 'medium',
    assignee: { id: '3', name: 'Charlie Davis', avatar: '👨‍🎨' },
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    createdBy: '2',
  },
  {
    id: '6',
    title: 'Deploy to staging',
    description: 'Set up staging environment and deploy application',
    status: 'todo',
    priority: 'low',
    assignee: null, // Unassigned
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    createdBy: '1',
  },
];

/**
 * Task service implementation.
 * 
 * Learning Note:
 * We use a plain object instead of a class because:
 * - Simpler (no 'this' binding)
 * - No need for 'new' keyword
 * - Easier to tree-shake
 * - More functional style
 * - Still fully type-safe!
 */
export const taskService: TaskService = {
  createTask(taskData: CreateTaskData): Task {
    /*
     * Get current user from auth store.
     * 
     * Learning Note - get() function:
     * Svelte's get() function reads a store's current value synchronously.
     * Use this in services/functions where you can't use $ prefix.
     * 
     * In components: $authStore.currentUser
     * In services: get(authStore).currentUser
     */
    const currentUser = get(authStore).currentUser;

    /*
     * Validate that user is logged in.
     * In production, this would throw an error or return a result type.
     */
    if (!currentUser) {
      throw new Error('User must be logged in to create tasks');
    }

    /*
     * Create new task with generated fields.
     * 
     * Learning Note:
     * We generate:
     * - id: Using crypto.randomUUID() (built-in browser API)
     * - timestamps: Using Date.now()
     * - createdBy: From current user
     */
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: currentUser.id,
    };

    /*
     * Add to store.
     * All components subscribed to tasksStore will automatically update!
     */
    tasksStore.addOne(newTask);

    /*
     * Persist to storage.
     */
    this.persistTasks();

    return newTask;
  },

  updateTask(taskId: EntityId, changes: UpdateTaskData): void {
    /*
     * Update task in store with new updatedAt timestamp.
     * 
     * Learning Note:
     * We always update the timestamp to track when changes were made.
     * This is useful for "last modified" displays and conflict resolution.
     */
    tasksStore.updateOne(taskId, {
      ...changes,
      updatedAt: Date.now(),
    });

    /*
     * Persist to storage.
     */
    this.persistTasks();
  },

  deleteTask(taskId: EntityId): void {
    /*
     * Remove from store.
     */
    tasksStore.removeOne(taskId);

    /*
     * Persist to storage.
     */
    this.persistTasks();
  },

  moveTask(taskId: EntityId, newStatus: TaskStatus): void {
    /*
     * Use the store's moveTask method.
     * This updates both status and updatedAt.
     * 
     * Learning Note:
     * We could call updateTask() here, but using the dedicated
     * moveTask method is more semantic and clear.
     */
    tasksStore.moveTask(taskId, newStatus);

    /*
     * Update timestamp separately since moveTask doesn't do it.
     */
    tasksStore.updateOne(taskId, {
      updatedAt: Date.now(),
    });

    /*
     * Persist to storage.
     */
    this.persistTasks();
  },

  loadTasks(): void {
    /*
     * Try to load tasks from storage.
     */
    const stored = storageService.getItem<Task[]>(STORAGE_KEYS.TASKS);

    if (stored && stored.length > 0) {
      /*
       * Load saved tasks.
       */
      tasksStore.setAll(stored);
    } else {
      /*
       * No saved tasks, load initial mock data.
       * This gives users something to explore on first launch.
       */
      tasksStore.setAll(INITIAL_TASKS);

      /*
       * Save initial tasks so they persist.
       */
      this.persistTasks();
    }
  },

  persistTasks(): void {
    /*
     * Get current tasks from store.
     * 
     * Learning Note:
     * We use get() to read the store synchronously.
     * This is necessary in services where we can't use $ prefix.
     */
    const currentTasks = get(tasksStore);

    /*
     * Save to storage.
     */
    storageService.setItem(STORAGE_KEYS.TASKS, currentTasks);
  },
};

/*
 * Re-export types for convenience.
 */
export type { TaskService } from './taskService.types';

/*
 * Learning Note - Service Pattern Benefits:
 * 
 * 1. Separation of Concerns:
 *    - Store: Holds state
 *    - Service: Handles logic
 *    - Component: Renders UI
 * 
 * 2. Testability:
 *    - Easy to mock taskService
 *    - Test logic without UI
 *    - Test UI without real tasks
 * 
 * 3. Reusability:
 *    - Use service from any component
 *    - Use service from other services
 *    - No component coupling
 * 
 * 4. Maintainability:
 *    - Logic in one place
 *    - Easy to find and update
 *    - Clear responsibilities
 * 
 * 5. Coordination:
 *    - Coordinates multiple stores (tasks, auth)
 *    - Handles side effects (storage)
 *    - Encapsulates business rules
 * 
 * This is professional Svelte architecture!
 */
