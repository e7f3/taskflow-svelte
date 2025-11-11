/**
 * Type definitions for entity store factory.
 *
 * Learning Note:
 * Separating types from implementation provides:
 * - Better organization
 * - Easier to import just types
 * - Clear API documentation
 */

import type { EntityId } from '@/shared/types/common.types';
import type { Readable, Writable } from 'svelte/store';

/**
 * Entity with required id field.
 * All entities must have an id for lookup.
 *
 * Learning Note:
 * We use EntityId from common types for consistency.
 * This ensures all entity IDs are the same type throughout the app.
 */
export interface Entity {
  /**
   * Unique identifier for the entity.
   * Must be unique within the entity collection.
   */
  id: EntityId;
}

/**
 * Entity store interface with CRUD operations and selectors.
 * Similar to Redux Toolkit's EntityAdapter but simpler.
 *
 * Learning Note:
 * This extends Writable to include set and update methods,
 * allowing direct store manipulation when needed.
 *
 * @template T - Entity type (must have id field)
 */
export interface EntityStore<T extends Entity> extends Writable<T[]> {
  /**
   * Get entity by ID (derived store).
   * Automatically updates when entity changes.
   *
   * @param id - Entity ID
   * @returns Readable store with entity or undefined
   *
   * @example
   * ```svelte
   * <script>
   *   let task = $derived($tasksStore.selectById('task-1'));
   * </script>
   *
   * {#if task}
   *   <h1>{task.title}</h1>
   * {/if}
   * ```
   */
  selectById(id: EntityId): Readable<T | undefined>;

  /**
   * Get all entities (same as subscribe).
   * Provided for API consistency with Redux Toolkit.
   *
   * @returns Readable store with all entities
   *
   * @example
   * ```svelte
   * <script>
   *   let allTasks = $derived($tasksStore.selectAll());
   * </script>
   * ```
   */
  selectAll(): Readable<T[]>;

  /**
   * Get entities by IDs.
   * Useful for selecting multiple related entities.
   *
   * @param ids - Array of entity IDs
   * @returns Readable store with matching entities
   *
   * @example
   * ```typescript
   * const selectedTasks = tasksStore.selectByIds(['1', '2', '3']);
   * ```
   */
  selectByIds(ids: EntityId[]): Readable<T[]>;

  /**
   * Add one entity.
   *
   * @param entity - Entity to add
   *
   * @example
   * ```typescript
   * tasksStore.addOne({ id: '1', title: 'New task', status: 'todo' });
   * ```
   */
  addOne(entity: T): void;

  /**
   * Add multiple entities.
   *
   * @param entities - Entities to add
   *
   * @example
   * ```typescript
   * tasksStore.addMany([task1, task2, task3]);
   * ```
   */
  addMany(entities: T[]): void;

  /**
   * Update one entity by ID.
   * Merges changes with existing entity.
   *
   * @param id - Entity ID
   * @param changes - Partial entity data to merge
   *
   * @example
   * ```typescript
   * tasksStore.updateOne('1', { status: 'done' });
   * ```
   */
  updateOne(id: EntityId, changes: Partial<T>): void;

  /**
   * Update multiple entities.
   *
   * @param updates - Array of {id, changes} objects
   *
   * @example
   * ```typescript
   * tasksStore.updateMany([
   *   { id: '1', changes: { status: 'done' } },
   *   { id: '2', changes: { status: 'in-progress' } }
   * ]);
   * ```
   */
  updateMany(updates: Array<{ id: EntityId; changes: Partial<T> }>): void;

  /**
   * Remove one entity by ID.
   *
   * @param id - Entity ID to remove
   *
   * @example
   * ```typescript
   * tasksStore.removeOne('1');
   * ```
   */
  removeOne(id: EntityId): void;

  /**
   * Remove multiple entities by IDs.
   *
   * @param ids - Entity IDs to remove
   *
   * @example
   * ```typescript
   * tasksStore.removeMany(['1', '2', '3']);
   * ```
   */
  removeMany(ids: EntityId[]): void;

  /**
   * Replace all entities.
   * Useful for loading from storage or API.
   *
   * @param entities - New entity array
   *
   * @example
   * ```typescript
   * tasksStore.setAll(loadedTasks);
   * ```
   */
  setAll(entities: T[]): void;

  /**
   * Remove all entities.
   * Resets store to empty state.
   *
   * @example
   * ```typescript
   * tasksStore.removeAll();
   * ```
   */
  removeAll(): void;
}
