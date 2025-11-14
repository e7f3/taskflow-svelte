/**
 * Filters Store
 *
 * Manages the state of task filters (search, assignee, priority).
 *
 * Learning Note - Svelte Stores:
 * This is a writable store that holds filter state.
 * Components can subscribe to it with the $ prefix and update it
 * using the provided methods.
 *
 * Compare to Redux:
 * - No actions or reducers needed
 * - Direct method calls instead of dispatching actions
 * - Much simpler and less boilerplate
 * - Still centralized and reactive
 */

import { writable } from 'svelte/store';
import type { Priority } from '@/features/tasks/types/task.types';
import type { EntityId } from '@/shared/types/common.types';
import type { FilterState } from './filtersStore.types';

/**
 * Initial filter state - all filters disabled.
 */
const initialState: FilterState = {
  searchQuery: undefined,
  assigneeId: undefined,
  priority: undefined,
};

/**
 * Create the filters store.
 *
 * Learning Note:
 * We use writable() to create a store that can be updated.
 * The store holds the current filter state.
 */
const { subscribe, set, update } = writable<FilterState>(initialState);

/**
 * Filters store with methods for updating filter state.
 *
 * Learning Note - Store Pattern:
 * We export an object with:
 * - subscribe: allows components to react to changes
 * - custom methods: provide a clean API for updates
 *
 * This is similar to Redux selectors + actions, but simpler!
 */
export const filtersStore = {
  subscribe,

  /**
   * Update the search query filter.
   *
   * @param searchQuery - Search text (undefined to clear)
   *
   * Learning Note:
   * We use update() to modify the store based on current state.
   * This is like a Redux reducer but without the boilerplate!
   */
  setSearchQuery: (searchQuery: string | undefined) => {
    update((state) => ({
      ...state,
      searchQuery: searchQuery || undefined,
    }));
  },

  /**
   * Update the assignee filter.
   *
   * @param assigneeId - User ID to filter by (undefined to clear)
   */
  setAssigneeFilter: (assigneeId: EntityId | undefined) => {
    update((state) => ({
      ...state,
      assigneeId,
    }));
  },

  /**
   * Update the priority filter.
   *
   * @param priority - Priority level to filter by (undefined to clear)
   */
  setPriorityFilter: (priority: Priority | undefined) => {
    update((state) => ({
      ...state,
      priority,
    }));
  },

  /**
   * Clear all filters.
   *
   * Resets the store to initial state.
   *
   * Learning Note:
   * We use set() to replace the entire state.
   * This is useful for reset operations.
   */
  clearFilters: () => {
    set(initialState);
  },

  /**
   * Check if any filters are active.
   *
   * @param state - Current filter state
   * @returns true if any filter is set
   *
   * Learning Note:
   * This is a helper method that doesn't modify state.
   * Components can use this to show/hide a "Clear Filters" button.
   */
  hasActiveFilters: (state: FilterState): boolean => {
    return Boolean(state.searchQuery || state.assigneeId || state.priority);
  },
};
