/**
 * Tests for authStore
 */

import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { authStore } from './authStore';
import type { User } from '../types/auth.types';

describe('authStore', () => {
  const mockUser: User = {
    id: '1',
    username: 'alice',
    name: 'Alice Johnson',
    avatar: '👩‍💼',
  };

  beforeEach(() => {
    authStore.clearAuthentication();
  });

  describe('setAuthenticated', () => {
    it('should set authenticated state', () => {
      authStore.setAuthenticated(mockUser, 'test-token');
      
      const state = get(authStore);
      expect(state.currentUser).toEqual(mockUser);
      expect(state.sessionToken).toBe('test-token');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('clearAuthentication', () => {
    it('should clear authentication state', () => {
      authStore.setAuthenticated(mockUser, 'test-token');
      authStore.clearAuthentication();
      
      const state = get(authStore);
      expect(state.currentUser).toBeNull();
      expect(state.sessionToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user while keeping authentication', () => {
      authStore.setAuthenticated(mockUser, 'test-token');
      
      const updatedUser = { ...mockUser, name: 'Alice Updated' };
      authStore.updateUser(updatedUser);
      
      const state = get(authStore);
      expect(state.currentUser?.name).toBe('Alice Updated');
      expect(state.isAuthenticated).toBe(true);
      expect(state.sessionToken).toBe('test-token');
    });
  });

  describe('isAuthenticated', () => {
    it('should be false initially', () => {
      const state = get(authStore);
      expect(state.isAuthenticated).toBe(false);
    });

    it('should be true when authenticated', () => {
      authStore.setAuthenticated(mockUser, 'test-token');
      
      const state = get(authStore);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should be false after clearing', () => {
      authStore.setAuthenticated(mockUser, 'test-token');
      authStore.clearAuthentication();
      
      const state = get(authStore);
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
