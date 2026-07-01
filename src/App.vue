<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans flex flex-col">
    <AppHeader />
    <main class="flex-grow relative">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global styles can go here */
</style>
