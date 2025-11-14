/**
 * Tests for authService
 */

import { get } from 'svelte/store';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { storageService } from '@/shared/services/storageService';
import { authService } from './authService';
import { authStore } from '../stores/authStore';

describe('authService', () => {
  beforeEach(() => {
    authStore.clearAuthentication();
    // Spy on storage methods
    vi.spyOn(storageService, 'getItem').mockReturnValue(null);
    vi.spyOn(storageService, 'setItem').mockImplementation(() => {});
    vi.spyOn(storageService, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const result = await authService.login('alice', 'password123');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.user.username).toBe('alice');
        expect(result.user.name).toBe('Alice Johnson');
      }
    });

    it('should set current user in store', async () => {
      await authService.login('alice', 'password123');
      
      const state = get(authStore);
      expect(state.currentUser?.username).toBe('alice');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should persist to storage', async () => {
      await authService.login('alice', 'password123');
      
      expect(storageService.setItem).toHaveBeenCalled();
    });

    it('should return error for invalid username', async () => {
      const result = await authService.login('invalid', 'password123');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Invalid username');
      }
    });

    it('should return error for invalid password', async () => {
      const result = await authService.login('alice', 'wrongpassword');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Invalid username or password');
      }
    });

    it('should not set user in store on failed login', async () => {
      await authService.login('alice', 'wrongpassword');
      
      const state = get(authStore);
      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear current user', async () => {
      await authService.login('alice', 'password123');
      
      authService.logout();
      
      const state = get(authStore);
      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should remove from storage', () => {
      authService.logout();
      
      expect(storageService.removeItem).toHaveBeenCalled();
    });
  });

  describe('restoreSession', () => {
    it('should restore session from storage', () => {
      const mockSession = {
        user: {
          id: '1',
          username: 'alice',
          name: 'Alice Johnson',
          avatar: '👩‍💼',
        },
        token: 'mock-token',
        createdAt: Date.now(),
      };
      vi.mocked(storageService.getItem).mockReturnValue(mockSession);
      
      const restored = authService.restoreSession();
      
      expect(restored).toBe(true);
      const state = get(authStore);
      expect(state.currentUser).toEqual(mockSession.user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should return false when no stored session', () => {
      vi.mocked(storageService.getItem).mockReturnValue(null);
      
      const restored = authService.restoreSession();
      
      expect(restored).toBe(false);
      const state = get(authStore);
      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('getAllUsers', () => {
    it('should return all available users', () => {
      const users = authService.getAllUsers();
      
      expect(users).toHaveLength(3);
      expect(users[0].username).toBe('alice');
      expect(users[1].username).toBe('bob');
      expect(users[2].username).toBe('charlie');
    });
  });
});
