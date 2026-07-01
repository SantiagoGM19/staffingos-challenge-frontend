import api from '@/api/axios';
import type { Credentials, ApiResponse, AuthData } from '@/models/auth';

export const authService = {
  async login(credentials: Credentials): Promise<ApiResponse<AuthData>> {
    const { data } = await api.post<ApiResponse<AuthData>>('/auth/login', credentials);
    return data;
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
};
