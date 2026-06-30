import { ref } from 'vue';
import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import type { User, Credentials } from '@/models/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  const login = async (credentials: Credentials) => {
    try {
      const responseBody = await authService.login(credentials);
      const { user: userData, token: receivedToken } = responseBody.data;

      if (receivedToken) {
        setToken(receivedToken);
        user.value = userData;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return { token, user, login, logout, setToken };
});
