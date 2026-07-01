import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';
import { authService } from '@/services/authService';
import type { User, AuthData, ApiResponse } from '@/models/auth';

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn()
  }
}));

const mockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString() },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  };
};

Object.defineProperty(window, 'localStorage', { value: mockStorage() });
Object.defineProperty(window, 'sessionStorage', { value: mockStorage() });

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with no user and token from localStorage if present', () => {
    localStorage.setItem('token', 'saved-token');
    const store = useAuthStore();
    expect(store.token).toBe('saved-token');
    expect(store.user).toBeNull();
  });

  it('should setToken properly', () => {
    const store = useAuthStore();
    store.setToken('new-token');
    expect(store.token).toBe('new-token');
    expect(localStorage.getItem('token')).toBe('new-token');
  });

  it('should handle successful login', async () => {
    const store = useAuthStore();
    const mockUser: User = { id: 1, name: 'Test', username: 'testuser', email: 'test@example.com' };
    const mockResponse: ApiResponse<AuthData> = {
      status: 'success',
      message: 'Logged in',
      data: {
        user: mockUser,
        token: 'test-token'
      }
    };
    
    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    const success = await store.login({ email: 'test@example.com', password: 'password' });

    expect(success).toBe(true);
    expect(store.token).toBe('test-token');
    expect(store.user).toEqual(mockUser);
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });

  it('should handle failed login without token', async () => {
    const store = useAuthStore();
    const mockResponse: ApiResponse<AuthData> = {
      status: 'error',
      message: 'Failed',
      data: {
        user: {} as User,
        token: ''
      }
    };
    
    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    const success = await store.login({ email: 'test@example.com', password: 'wrong' });

    expect(success).toBe(false);
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
  });

  it('should throw error when login throws', async () => {
    const store = useAuthStore();
    const error = new Error('Network error');
    vi.mocked(authService.login).mockRejectedValue(error);

    await expect(store.login({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Network error');
  });

  it('should handle successful logout', async () => {
    localStorage.setItem('token', 'existing-token');
    const store = useAuthStore();
    store.user = { id: 1, name: 'Test', username: 'testuser', email: 'test@example.com' };
    store.token = 'existing-token';

    vi.mocked(authService.logout).mockResolvedValue(undefined);

    await store.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should clear state even if logout throws an error', async () => {
    localStorage.setItem('token', 'existing-token');
    const store = useAuthStore();
    store.user = { id: 1, name: 'Test', username: 'testuser', email: 'test@example.com' };
    store.token = 'existing-token';

    vi.mocked(authService.logout).mockRejectedValue(new Error('Logout API failed'));

    await store.logout();

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
