import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeView from './HomeView.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { usePostStore } from '@/stores/post';

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

describe('HomeView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('renders welcome screen if justLoggedIn is true', async () => {
    sessionStorage.setItem('justLoggedIn', 'true');
    const pinia = createPinia();
    
    const authStore = useAuthStore(pinia);
    authStore.user = { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johndoe' };

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia],
        stubs: ['PostCard', 'ConfirmationModal']
      }
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Welcome, John Doe!');
  });

  it('fetches posts on mount if not justLoggedIn', async () => {
    const pinia = createPinia();
    
    const authStore = useAuthStore(pinia);
    authStore.user = { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johndoe' };
    
    const postStore = usePostStore(pinia);
    vi.spyOn(postStore, 'fetchPosts').mockResolvedValue();

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia],
        stubs: ['PostCard', 'ConfirmationModal']
      }
    });

    expect(postStore.fetchPosts).toHaveBeenCalledWith(1);
    expect(wrapper.text()).toContain('My Posts');
  });

  it('shows create post form when New Post is clicked', async () => {
    const pinia = createPinia();
    
    const authStore = useAuthStore(pinia);
    authStore.user = { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johndoe' };
    
    const postStore = usePostStore(pinia);
    vi.spyOn(postStore, 'fetchPosts').mockResolvedValue();

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia],
        stubs: ['PostCard', 'ConfirmationModal']
      }
    });

    await wrapper.find('button').trigger('click'); // Click "New Post"
    expect(wrapper.text()).toContain('Create a New Post');
  });
});
