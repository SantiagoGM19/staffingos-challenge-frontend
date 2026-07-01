import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createPinia } from 'pinia'

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

describe('App', () => {
  it('mounts renders properly', () => {
    const pinia = createPinia()
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: ['RouterView', 'ToastNotification']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
