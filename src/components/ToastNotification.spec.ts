import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ToastNotification from './ToastNotification.vue';

describe('ToastNotification.vue', () => {
  it('does not render when show is false', () => {
    const wrapper = mount(ToastNotification, {
      props: { show: false, message: 'Test message' }
    });
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it('renders correctly with error type by default', () => {
    const wrapper = mount(ToastNotification, {
      props: { show: true, message: 'Error message', title: 'Error Title' }
    });
    
    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.classes()).toContain('bg-red-50');
    expect(wrapper.text()).toContain('Error Title');
    expect(wrapper.text()).toContain('Error message');
  });

  it('renders correctly with success type', () => {
    const wrapper = mount(ToastNotification, {
      props: { show: true, message: 'Success message', title: 'Success Title', type: 'success' }
    });
    
    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.classes()).toContain('bg-green-50');
    expect(wrapper.text()).toContain('Success Title');
    expect(wrapper.text()).toContain('Success message');
  });

  it('emits close when close button is clicked', async () => {
    const wrapper = mount(ToastNotification, {
      props: { show: true, message: 'Test message' }
    });
    
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
