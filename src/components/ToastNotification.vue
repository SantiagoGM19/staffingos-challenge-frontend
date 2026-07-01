<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" :class="[
      'fixed top-5 right-5 z-50 max-w-sm w-full border-l-4 p-4 rounded shadow-lg flex items-start',
      type === 'error' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
    ]" role="alert">
      <div class="flex-shrink-0">
        <!-- Error Icon -->
        <svg v-if="type === 'error'" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <!-- Success Icon -->
        <svg v-else class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="ml-3">
        <p :class="['text-sm font-medium', type === 'error' ? 'text-red-700' : 'text-green-700']">{{ title }}</p>
        <p :class="['text-sm mt-1', type === 'error' ? 'text-red-600' : 'text-green-600']">{{ message }}</p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button @click="$emit('close')" :class="[
            'inline-flex rounded-md p-1.5 focus:outline-none',
            type === 'error' ? 'text-red-500 hover:bg-red-100' : 'text-green-500 hover:bg-green-100'
          ]">
            <span class="sr-only">Dismiss</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  show: boolean;
  message: string;
  title?: string;
  type?: 'error' | 'success';
}>(), {
  title: 'Notification',
  type: 'error'
});

defineEmits(['close']);
</script>
