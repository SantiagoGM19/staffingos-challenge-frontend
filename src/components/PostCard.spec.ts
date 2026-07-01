import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PostCard from './PostCard.vue';
import type { Post } from '@/models/post';

describe('PostCard.vue', () => {
  const mockPost: Post = {
    id: 1,
    userId: 1,
    title: 'Test Post',
    body: 'This is a test post body.'
  };

  it('renders post title and body correctly in view mode', () => {
    const wrapper = mount(PostCard, {
      props: { post: mockPost }
    });

    expect(wrapper.find('h2').text()).toBe(mockPost.title);
    expect(wrapper.find('p').text()).toBe(mockPost.body);
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(PostCard, {
      props: { post: mockPost }
    });

    const buttons = wrapper.findAll('button');
    const deleteBtn = buttons.find(b => b.attributes('title') === 'Delete');
    expect(deleteBtn).toBeDefined();
    
    await deleteBtn!.trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')![0]).toEqual([mockPost.id]);
  });

  it('enters edit mode when edit button is clicked', async () => {
    const wrapper = mount(PostCard, {
      props: { post: mockPost }
    });

    const buttons = wrapper.findAll('button');
    const editBtn = buttons.find(b => b.attributes('title') === 'Edit');
    
    await editBtn!.trigger('click');

    expect(wrapper.find('form').exists()).toBe(true);
    const inputs = wrapper.findAll('input, textarea');
    expect((inputs[0]!.element as HTMLInputElement).value).toBe(mockPost.title);
    expect((inputs[1]!.element as HTMLTextAreaElement).value).toBe(mockPost.body);
  });

  it('emits update event on save', async () => {
    const wrapper = mount(PostCard, {
      props: { post: mockPost }
    });

    // Enter edit mode
    await wrapper.findAll('button').find(b => b.attributes('title') === 'Edit')!.trigger('click');

    // Update values
    const titleInput = wrapper.find('input');
    const bodyInput = wrapper.find('textarea');
    
    await titleInput.setValue('New Title');
    await bodyInput.setValue('New Body');

    // Submit
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted('update')).toBeTruthy();
    const emittedData = wrapper.emitted('update')![0] as any[];
    expect(emittedData[0]).toBe(mockPost.id);
    expect(emittedData[1]).toEqual({ title: 'New Title', body: 'New Body', userId: mockPost.userId });
    expect(typeof emittedData[2]).toBe('function');
  });
});
