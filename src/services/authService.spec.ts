import { describe, it, expect, vi } from 'vitest';
import { authService } from './authService';
import api from '@/api/axios';
import { AppError } from '@/utils/errors';

vi.mock('@/api/axios', () => ({
  default: {
    post: vi.fn(),
  }
}));

describe('authService', () => {
  it('should call login endpoint and return data', async () => {
    const mockResponse = { data: { status: 'success', data: { token: '123', user: {} } } };
    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const result = await authService.login({ email: 'test@test.com', password: '123' });

    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: '123' });
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw parsed error on login failure', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'));
    
    await expect(authService.login({ email: 'a', password: 'b' })).rejects.toThrow(AppError);
  });

  it('should call logout endpoint', async () => {
    vi.mocked(api.post).mockResolvedValue({});

    await authService.logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('should throw parsed error on logout failure', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'));
    
    await expect(authService.logout()).rejects.toThrow(AppError);
  });
});
