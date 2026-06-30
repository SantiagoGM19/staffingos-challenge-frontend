<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Post List</h1>
    <p>Welcome! You are logged in.</p>
    <button 
      @click="handleLogout" 
      class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script>
