import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePostStore } from './post';
import { useUiStore } from './ui';
import { postService } from '@/services/postService';
import { AppError } from '@/utils/errors';
import type { Post } from '@/models/post';

vi.mock('@/services/postService', () => ({
  postService: {
    getPostsByUserId: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn()
  }
}));

describe('Post Store', () => {
  let uiStore: ReturnType<typeof useUiStore>;
  
  beforeEach(() => {
    setActivePinia(createPinia());
    uiStore = useUiStore();
    vi.spyOn(uiStore, 'showNotification').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  const mockPost: Post = { id: 1, title: 'Title', body: 'Body', userId: 1 };

  describe('fetchPosts', () => {
    it('should successfully fetch posts', async () => {
      const store = usePostStore();
      vi.mocked(postService.getPostsByUserId).mockResolvedValue([mockPost]);

      expect(store.loading).toBe(false);
      await store.fetchPosts(1);
      
      expect(store.posts).toEqual([mockPost]);
      expect(store.loading).toBe(false);
      expect(store.error).toBe('');
    });

    it('should handle fetch errors', async () => {
      const store = usePostStore();
      vi.mocked(postService.getPostsByUserId).mockRejectedValue(new AppError('Fetch error'));

      await store.fetchPosts(1);
      
      expect(store.posts).toEqual([]);
      expect(store.error).toBe('Fetch error');
    });
  });

  describe('createPost', () => {
    it('should successfully create post', async () => {
      const store = usePostStore();
      vi.mocked(postService.createPost).mockResolvedValue(mockPost);

      const result = await store.createPost({ title: 'Title', body: 'Body', userId: 1 });
      
      expect(result).toBe(true);
      expect(store.posts[0]).toEqual(mockPost);
      expect(uiStore.showNotification).toHaveBeenCalledWith('Post created successfully!', 'Success', 'success');
    });

    it('should handle create error', async () => {
      const store = usePostStore();
      vi.mocked(postService.createPost).mockRejectedValue(new AppError('Create error'));

      const result = await store.createPost({ title: 'Title', body: 'Body', userId: 1 });
      
      expect(result).toBe(false);
      expect(uiStore.showNotification).toHaveBeenCalledWith('Create error', 'Create Failed', 'error');
    });
  });

  describe('updatePost', () => {
    it('should successfully update post', async () => {
      const store = usePostStore();
      store.posts = [mockPost];
      const updatedPost = { ...mockPost, title: 'Updated' };
      vi.mocked(postService.updatePost).mockResolvedValue(updatedPost);

      const result = await store.updatePost(1, { title: 'Updated', body: 'Body', userId: 1 });
      
      expect(result).toBe(true);
      expect(store.posts[0]?.title).toBe('Updated');
      expect(uiStore.showNotification).toHaveBeenCalledWith('Post updated successfully!', 'Success', 'success');
    });

    it('should handle update error', async () => {
      const store = usePostStore();
      vi.mocked(postService.updatePost).mockRejectedValue(new AppError('Update error'));

      const result = await store.updatePost(1, { title: 'Updated', body: 'Body', userId: 1 });
      
      expect(result).toBe(false);
      expect(uiStore.showNotification).toHaveBeenCalledWith('Update error', 'Update Failed', 'error');
    });
  });

  describe('deletePost', () => {
    it('should successfully delete post', async () => {
      const store = usePostStore();
      store.posts = [mockPost];
      vi.mocked(postService.deletePost).mockResolvedValue(undefined);

      const result = await store.deletePost(1);
      
      expect(result).toBe(true);
      expect(store.posts.length).toBe(0);
      expect(uiStore.showNotification).toHaveBeenCalledWith('Post deleted successfully!', 'Success', 'success');
    });

    it('should handle delete error', async () => {
      const store = usePostStore();
      vi.mocked(postService.deletePost).mockRejectedValue(new AppError('Delete error'));

      const result = await store.deletePost(1);
      
      expect(result).toBe(false);
      expect(uiStore.showNotification).toHaveBeenCalledWith('Delete error', 'Delete Failed', 'error');
    });
  });
});
