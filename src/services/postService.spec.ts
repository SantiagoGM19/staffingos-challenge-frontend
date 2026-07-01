import { describe, it, expect, vi } from 'vitest';
import { postService } from './postService';
import api from '@/api/axios';
import { AppError } from '@/utils/errors';

vi.mock('@/api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('postService', () => {
  const mockPost = { id: 1, title: 'Test', body: 'Body', userId: 1 };

  describe('getPostsByUserId', () => {
    it('should call get endpoint and return data array', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { data: [mockPost] } });

      const result = await postService.getPostsByUserId(1);

      expect(api.get).toHaveBeenCalledWith('/posts/1');
      expect(result).toEqual([mockPost]);
    });

    it('should throw parsed error on failure', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'));
      await expect(postService.getPostsByUserId(1)).rejects.toThrow(AppError);
    });
  });

  describe('createPost', () => {
    it('should call post endpoint and return created post', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: { data: mockPost } });

      const payload = { title: 'Test', body: 'Body', userId: 1 };
      const result = await postService.createPost(payload);

      expect(api.post).toHaveBeenCalledWith('/posts', payload);
      expect(result).toEqual(mockPost);
    });

    it('should throw parsed error on failure', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Network error'));
      await expect(postService.createPost({ title: '', body: '', userId: 1 })).rejects.toThrow(AppError);
    });
  });

  describe('updatePost', () => {
    it('should call put endpoint and return updated post', async () => {
      vi.mocked(api.put).mockResolvedValue({ data: { data: mockPost } });

      const payload = { title: 'Test', body: 'Body', userId: 1 };
      const result = await postService.updatePost(1, payload);

      expect(api.put).toHaveBeenCalledWith('/posts/1', payload);
      expect(result).toEqual(mockPost);
    });

    it('should throw parsed error on failure', async () => {
      vi.mocked(api.put).mockRejectedValue(new Error('Network error'));
      await expect(postService.updatePost(1, { title: '', body: '', userId: 1 })).rejects.toThrow(AppError);
    });
  });

  describe('deletePost', () => {
    it('should call delete endpoint', async () => {
      vi.mocked(api.delete).mockResolvedValue({});

      await postService.deletePost(1);

      expect(api.delete).toHaveBeenCalledWith('/posts/1');
    });

    it('should throw parsed error on failure', async () => {
      vi.mocked(api.delete).mockRejectedValue(new Error('Network error'));
      await expect(postService.deletePost(1)).rejects.toThrow(AppError);
    });
  });
});
