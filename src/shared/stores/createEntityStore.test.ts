/**
 * Tests for createEntityStore factory
 *
 * Learning Note - Testing Factory Functions:
 * createEntityStore is a factory that creates stores.
 * We test by creating a store instance and testing its methods.
 */

import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { createEntityStore } from './createEntityStore';

interface TestEntity {
  id: string;
  name: string;
  value: number;
}

describe('createEntityStore', () => {
  let store: ReturnType<typeof createEntityStore<TestEntity>>;

  const entity1: TestEntity = { id: '1', name: 'First', value: 10 };
  const entity2: TestEntity = { id: '2', name: 'Second', value: 20 };

  beforeEach(() => {
    store = createEntityStore<TestEntity>();
  });

  describe('addOne', () => {
    it('should add entity to store', () => {
      store.addOne(entity1);
      
      const entities = get(store);
      expect(entities).toHaveLength(1);
      expect(entities[0]).toEqual(entity1);
    });

    it('should add multiple entities', () => {
      store.addOne(entity1);
      store.addOne(entity2);
      
      const entities = get(store);
      expect(entities).toHaveLength(2);
    });
  });

  describe('updateOne', () => {
    it('should update existing entity', () => {
      store.addOne(entity1);
      
      store.updateOne('1', { name: 'Updated' });
      
      const entities = get(store);
      expect(entities[0].name).toBe('Updated');
      expect(entities[0].value).toBe(10); // Unchanged
    });

    it('should not throw when updating non-existent entity', () => {
      expect(() => {
        store.updateOne('non-existent', { name: 'New' });
      }).not.toThrow();
    });

    it('should only update specified fields', () => {
      store.addOne(entity1);
      
      store.updateOne('1', { value: 99 });
      
      const entities = get(store);
      expect(entities[0].name).toBe('First');
      expect(entities[0].value).toBe(99);
    });
  });

  describe('removeOne', () => {
    it('should remove entity by id', () => {
      store.addOne(entity1);
      store.addOne(entity2);
      
      store.removeOne('1');
      
      const entities = get(store);
      expect(entities).toHaveLength(1);
      expect(entities[0].id).toBe('2');
    });

    it('should not throw when removing non-existent entity', () => {
      expect(() => {
        store.removeOne('non-existent');
      }).not.toThrow();
    });
  });

  describe('selectById', () => {
    it('should return entity by id', () => {
      store.addOne(entity1);
      store.addOne(entity2);
      
      const entityStore = store.selectById('2');
      const entity = get(entityStore);
      
      expect(entity).toEqual(entity2);
    });

    it('should return undefined for non-existent id', () => {
      const entityStore = store.selectById('non-existent');
      const entity = get(entityStore);
      expect(entity).toBeUndefined();
    });
  });

  describe('setAll', () => {
    it('should replace all entities', () => {
      store.addOne(entity1);
      
      store.setAll([entity2]);
      
      const entities = get(store);
      expect(entities).toHaveLength(1);
      expect(entities[0].id).toBe('2');
    });

    it('should clear store when empty array', () => {
      store.addOne(entity1);
      
      store.setAll([]);
      
      const entities = get(store);
      expect(entities).toHaveLength(0);
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers on changes', () => {
      let callCount = 0;
      let lastValue: TestEntity[] = [];
      
      store.subscribe(value => {
        callCount++;
        lastValue = value;
      });
      
      store.addOne(entity1);
      
      expect(callCount).toBeGreaterThan(1); // Initial + update
      expect(lastValue).toHaveLength(1);
    });
  });
});
