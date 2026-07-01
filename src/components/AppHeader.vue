<template>
  <header class="flex justify-between items-center bg-white p-4 px-6 shadow-sm border-b border-gray-100">
    <div class="flex items-center space-x-3">
      <div class="bg-indigo-100 p-2 rounded-xl text-indigo-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <span class="text-2xl font-black text-gray-900 tracking-tight">StaffingOS<span class="text-indigo-600">Posts</span></span>
    </div>

    <div class="flex items-center space-x-4" v-if="authStore.token">
      <span class="text-sm font-medium text-gray-700">
        {{ authStore.user?.name || authStore.user?.username || 'User' }}
      </span>
      <button 
        @click="handleLogout" 
        class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
        title="Logout"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>
