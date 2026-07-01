import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUiStore } from './ui';

describe('UI Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  it('should have initial state', () => {
    const store = useUiStore();
    expect(store.showToast).toBe(false);
    expect(store.toastMessage).toBe('');
    expect(store.toastTitle).toBe('');
    expect(store.toastType).toBe('error');
  });

  it('should show notification and hide after timeout', () => {
    const store = useUiStore();
    
    store.showNotification('Hello', 'Title', 'success', 5000);
    
    expect(store.toastMessage).toBe('Hello');
    expect(store.toastTitle).toBe('Title');
    expect(store.toastType).toBe('success');
    expect(store.showToast).toBe(true);

    vi.advanceTimersByTime(5000);

    expect(store.showToast).toBe(false);
  });

  it('should clear previous timeout when showing new notification', () => {
    const store = useUiStore();
    
    store.showNotification('First', 'Title', 'success', 5000);
    vi.advanceTimersByTime(2500);
    
    // Call again before first finishes
    store.showNotification('Second', 'Title2', 'error', 5000);
    
    expect(store.toastMessage).toBe('Second');
    expect(store.showToast).toBe(true);

    // Fast forward to end of first timeout (2500 more)
    vi.advanceTimersByTime(2500);
    // Should still be open because the second timeout hasn't finished
    expect(store.showToast).toBe(true);

    // Finish second timeout
    vi.advanceTimersByTime(2500);
    expect(store.showToast).toBe(false);
  });

  it('should manually close toast', () => {
    const store = useUiStore();
    
    store.showNotification('Hello', 'Title', 'success', 5000);
    expect(store.showToast).toBe(true);

    store.closeToast();
    expect(store.showToast).toBe(false);
  });
});
