import api from '@/api/axios';
import type { Post } from '@/models/post';
import type { ApiResponse } from '@/models/auth';

export const postService = {
  async getPostsByUserId(userId: number): Promise<Post[]> {
    const { data } = await api.get<ApiResponse<Post[]>>(`/posts/${userId}`);
    return data.data;
  },
};
