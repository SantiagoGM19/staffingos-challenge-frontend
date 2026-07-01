import api from '@/api/axios';
import type { Credentials, ApiResponse, AuthData } from '@/models/auth';
import { parseApiError } from '@/utils/errors';

export const authService = {
  async login(credentials: Credentials): Promise<ApiResponse<AuthData>> {
    try {
      const { data } = await api.post<ApiResponse<AuthData>>('/auth/login', credentials);
      return data;
    } catch (error) {
      throw parseApiError(error, 'Login failed');
    }
  },
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      throw parseApiError(error, 'Logout failed');
    }
  }
};
