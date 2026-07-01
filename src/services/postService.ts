import api from '@/api/axios';
import type { Post } from '@/models/post';
import type { ApiResponse } from '@/models/auth';
import { parseApiError } from '@/utils/errors';

export const postService = {
  async getPostsByUserId(userId: number): Promise<Post[]> {
    try {
      const { data } = await api.get<ApiResponse<Post[]>>(`/posts/${userId}`);
      return data.data;
    } catch (error) {
      throw parseApiError(error, 'Failed to fetch posts');
    }
  },
  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    try {
      const { data } = await api.post<ApiResponse<Post>>('/posts', post);
      return data.data;
    } catch (error) {
      throw parseApiError(error, 'Failed to create post');
    }
  },
  async updatePost(id: number, post: Omit<Post, 'id'>): Promise<Post> {
    try {
      const { data } = await api.put<ApiResponse<Post>>(`/posts/${id}`, post);
      return data.data;
    } catch (error) {
      throw parseApiError(error, 'Failed to update post');
    }
  },
  async deletePost(id: number): Promise<void> {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      throw parseApiError(error, 'Failed to delete post');
    }
  }
};
