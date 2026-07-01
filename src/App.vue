<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import ToastNotification from '@/components/ToastNotification.vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans flex flex-col">
    <AppHeader />
    <main class="flex-grow relative">
      <RouterView />
    </main>
    <ToastNotification 
      :show="uiStore.showToast" 
      :message="uiStore.toastMessage"
      :title="uiStore.toastTitle"
      :type="uiStore.toastType"
      @close="uiStore.closeToast" 
    />
  </div>
</template>

<style>
/* Global styles can go here */
</style>
