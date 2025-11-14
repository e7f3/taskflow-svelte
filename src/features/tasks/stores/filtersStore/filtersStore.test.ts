/**
 * Tests for filtersStore
 */

import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { filtersStore } from './filtersStore';

describe('filtersStore', () => {
  beforeEach(() => {
    // Reset filters before each test
    filtersStore.clearFilters();
  });

  describe('setSearchQuery', () => {
    it('should set search query', () => {
      filtersStore.setSearchQuery('test query');
      
      const filters = get(filtersStore);
      expect(filters.searchQuery).toBe('test query');
    });

    it('should clear search query when empty string', () => {
      filtersStore.setSearchQuery('test');
      filtersStore.setSearchQuery('');
      
      const filters = get(filtersStore);
      expect(filters.searchQuery).toBeUndefined();
    });

    it('should clear search query when undefined', () => {
      filtersStore.setSearchQuery('test');
      filtersStore.setSearchQuery(undefined);
      
      const filters = get(filtersStore);
      expect(filters.searchQuery).toBeUndefined();
    });
  });

  describe('setAssigneeFilter', () => {
    it('should set assignee filter', () => {
      filtersStore.setAssigneeFilter('user-1');
      
      const filters = get(filtersStore);
      expect(filters.assigneeId).toBe('user-1');
    });

    it('should clear assignee filter', () => {
      filtersStore.setAssigneeFilter('user-1');
      filtersStore.setAssigneeFilter(undefined);
      
      const filters = get(filtersStore);
      expect(filters.assigneeId).toBeUndefined();
    });
  });

  describe('setPriorityFilter', () => {
    it('should set priority filter', () => {
      filtersStore.setPriorityFilter('high');
      
      const filters = get(filtersStore);
      expect(filters.priority).toBe('high');
    });

    it('should clear priority filter', () => {
      filtersStore.setPriorityFilter('high');
      filtersStore.setPriorityFilter(undefined);
      
      const filters = get(filtersStore);
      expect(filters.priority).toBeUndefined();
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      filtersStore.setSearchQuery('test');
      filtersStore.setAssigneeFilter('user-1');
      filtersStore.setPriorityFilter('high');
      
      filtersStore.clearFilters();
      
      const filters = get(filtersStore);
      expect(filters.searchQuery).toBeUndefined();
      expect(filters.assigneeId).toBeUndefined();
      expect(filters.priority).toBeUndefined();
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false when no filters active', () => {
      const filters = get(filtersStore);
      expect(filtersStore.hasActiveFilters(filters)).toBe(false);
    });

    it('should return true when search query is set', () => {
      filtersStore.setSearchQuery('test');
      const filters = get(filtersStore);
      expect(filtersStore.hasActiveFilters(filters)).toBe(true);
    });

    it('should return true when assignee filter is set', () => {
      filtersStore.setAssigneeFilter('user-1');
      const filters = get(filtersStore);
      expect(filtersStore.hasActiveFilters(filters)).toBe(true);
    });

    it('should return true when priority filter is set', () => {
      filtersStore.setPriorityFilter('high');
      const filters = get(filtersStore);
      expect(filtersStore.hasActiveFilters(filters)).toBe(true);
    });
  });
});
