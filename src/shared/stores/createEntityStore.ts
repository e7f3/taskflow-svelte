/**
 * Entity store factory implementation.
 * Svelte's answer to Redux Toolkit's createEntityAdapter.
 *
 * Learning Note:
 * Redux Toolkit's createEntityAdapter provides:
 * - Normalized state (entities by ID)
 * - CRUD operations (addOne, updateOne, removeOne, etc.)
 * - Selectors (selectAll, selectById, etc.)
 *
 * In Svelte, we can create the same functionality with a simple factory function.
 * No library needed - just plain TypeScript!
 *
 * Benefits over Redux Toolkit:
 * - Simpler (no adapter, no extra concepts)
 * - More flexible (customize as needed)
 * - Type-safe (full TypeScript support)
 * - Smaller bundle (no library overhead)
 */

import { writable, derived } from 'svelte/store';
import type { EntityId } from '@/shared/types/common.types';
import type { Entity, EntityStore } from './createEntityStore.types';

/**
 * Creates an entity store with CRUD operations and selectors.
 *
 * Learning Note:
 * This is like Redux Toolkit's createEntityAdapter but:
 * - Simpler API (no adapter object)
 * - More flexible (easy to customize)
 * - Better TypeScript inference
 * - No normalization overhead (use array, not object)
 *
 * For most apps, array-based storage is fine.
 * If you need O(1) lookup, you can normalize internally.
 *
 * Important: We expose set and update methods (from Writable interface)
 * so the store can be used like any other writable store when needed.
 *
 * @template T - Entity type (must have id field)
 * @param initialEntities - Initial entity array (default: [])
 * @returns Entity store with CRUD operations
 *
 * @example
 * ```typescript
 * interface Task extends Entity {
 *   id: EntityId;
 *   title: string;
 *   status: string;
 * }
 *
 * const tasksStore = createEntityStore<Task>();
 *
 * // Add entities
 * tasksStore.addOne({ id: '1', title: 'Task 1', status: 'todo' });
 * tasksStore.addMany([task2, task3]);
 *
 * // Update entities
 * tasksStore.updateOne('1', { status: 'done' });
 *
 * // Select entities
 * const task1 = tasksStore.selectById('1'); // Readable<Task | undefined>
 * const allTasks = tasksStore.selectAll(); // Readable<Task[]>
 *
 * // Direct store manipulation (when needed)
 * tasksStore.set([...newTasks]);
 * tasksStore.update(tasks => tasks.filter(t => t.status !== 'done'));
 *
 * // Use in components
 * let task = $derived($tasksStore.selectById('1'));
 * ```
 */
export function createEntityStore<T extends Entity>(
  initialEntities: T[] = [],
): EntityStore<T> {
  const { subscribe, set, update } = writable<T[]>(initialEntities);

  return {
    /*
     * Expose subscribe, set, and update from Writable.
     * This makes EntityStore compatible with Writable interface.
     *
     * Learning Note:
     * By exposing these, users can:
     * - Use the store with $ prefix
     * - Call set() for bulk updates
     * - Call update() for custom transformations
     * - Pass store to functions expecting Writable<T[]>
     */
    subscribe,
    set,
    update,

    selectById(id: EntityId) {
      return derived({ subscribe }, ($entities) =>
        $entities.find((entity) => entity.id === id),
      );
    },

    selectAll() {
      return { subscribe };
    },

    selectByIds(ids: EntityId[]) {
      return derived({ subscribe }, ($entities) =>
        $entities.filter((entity) => ids.includes(entity.id)),
      );
    },

    addOne(entity: T) {
      update((entities) => [...entities, entity]);
    },

    addMany(entities: T[]) {
      update((current) => [...current, ...entities]);
    },

    updateOne(id: EntityId, changes: Partial<T>) {
      update((entities) =>
        entities.map((entity) =>
          entity.id === id ? { ...entity, ...changes } : entity,
        ),
      );
    },

    updateMany(updates: Array<{ id: EntityId; changes: Partial<T> }>) {
      update((entities) => {
        const updatesMap = new Map(updates.map((u) => [u.id, u.changes]));
        return entities.map((entity) => {
          const changes = updatesMap.get(entity.id);
          return changes ? { ...entity, ...changes } : entity;
        });
      });
    },

    removeOne(id: EntityId) {
      update((entities) => entities.filter((entity) => entity.id !== id));
    },

    removeMany(ids: EntityId[]) {
      const idsSet = new Set(ids);
      update((entities) => entities.filter((entity) => !idsSet.has(entity.id)));
    },

    setAll(entities: T[]) {
      set(entities);
    },

    removeAll() {
      set([]);
    },
  };
}

/*
 * Re-export types for convenience.
 */
export type { Entity, EntityStore } from './createEntityStore.types';

/*
 * Learning Note - When to use this:
 *
 * Use createEntityStore when:
 * - You have a collection of entities with IDs
 * - You need CRUD operations
 * - You want consistent API across stores
 * - You want derived selectors
 *
 * Use simple writable store when:
 * - Simple state (not a collection)
 * - Custom logic needed
 * - Performance-critical (avoid abstraction)
 *
 * This factory is optional - our current tasksStore works fine!
 * But it's nice to have for consistency across multiple entity types.
 */
