# TaskFlow Design Document

## Overview

TaskFlow is a Svelte 5 task tracking application that demonstrates modern Svelte patterns including runes, stores, and component composition. The architecture is designed to be intuitive for React developers while showcasing Svelte's unique reactivity model and simplified state management compared to Redux.

### Key Learning Objectives

- **Svelte 5 Runes**: Master `$state`, `$derived`, and `$effect` for reactive programming
- **Stores vs Redux**: Understand Svelte's lightweight store pattern as an alternative to Redux
- **Component Patterns**: Learn Svelte's prop passing, event dispatching, and slot composition
- **TypeScript Integration**: Type-safe Svelte components and stores
- **Native Drag & Drop**: Implement drag-and-drop without external libraries
- **Transitions**: Use Svelte's built-in animation system
- **Two-way Binding**: Leverage Svelte's `bind:` directive for forms
- **Feature-Driven Architecture**: Organize code by business domain, not technical layer
- **Service Layer Pattern**: Separate business logic from state management

### Documentation Standards

**All code will include comprehensive documentation**:

1. **JSDoc Comments**: Every function, interface, type, and exported constant
2. **Inline Comments**: Explain complex logic, Svelte-specific patterns, and learning points
3. **Block Comments**: Use `/* */` style for multi-line explanations
4. **Type Documentation**: Every interface field documented with purpose and constraints
5. **Component Documentation**: Props, events, and usage examples
6. **Learning Callouts**: Special comments highlighting Svelte concepts for React developers

**Example Documentation Style**:
```typescript
/**
 * Multi-line JSDoc comment for functions and types.
 * Explains purpose, parameters, return values, and usage.
 * 
 * @param param1 - Description of parameter
 * @returns Description of return value
 * 
 * @example
 * ```typescript
 * const result = myFunction('value');
 * ```
 */

/*
 * Block comment for complex logic explanation.
 * Used when multiple lines of context are needed.
 * Explains the "why" not just the "what".
 */

// Single-line comment for brief clarifications
```

### Technology Stack

- **Svelte 5**: Latest version with runes support
- **TypeScript**: Full type safety with comprehensive JSDoc comments
- **Vite**: Build tool and dev server
- **Local Storage API**: Data persistence
- **Native Drag & Drop API**: Task movement between columns
- **CSS Modules**: Scoped component styles with `.module.css` files

## Architecture

### High-Level Structure (Feature-Driven Architecture)

```
src/
├── features/                # Business feature modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.svelte
│   │   │   └── LoginForm.module.css
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── stores/
│   │   │   └── authStore.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── tasks/
│   │   ├── components/
│   │   │   ├── Board.svelte
│   │   │   ├── Board.module.css
│   │   │   ├── Column.svelte
│   │   │   ├── Column.module.css
│   │   │   ├── TaskCard.svelte
│   │   │   ├── TaskCard.module.css
│   │   │   ├── TaskForm.svelte
│   │   │   └── TaskForm.module.css
│   │   ├── services/
│   │   │   └── taskService.ts
│   │   ├── stores/
│   │   │   └── tasksStore.ts
│   │   └── types/
│   │       └── task.types.ts
│   └── filters/
│       ├── components/
│       │   ├── FilterBar.svelte
│       │   └── FilterBar.module.css
│       ├── stores/
│       │   └── filtersStore.ts
│       └── types/
│           └── filter.types.ts
├── shared/                  # Shared utilities and components
│   ├── components/
│   │   ├── Header.svelte
│   │   └── Header.module.css
│   ├── services/
│   │   └── storageService.ts
│   └── types/
│       └── common.types.ts
├── App.svelte
├── App.module.css
└── app.html
```

**Architecture Philosophy**:

This feature-driven structure encapsulates related logic together, making it easier to:
- Understand feature boundaries
- Locate related code (components, services, stores, types)
- Scale the application by adding new features
- Test features in isolation

Each feature module is self-contained with its own:
- **Components**: UI elements specific to the feature
- **Services**: Business logic and API interactions
- **Stores**: Feature-specific state management
- **Types**: TypeScript definitions for the feature domain

### State Management Philosophy

**Coming from Redux, here's the mental model shift:**

- **Redux**: Centralized store → actions → reducers → selectors → connect/useSelector
- **Svelte Stores + Services**: Services encapsulate business logic, stores hold state, no boilerplate

**Example comparison:**

```typescript
// Redux way (what you're used to)
dispatch(updateTask({ id, changes }))

// Svelte way (what you'll learn)
// Service handles business logic
taskService.updateTask(id, changes)
// Which internally updates the store
```

**Service Layer Benefits**:
- Encapsulates business logic separate from state
- Makes testing easier (mock services, not stores)
- Provides clear API boundaries
- Handles side effects (storage, validation, etc.)
- Similar to Redux Thunks/Sagas but simpler

## Components and Interfaces

### Component Hierarchy

```
App
├── LoginForm (when not authenticated)
└── Authenticated View
    ├── Header
    │   ├── User Info
    │   └── Logout Button
    ├── FilterBar
    │   ├── Search Input
    │   ├── Assignee Filter
    │   └── Priority Filter
    └── Board
        ├── Column (To Do)
        │   └── TaskCard[]
        ├── Column (In Progress)
        │   └── TaskCard[]
        └── Column (Done)
            └── TaskCard[]
```

### Component Details

#### 1. App.svelte (Root Component)

**Purpose**: Main application shell, handles authentication routing

**Runes Used**:
- `$state`: Track authentication status
- `$derived`: Compute whether to show login or board

**Props**: None (root component)

**Key Learning**: 
- How Svelte 5 runes replace `let` for reactive state
- Conditional rendering with `{#if}` blocks

```svelte
<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import LoginForm from '$lib/components/LoginForm.svelte';
  import Header from '$lib/components/Header.svelte';
  import Board from '$lib/components/Board.svelte';
  
  // Svelte 5 rune: reactive state from store
  let isAuthenticated = $derived($authStore.isAuthenticated);
</script>

{#if !isAuthenticated}
  <LoginForm />
{:else}
  <Header />
  <Board />
{/if}
```

#### 2. LoginForm.svelte

**Purpose**: Mock authentication interface

**Runes Used**:
- `$state`: Form field values and error messages
- `$effect`: Auto-focus username input on mount

**Props**: None

**Events**: None (uses store directly)

**Key Learning**:
- Two-way binding with `bind:value`
- Form handling in Svelte
- Store methods for state updates

**Interface**:
```typescript
// Internal state
let username = $state('');
let password = $state('');
let error = $state('');
```

#### 3. Header.svelte

**Purpose**: Display user info and logout button

**Runes Used**:
- `$derived`: Get current user from auth store

**Props**: None

**Events**: 
- `logout`: Calls auth store logout method

**Key Learning**:
- Reading from stores
- Event handlers in Svelte

#### 4. FilterBar.svelte

**Purpose**: Search and filter controls

**Runes Used**:
- `$state`: Local filter UI state
- `$effect`: Sync local state with filter store

**Props**: None

**Events**: None (updates filter store directly)

**Key Learning**:
- Debouncing search input
- Multiple filter coordination
- Store subscriptions and updates

**Interface**:
```typescript
let searchQuery = $state('');
let selectedAssignee = $state<string | null>(null);
let selectedPriority = $state<Priority | null>(null);
```

#### 5. Board.svelte

**Purpose**: Container for all columns, manages drag-and-drop context

**Runes Used**:
- `$derived`: Get filtered tasks from store
- `$state`: Track drag state

**Props**: None

**Events**: 
- Handles drag events from TaskCard children

**Key Learning**:
- Parent-child communication
- Drag-and-drop coordination
- Derived state from stores

**Interface**:
```typescript
let draggedTaskId = $state<string | null>(null);
let filteredTasks = $derived(getFilteredTasks($tasksStore, $filtersStore));
```

#### 6. Column.svelte

**Purpose**: Represents a single status column (To Do, In Progress, Done)

**Runes Used**:
- `$derived`: Filter tasks for this column
- `$state`: Track drop zone hover state

**Props**:
```typescript
interface Props {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
}
```

**Events**:
- `drop`: Emits when task dropped in column
- `addTask`: Opens task creation form

**Key Learning**:
- Props with TypeScript
- Event dispatching
- Drop zone implementation

#### 7. TaskCard.svelte

**Purpose**: Individual task display and interaction

**Runes Used**:
- `$state`: Track hover, drag, and edit states

**Props**:
```typescript
interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}
```

**Events**:
- `click`: Open edit form
- `dragstart`, `dragend`: Drag operations
- `delete`: Delete confirmation

**Key Learning**:
- Draggable elements
- Event modifiers (|preventDefault, |stopPropagation)
- Transitions for smooth animations
- Component styling with scoped CSS

#### 8. TaskForm.svelte

**Purpose**: Create and edit tasks (modal dialog)

**Runes Used**:
- `$state`: Form fields and validation errors
- `$derived`: Compute form validity
- `$effect`: Focus first input on mount

**Props**:
```typescript
interface Props {
  task?: Task;  // undefined for create, Task for edit
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
}
```

**Events**:
- `save`: Emits validated task data
- `cancel`: Closes form

**Key Learning**:
- Form validation
- Conditional rendering (create vs edit mode)
- Two-way binding with objects
- Modal overlay patterns

## Data Models

### Core Types (Fully Documented)

All types will include comprehensive JSDoc comments explaining purpose, usage, and field meanings.

```typescript
// features/tasks/types/task.types.ts

/**
 * Represents the current status/stage of a task in the workflow.
 * Tasks progress from 'todo' → 'in-progress' → 'done'.
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/**
 * Priority level for task urgency and importance.
 * Used for visual indicators and filtering.
 */
export type Priority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Represents a user in the system.
 * Used for authentication and task assignment.
 */
export interface User {
  /**
   * Unique identifier for the user.
   * Generated using UUID v4.
   */
  id: string;

  /**
   * Username for login authentication.
   * Must be unique across all users.
   */
  username: string;

  /**
   * Display name shown in the UI.
   * Can contain spaces and special characters.
   */
  name: string;

  /**
   * Optional emoji or image URL for user avatar.
   * Displayed in task cards and user selection dropdowns.
   */
  avatar?: string;
}

/**
 * Represents a single task/work item in the system.
 * Tasks can be created, edited, moved between columns, and deleted.
 */
export interface Task {
  /**
   * Unique identifier for the task.
   * Generated using crypto.randomUUID().
   */
  id: string;

  /**
   * Short descriptive title of the task.
   * Minimum length: 3 characters.
   * Displayed prominently on task cards.
   */
  title: string;

  /**
   * Detailed description of the task requirements.
   * Optional field, can be empty string.
   * Supports multi-line text.
   */
  description: string;

  /**
   * Current workflow status of the task.
   * Determines which column the task appears in.
   */
  status: TaskStatus;

  /**
   * Priority level for the task.
   * Affects visual styling and can be used for filtering.
   */
  priority: Priority;

  /**
   * ID of the user assigned to this task.
   * Null if task is unassigned.
   * Must reference a valid user ID from the users list.
   */
  assigneeId: string | null;

  /**
   * Timestamp (milliseconds since epoch) when task was created.
   * Set automatically on task creation, never modified.
   */
  createdAt: number;

  /**
   * Timestamp (milliseconds since epoch) of last modification.
   * Updated whenever task properties change.
   */
  updatedAt: number;

  /**
   * ID of the user who created this task.
   * References the authenticated user at creation time.
   */
  createdBy: string;
}

/**
 * Authentication state for the application.
 * Tracks current user session and authentication status.
 */
export interface AuthState {
  /**
   * Whether a user is currently logged in.
   * Controls routing between login screen and main app.
   */
  isAuthenticated: boolean;

  /**
   * Currently authenticated user object.
   * Null when no user is logged in.
   */
  currentUser: User | null;

  /**
   * Session token for maintaining authentication.
   * Stored in localStorage for session persistence.
   * In production, this would be a JWT or similar.
   */
  sessionToken: string | null;
}

/**
 * Active filter criteria for task list.
 * All filters are applied with AND logic (must match all active filters).
 */
export interface FilterState {
  /**
   * Text search query for filtering tasks.
   * Searches in both task title and description (case-insensitive).
   * Empty string means no search filter active.
   */
  searchQuery: string;

  /**
   * Filter tasks by assigned user.
   * Null means show tasks for all users.
   * When set, only shows tasks assigned to this user ID.
   */
  assigneeId: string | null;

  /**
   * Filter tasks by priority level.
   * Null means show tasks of all priorities.
   * When set, only shows tasks with matching priority.
   */
  priority: Priority | null;
}
```

### Mock Data

```typescript
// features/auth/services/authService.ts (mock data section)

/**
 * Mock user accounts for development and learning.
 * In production, this would come from a backend API.
 */
export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    username: 'alice', 
    name: 'Alice Johnson', 
    avatar: '👩‍💼' 
  },
  { 
    id: '2', 
    username: 'bob', 
    name: 'Bob Smith', 
    avatar: '👨‍💻' 
  },
  { 
    id: '3', 
    username: 'charlie', 
    name: 'Charlie Davis', 
    avatar: '👨‍🎨' 
  }
];

/**
 * Mock credentials for authentication.
 * All users share the same password for simplicity.
 * In production, passwords would be hashed and verified server-side.
 */
export const MOCK_CREDENTIALS: Record<string, string> = {
  'alice': 'password123',
  'bob': 'password123',
  'charlie': 'password123'
};

/**
 * Initial sample tasks to demonstrate the application.
 * Loaded on first app launch if no tasks exist in localStorage.
 */
export const INITIAL_TASKS: Task[] = [
  // Sample tasks will be defined in implementation
];
```

## Service Layer Architecture

### Shared Storage Service (shared/services/storageService.ts)

**Purpose**: Centralized localStorage wrapper with error handling

**Key Learning**: Shared utilities can be used across features

```typescript
/**
 * Storage service providing safe localStorage access with error handling.
 * Handles JSON serialization/deserialization and graceful degradation.
 * 
 * @example
 * ```typescript
 * storageService.setItem('user', { id: '1', name: 'Alice' });
 * const user = storageService.getItem<User>('user');
 * ```
 */
export const storageService = {
  /**
   * Stores an item in localStorage with JSON serialization.
   * Handles errors gracefully if storage is unavailable.
   * 
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save to localStorage (key: ${key}):`, error);
      // In production, could show user notification
    }
  },

  /**
   * Retrieves and deserializes an item from localStorage.
   * Returns null if item doesn't exist or parsing fails.
   * 
   * @param key - Storage key
   * @returns Parsed value or null
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to read from localStorage (key: ${key}):`, error);
      return null;
    }
  },

  /**
   * Removes an item from localStorage.
   * 
   * @param key - Storage key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from localStorage (key: ${key}):`, error);
    }
  },

  /**
   * Checks if localStorage is available.
   * Useful for showing warnings if storage is disabled.
   * 
   * @returns True if localStorage is accessible
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};
```

### 1. Auth Service (features/auth/services/authService.ts)

**Purpose**: Handle authentication business logic

**Key Learning**: Services encapsulate business logic, stores hold state

```typescript
import { authStore } from '../stores/authStore';
import type { User } from '../types/auth.types';
import { storageService } from '@/shared/services/storageService';

/**
 * Authentication service handling login, logout, and session management.
 * Encapsulates business logic separate from state management.
 * 
 * @example
 * ```typescript
 * const result = await authService.login('alice', 'password123');
 * if (result.success) {
 *   // User is now authenticated
 * }
 * ```
 */
export const authService = {
  /**
   * Attempts to authenticate a user with provided credentials.
   * On success, updates auth store and persists session.
   * 
   * @param username - The username to authenticate
   * @param password - The password to verify
   * @returns Promise resolving to success status and optional error message
   */
  async login(username: string, password: string): Promise<{ 
    success: boolean; 
    error?: string 
  }> {
    // Validate credentials against mock data
    const user = MOCK_USERS.find(u => u.username === username);
    
    if (!user || MOCK_CREDENTIALS[username] !== password) {
      return { 
        success: false, 
        error: 'Invalid username or password' 
      };
    }

    // Generate mock session token
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    // Update store
    authStore.setAuthenticated(user, token);
    
    // Persist session
    storageService.setItem('auth', { user, token });
    
    return { success: true };
  },

  /**
   * Logs out the current user.
   * Clears auth store and removes persisted session.
   */
  logout(): void {
    authStore.clearAuthentication();
    storageService.removeItem('auth');
  },

  /**
   * Attempts to restore a previous session from storage.
   * Called on app initialization.
   * 
   * @returns True if session was restored, false otherwise
   */
  restoreSession(): boolean {
    const stored = storageService.getItem<{ user: User; token: string }>('auth');
    
    if (stored) {
      authStore.setAuthenticated(stored.user, stored.token);
      return true;
    }
    
    return false;
  }
};
```

### 2. Task Service (features/tasks/services/taskService.ts)

**Purpose**: Handle task CRUD operations and business logic

**Key Learning**: Services coordinate between stores and external dependencies

```typescript
import { tasksStore } from '../stores/tasksStore';
import type { Task, TaskStatus } from '../types/task.types';
import { storageService } from '@/shared/services/storageService';

/**
 * Task management service handling all task-related business logic.
 * Coordinates between task store and storage service.
 * 
 * @example
 * ```typescript
 * taskService.createTask({
 *   title: 'New task',
 *   description: 'Task details',
 *   priority: 'high',
 *   assigneeId: '1'
 * });
 * ```
 */
export const taskService = {
  /**
   * Creates a new task with provided data.
   * Generates ID and timestamps automatically.
   * 
   * @param taskData - Partial task data (without id, timestamps)
   * @param currentUserId - ID of user creating the task
   * @returns The created task object
   */
  createTask(
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>,
    currentUserId: string
  ): Task {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: currentUserId
    };

    tasksStore.addTask(newTask);
    this.persistTasks();
    
    return newTask;
  },

  /**
   * Updates an existing task with new data.
   * Automatically updates the updatedAt timestamp.
   * 
   * @param taskId - ID of task to update
   * @param changes - Partial task data to merge
   */
  updateTask(taskId: string, changes: Partial<Task>): void {
    tasksStore.updateTask(taskId, {
      ...changes,
      updatedAt: Date.now()
    });
    this.persistTasks();
  },

  /**
   * Deletes a task by ID.
   * 
   * @param taskId - ID of task to delete
   */
  deleteTask(taskId: string): void {
    tasksStore.removeTask(taskId);
    this.persistTasks();
  },

  /**
   * Moves a task to a different status column.
   * Used for drag-and-drop operations.
   * 
   * @param taskId - ID of task to move
   * @param newStatus - Target status column
   */
  moveTask(taskId: string, newStatus: TaskStatus): void {
    tasksStore.updateTask(taskId, {
      status: newStatus,
      updatedAt: Date.now()
    });
    this.persistTasks();
  },

  /**
   * Loads tasks from persistent storage.
   * Called on app initialization.
   */
  loadTasks(): void {
    const stored = storageService.getItem<Task[]>('tasks');
    if (stored) {
      tasksStore.setTasks(stored);
    }
  },

  /**
   * Persists current tasks to storage.
   * Called after any task modification.
   */
  private persistTasks(): void {
    // Get current tasks from store
    let currentTasks: Task[] = [];
    tasksStore.subscribe(tasks => {
      currentTasks = tasks;
    })();
    
    storageService.setItem('tasks', currentTasks);
  }
};
```

## Store Architecture

Stores hold state only, business logic lives in services.

### 1. Auth Store (features/auth/stores/authStore.ts)

**Purpose**: Hold authentication state

**Type**: Writable store with minimal methods

**Key Learning**: Stores are simple state containers

```typescript
import { writable } from 'svelte/store';
import type { AuthState, User } from '../types/auth.types';

/**
 * Creates the authentication store.
 * Holds current authentication state but delegates business logic to authService.
 * 
 * @returns Store with authentication state and update methods
 */
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    sessionToken: null
  });

  return {
    subscribe,
    
    /**
     * Sets authenticated state with user and token.
     * Called by authService after successful login.
     * 
     * @param user - Authenticated user object
     * @param token - Session token
     */
    setAuthenticated: (user: User, token: string) => {
      set({
        isAuthenticated: true,
        currentUser: user,
        sessionToken: token
      });
    },
    
    /**
     * Clears authentication state.
     * Called by authService on logout.
     */
    clearAuthentication: () => {
      set({
        isAuthenticated: false,
        currentUser: null,
        sessionToken: null
      });
    }
  };
}

/**
 * Global authentication store instance.
 * Subscribe to this store to react to authentication changes.
 * 
 * @example
 * ```svelte
 * <script>
 *   import { authStore } from './stores/authStore';
 *   let isAuthenticated = $derived($authStore.isAuthenticated);
 * </script>
 * ```
 */
export const authStore = createAuthStore();
```

### 2. Tasks Store (features/tasks/stores/tasksStore.ts)

**Purpose**: Hold task list state

**Type**: Writable store with simple update methods

**Key Learning**: Stores are simple, services handle complexity

```typescript
import { writable } from 'svelte/store';
import type { Task } from '../types/task.types';

/**
 * Creates the tasks store.
 * Holds the list of all tasks in the application.
 * Business logic is handled by taskService.
 * 
 * @returns Store with task array and update methods
 */
function createTasksStore() {
  const { subscribe, set, update } = writable<Task[]>([]);

  return {
    subscribe,
    
    /**
     * Replaces entire task list.
     * Used when loading tasks from storage.
     * 
     * @param tasks - New task array
     */
    setTasks: (tasks: Task[]) => {
      set(tasks);
    },
    
    /**
     * Adds a new task to the list.
     * Called by taskService after creating a task.
     * 
     * @param task - Task to add
     */
    addTask: (task: Task) => {
      update(tasks => [...tasks, task]);
    },
    
    /**
     * Updates an existing task by ID.
     * Merges provided changes with existing task data.
     * 
     * @param taskId - ID of task to update
     * @param changes - Partial task data to merge
     */
    updateTask: (taskId: string, changes: Partial<Task>) => {
      update(tasks =>
        tasks.map(task =>
          task.id === taskId
            ? { ...task, ...changes }
            : task
        )
      );
    },
    
    /**
     * Removes a task from the list by ID.
     * 
     * @param taskId - ID of task to remove
     */
    removeTask: (taskId: string) => {
      update(tasks => tasks.filter(task => task.id !== taskId));
    }
  };
}

/**
 * Global tasks store instance.
 * Contains all tasks in the application.
 * 
 * @example
 * ```svelte
 * <script>
 *   import { tasksStore } from './stores/tasksStore';
 *   let tasks = $derived($tasksStore);
 * </script>
 * ```
 */
export const tasksStore = createTasksStore();
```

### 3. Filters Store (features/filters/stores/filtersStore.ts)

**Purpose**: Hold active filter criteria

**Type**: Simple writable store

**Key Learning**: Not all state needs a service layer

```typescript
import { writable } from 'svelte/store';
import type { FilterState } from '../types/filter.types';

/**
 * Global filter state store.
 * Tracks active search query and filter selections.
 * Updated directly by FilterBar component.
 * 
 * @example
 * ```svelte
 * <script>
 *   import { filtersStore } from './stores/filtersStore';
 *   
 *   function updateSearch(query: string) {
 *     filtersStore.update(f => ({ ...f, searchQuery: query }));
 *   }
 * </script>
 * ```
 */
export const filtersStore = writable<FilterState>({
  /**
   * Current search query text.
   * Empty string means no search active.
   */
  searchQuery: '',
  
  /**
   * Selected assignee filter.
   * Null means show all assignees.
   */
  assigneeId: null,
  
  /**
   * Selected priority filter.
   * Null means show all priorities.
   */
  priority: null
});
```

### 4. Derived Stores

**Purpose**: Computed values (like Redux selectors)

**Key Learning**: Derived stores auto-update when dependencies change

```typescript
// In Board.svelte or a separate file
import { derived } from 'svelte/store';
import { tasksStore } from './tasks';
import { filtersStore } from './filters';

export const filteredTasks = derived(
  [tasksStore, filtersStore],
  ([$tasks, $filters]) => {
    return $tasks.filter(task => {
      // Search filter
      if ($filters.searchQuery) {
        const query = $filters.searchQuery.toLowerCase();
        if (!task.title.toLowerCase().includes(query) &&
            !task.description.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Assignee filter
      if ($filters.assigneeId && task.assigneeId !== $filters.assigneeId) {
        return false;
      }
      
      // Priority filter
      if ($filters.priority && task.priority !== $filters.priority) {
        return false;
      }
      
      return true;
    });
  }
);
```

## Drag and Drop Implementation

### Strategy

Use native HTML5 Drag and Drop API with Svelte's event handling.

**Key Learning**: Svelte makes native APIs easy to use without wrapper libraries

### TaskCard Draggable

```svelte
<script lang="ts">
  import type { Task } from '$lib/types';
  
  interface Props {
    task: Task;
    onDragStart: (taskId: string) => void;
    onDragEnd: () => void;
  }
  
  let { task, onDragStart, onDragEnd }: Props = $props();
  
  function handleDragStart(e: DragEvent) {
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', task.id);
    onDragStart(task.id);
  }
</script>

<div
  draggable="true"
  ondragstart={handleDragStart}
  ondragend={onDragEnd}
  class="task-card"
>
  <!-- Task content -->
</div>
```

### Column Drop Zone

```svelte
<script lang="ts">
  import type { TaskStatus } from '$lib/types';
  
  interface Props {
    status: TaskStatus;
    onDrop: (taskId: string, newStatus: TaskStatus) => void;
  }
  
  let { status, onDrop }: Props = $props();
  let isOver = $state(false);
  
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
    isOver = true;
  }
  
  function handleDragLeave() {
    isOver = false;
  }
  
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const taskId = e.dataTransfer!.getData('text/plain');
    onDrop(taskId, status);
    isOver = false;
  }
</script>

<div
  class="column"
  class:drag-over={isOver}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <slot />
</div>
```

## Error Handling

### Strategy

- **Form Validation**: Client-side validation with error messages
- **Storage Errors**: Graceful degradation if localStorage unavailable
- **Auth Errors**: Clear error messages for invalid credentials

### Implementation Patterns

```typescript
// Form validation example
let errors = $state<Record<string, string>>({});

function validateTask(task: Partial<Task>): boolean {
  errors = {};
  
  if (!task.title || task.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  
  return Object.keys(errors).length === 0;
}

// Storage error handling
function saveToStorage(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage unavailable:', e);
    // Continue with in-memory state
  }
}
```

## Testing Strategy

### Unit Tests

- **Stores**: Test store methods and state updates
- **Utils**: Test filtering, validation, and storage functions
- **Components**: Test component logic with Svelte Testing Library

### Integration Tests

- **User Flows**: Login → Create Task → Move Task → Filter → Logout
- **Drag and Drop**: Verify task movement between columns
- **Persistence**: Verify localStorage integration

### Tools

- **Vitest**: Test runner (Vite-native)
- **@testing-library/svelte**: Component testing
- **@testing-library/user-event**: User interaction simulation

## Styling Approach

### Strategy

Use CSS Modules for scoped, type-safe styling with CSS custom properties for theming.

**Key Learning**: CSS Modules provide scoped styles with better IDE support and type safety

### Theme Variables

```css
/* src/styles/theme.css */

/**
 * Global CSS custom properties for consistent theming.
 * These variables are available to all components.
 */
:root {
  /* Brand colors */
  --color-primary: #0073ea;
  --color-success: #00c875;
  --color-warning: #fdab3d;
  --color-danger: #e44258;
  
  /* Priority colors - used for task priority indicators */
  --priority-low: #c4c4c4;
  --priority-medium: #fdab3d;
  --priority-high: #ff6b6b;
  --priority-critical: #e44258;
  
  /* Spacing scale - use for consistent margins and padding */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* UI elements */
  --border-radius: 8px;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
}
```

### CSS Modules Example

```css
/* TaskCard.module.css */

/**
 * Main task card container.
 * Displays task information with hover effects and drag support.
 */
.taskCard {
  background: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow);
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  gap: var(--spacing-sm);
}

/**
 * Hover state - lifts card slightly for visual feedback.
 */
.taskCard:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

/**
 * Active drag state - changes cursor to indicate dragging.
 */
.taskCard:active {
  cursor: grabbing;
}

/**
 * Vertical priority indicator bar on left side of card.
 * Color determined by priority level.
 */
.priorityIndicator {
  width: 4px;
  height: 100%;
  border-radius: 2px;
  flex-shrink: 0;
}

/* Priority color variants */
.priorityLow { 
  background: var(--priority-low); 
}

.priorityMedium { 
  background: var(--priority-medium); 
}

.priorityHigh { 
  background: var(--priority-high); 
}

.priorityCritical { 
  background: var(--priority-critical); 
}

/**
 * Task content area containing title and description.
 */
.content {
  flex: 1;
  min-width: 0; /* Allows text truncation */
}

/**
 * Task title text.
 */
.title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: #333;
}

/**
 * Task description text.
 * Truncated with ellipsis if too long.
 */
.description {
  font-size: var(--font-size-sm);
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Using CSS Modules in Components

```svelte
<script lang="ts">
  import styles from './TaskCard.module.css';
  import type { Task } from '../types/task.types';
  
  interface Props {
    task: Task;
  }
  
  let { task }: Props = $props();
  
  // Compute priority class name
  const priorityClass = $derived(
    styles[`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`]
  );
</script>

<div class={styles.taskCard}>
  <div class="{styles.priorityIndicator} {priorityClass}"></div>
  <div class={styles.content}>
    <div class={styles.title}>{task.title}</div>
    <div class={styles.description}>{task.description}</div>
  </div>
</div>
```

**Benefits of CSS Modules**:
- Scoped styles prevent naming conflicts
- TypeScript support for class names
- Better IDE autocomplete
- Explicit imports make dependencies clear
- Works seamlessly with Vite

## Transitions and Animations

### Svelte Transitions

**Key Learning**: Svelte has built-in transition directives

```svelte
<script>
  import { fade, fly, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
</script>

<!-- Fade in/out -->
{#if showModal}
  <div transition:fade={{ duration: 200 }}>
    <TaskForm />
  </div>
{/if}

<!-- Fly in from side -->
{#each tasks as task (task.id)}
  <div
    in:fly={{ x: -20, duration: 300 }}
    out:fade={{ duration: 200 }}
    animate:flip={{ duration: 300 }}
  >
    <TaskCard {task} />
  </div>
{/each}
```

### Custom Animations

```typescript
// Custom drag animation
function dragAnimation(node: HTMLElement) {
  return {
    duration: 300,
    css: (t: number) => `
      opacity: ${t};
      transform: scale(${0.9 + t * 0.1});
    `
  };
}
```

## Performance Considerations

### Optimization Strategies

1. **Derived Stores**: Memoize filtered/computed data
2. **Keyed Each Blocks**: Use `{#each items as item (item.id)}` for efficient list updates
3. **Event Delegation**: Use parent handlers where appropriate
4. **Lazy Loading**: Load components on demand if needed
5. **Debouncing**: Debounce search input to reduce filter recalculations

### Svelte Compiler Optimizations

Svelte compiles to vanilla JS with no virtual DOM, making it inherently fast. The compiler:
- Eliminates unused code
- Optimizes reactive statements
- Generates efficient DOM updates

## Development Workflow

### Setup Steps

1. Create Svelte project with TypeScript: `npm create vite@latest taskflow -- --template svelte-ts`
2. Install dependencies
3. Configure TypeScript for strict mode
4. Set up project structure
5. Create mock data and types
6. Build stores
7. Implement components bottom-up (TaskCard → Column → Board)
8. Add drag-and-drop
9. Implement filtering
10. Add transitions and polish

### Development Server

```bash
npm run dev
```

Vite provides:
- Hot Module Replacement (HMR)
- Fast refresh for Svelte components
- TypeScript checking
- Instant server start

## Comparison: React vs Svelte

### State Management

**React (Redux)**:
```typescript
// Action
dispatch(addTask({ title, description }));

// Reducer
case 'ADD_TASK':
  return [...state, action.payload];

// Selector
const tasks = useSelector(state => state.tasks);
```

**Svelte**:
```typescript
// Direct store method
tasksStore.add({ title, description });

// Subscribe in component
let tasks = $derived($tasksStore);
```

### Component Reactivity

**React**:
```typescript
const [count, setCount] = useState(0);
const doubled = useMemo(() => count * 2, [count]);

useEffect(() => {
  console.log('Count changed:', count);
}, [count]);
```

**Svelte 5**:
```typescript
let count = $state(0);
let doubled = $derived(count * 2);

$effect(() => {
  console.log('Count changed:', count);
});
```

### Two-Way Binding

**React**:
```typescript
<input
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

**Svelte**:
```svelte
<input bind:value={text} />
```

### Conditional Rendering

**React**:
```typescript
{isVisible && <Component />}
{isVisible ? <A /> : <B />}
```

**Svelte**:
```svelte
{#if isVisible}
  <Component />
{/if}

{#if isVisible}
  <A />
{:else}
  <B />
{/if}
```

### Lists

**React**:
```typescript
{items.map(item => (
  <Item key={item.id} {...item} />
))}
```

**Svelte**:
```svelte
{#each items as item (item.id)}
  <Item {...item} />
{/each}
```

## Key Takeaways for React Developers

1. **No Virtual DOM**: Svelte compiles to efficient imperative code
2. **Less Boilerplate**: No hooks, no memo, no useCallback
3. **Built-in Reactivity**: Variables are reactive by default with runes
4. **Scoped Styles**: CSS is scoped automatically, no CSS-in-JS needed
5. **Smaller Bundle**: Svelte apps are typically 30-50% smaller
6. **Simpler State**: Stores are simpler than Redux, no middleware needed
7. **Better DX**: Less code, more readable, faster compilation

This project will give you hands-on experience with all these concepts!
