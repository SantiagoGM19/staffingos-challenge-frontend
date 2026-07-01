import { ref } from 'vue';
import { defineStore } from 'pinia';
import { postService } from '@/services/postService';
import { useUiStore } from '@/stores/ui';
import type { Post } from '@/models/post';
import { AppError } from '@/utils/errors';

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const actionLoading = ref(false);
  const error = ref('');
  const uiStore = useUiStore();

  const fetchPosts = async (userId: number) => {
    loading.value = true;
    error.value = '';
    try {
      posts.value = await postService.getPostsByUserId(userId);
    } catch (err) {
      if (err instanceof AppError) {
        error.value = err.message;
      } else {
        error.value = 'Failed to load posts.';
      }
    } finally {
      loading.value = false;
    }
  };

  const createPost = async (postData: Omit<Post, 'id'>) => {
    actionLoading.value = true;
    try {
      const createdPost = await postService.createPost(postData);
      posts.value.unshift(createdPost);
      uiStore.showNotification('Post created successfully!', 'Success', 'success');
      return true;
    } catch (err) {
      if (err instanceof AppError) {
        uiStore.showNotification(err.message, 'Create Failed', 'error');
      } else {
        uiStore.showNotification('Failed to create post', 'Error', 'error');
      }
      return false;
    } finally {
      actionLoading.value = false;
    }
  };

  const updatePost = async (id: number, postData: Omit<Post, 'id'>) => {
    actionLoading.value = true;
    try {
      const updatedPost = await postService.updatePost(id, postData);
      const index = posts.value.findIndex(p => p.id === id);
      if (index !== -1) {
        posts.value[index] = updatedPost;
      }
      uiStore.showNotification('Post updated successfully!', 'Success', 'success');
      return true;
    } catch (err) {
      if (err instanceof AppError) {
        uiStore.showNotification(err.message, 'Update Failed', 'error');
      } else {
        uiStore.showNotification('Failed to update post', 'Error', 'error');
      }
      return false;
    } finally {
      actionLoading.value = false;
    }
  };

  const deletePost = async (id: number) => {
    try {
      await postService.deletePost(id);
      posts.value = posts.value.filter(p => p.id !== id);
      uiStore.showNotification('Post deleted successfully!', 'Success', 'success');
      return true;
    } catch (err) {
      if (err instanceof AppError) {
        uiStore.showNotification(err.message, 'Delete Failed', 'error');
      } else {
        uiStore.showNotification('Failed to delete post', 'Error', 'error');
      }
      return false;
    }
  };

  return { 
    posts, 
    loading, 
    actionLoading, 
    error, 
    fetchPosts, 
    createPost, 
    updatePost, 
    deletePost 
  };
});
