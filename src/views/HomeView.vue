<template>
  <div class="relative min-h-screen bg-gray-50 overflow-hidden">
    <!-- Welcome Screen -->
    <Transition name="fade-slide">
      <div v-if="showWelcome" class="fixed inset-0 flex items-center justify-center bg-indigo-600 z-50">
        <h1 class="text-5xl md:text-7xl font-extrabold text-white tracking-tight text-center drop-shadow-lg">
          Welcome, {{ authStore.user?.name || 'User' }}!
        </h1>
      </div>
    </Transition>

    <!-- Post List -->
    <Transition name="fade">
      <div v-if="!showWelcome" class="p-8 max-w-7xl mx-auto h-full">
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">My Posts</h2>
          <button 
            @click="isCreating = !isCreating"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isCreating" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>{{ isCreating ? 'Cancel' : 'New Post' }}</span>
          </button>
        </div>

        <div v-if="isCreating" class="bg-white rounded-xl shadow-sm p-6 border border-indigo-100 mb-8">
          <h3 class="text-lg font-bold mb-4 text-gray-900">Create a New Post</h3>
          <form @submit.prevent="handleCreatePost" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="newPost.title" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Post title" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea v-model="newPost.body" required rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="What's on your mind?"></textarea>
            </div>
            <div class="flex justify-end">
              <button type="submit" :disabled="postStore.actionLoading" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                {{ postStore.actionLoading ? 'Saving...' : 'Publish Post' }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="postStore.loading" class="text-center py-12">
          <p class="text-gray-500 text-lg">Loading posts...</p>
        </div>

        <div v-else-if="postStore.error" class="text-center py-12 text-red-500">
          <p class="text-lg">{{ postStore.error }}</p>
        </div>

        <div v-else-if="postStore.posts.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No posts found.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PostCard 
            v-for="post in postStore.posts" 
            :key="post.id" 
            :post="post" 
            :loading="postStore.actionLoading"
            @update="handleUpdatePost"
            @delete="handleDeletePost"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { usePostStore } from '@/stores/post';
import type { Post } from '@/models/post';
import PostCard from '@/components/PostCard.vue';

const authStore = useAuthStore();
const postStore = usePostStore();

const showWelcome = ref(false);

const isCreating = ref(false);
const newPost = ref({ title: '', body: '' });

const userId = computed(() => {
  if (authStore.user) return authStore.user.id;
  
  const token = authStore.token;
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      if (base64Url) {
        const payload = JSON.parse(atob(base64Url));
        return payload.sub;
      }
    } catch (e) {
      console.error('Failed to parse token payload', e);
    }
  }
  return null;
});

const fetchPosts = async () => {
  if (!userId.value) return;
  await postStore.fetchPosts(userId.value);
};

const handleCreatePost = async () => {
  if (!userId.value) return;
  const success = await postStore.createPost({
    title: newPost.value.title,
    body: newPost.value.body,
    userId: userId.value
  });
  if (success) {
    isCreating.value = false;
    newPost.value = { title: '', body: '' };
  }
};

const handleUpdatePost = async (id: number, data: Omit<Post, 'id'>, onSuccess: () => void) => {
  const success = await postStore.updatePost(id, data);
  if (success) {
    onSuccess();
  }
};

const handleDeletePost = async (id: number) => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  await postStore.deletePost(id);
};

onMounted(() => {
  if (sessionStorage.getItem('justLoggedIn') === 'true') {
    showWelcome.value = true;
    sessionStorage.removeItem('justLoggedIn');
    setTimeout(() => {
      showWelcome.value = false;
      setTimeout(() => {
        fetchPosts();
      }, 500);
    }, 2500);
  } else {
    fetchPosts();
  }
});

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(20px);
}
</style>
