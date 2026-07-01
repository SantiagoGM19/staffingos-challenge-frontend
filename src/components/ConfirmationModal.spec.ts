import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmationModal from './ConfirmationModal.vue';

describe('ConfirmationModal.vue', () => {
  it('does not render when show is false', () => {
    const wrapper = mount(ConfirmationModal, {
      props: { show: false }
    });
    expect(wrapper.find('.fixed').exists()).toBe(false);
  });

  it('renders correctly when show is true', () => {
    const wrapper = mount(ConfirmationModal, {
      props: { 
        show: true,
        title: 'Delete Post',
        message: 'Are you sure?',
        confirmText: 'Yes, delete'
      }
    });
    
    expect(wrapper.find('h3').text()).toBe('Delete Post');
    expect(wrapper.find('p').text()).toBe('Are you sure?');
    const buttons = wrapper.findAll('button');
    expect(buttons[1]!.text()).toBe('Yes, delete');
  });

  it('emits confirm when confirm button is clicked', async () => {
    const wrapper = mount(ConfirmationModal, {
      props: { show: true }
    });
    
    const buttons = wrapper.findAll('button');
    await buttons[1]!.trigger('click');
    
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = mount(ConfirmationModal, {
      props: { show: true }
    });
    
    const buttons = wrapper.findAll('button');
    await buttons[0]!.trigger('click');
    
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('emits cancel when backdrop is clicked', async () => {
    const wrapper = mount(ConfirmationModal, {
      props: { show: true }
    });
    
    const backdrop = wrapper.find('.bg-gray-900\\/50');
    await backdrop.trigger('click');
    
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });
});
