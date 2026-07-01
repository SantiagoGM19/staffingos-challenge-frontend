import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginView from './LoginView.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

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

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

describe('LoginView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()]
      }
    });

    expect(wrapper.find('h1').text()).toBe('Sign in to your account');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('calls login on submit and redirects on success', async () => {
    const routerMock = { push: vi.fn() };
    vi.mocked(useRouter).mockReturnValue(routerMock as any);

    const pinia = createPinia();
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia]
      }
    });

    const authStore = useAuthStore(pinia);
    vi.spyOn(authStore, 'login').mockResolvedValue(true);

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');

    expect(authStore.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(routerMock.push).toHaveBeenCalledWith({ name: 'home' });
  });

  it('does not redirect on login failure', async () => {
    const routerMock = { push: vi.fn() };
    vi.mocked(useRouter).mockReturnValue(routerMock as any);

    const pinia = createPinia();
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia]
      }
    });

    const authStore = useAuthStore(pinia);
    vi.spyOn(authStore, 'login').mockResolvedValue(false);

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');

    expect(routerMock.push).not.toHaveBeenCalled();
  });
});
