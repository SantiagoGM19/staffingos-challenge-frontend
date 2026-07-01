<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
    
    <!-- Edit Mode -->
    <div v-if="isEditing">
      <form @submit.prevent="handleSave" class="space-y-3">
        <input 
          v-model="editForm.title" 
          required 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Title" 
        />
        <textarea 
          v-model="editForm.body" 
          required 
          rows="4" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="Body"
        ></textarea>
        <div class="flex justify-end space-x-2 mt-2">
          <button 
            type="button" 
            @click="handleCancel" 
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="loading" 
            class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </div>
    
    <!-- View Mode -->
    <div v-else>
      <div class="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          @click="startEditing" 
          class="text-gray-400 hover:text-indigo-600 transition" 
          title="Edit"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </button>
        <button 
          @click="$emit('delete', post.id)" 
          class="text-gray-400 hover:text-red-600 transition" 
          title="Delete"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
      <h2 class="text-xl font-bold mb-3 text-gray-800 pr-12">{{ post.title || 'Untitled Post' }}</h2>
      <p class="text-gray-600 line-clamp-3 leading-relaxed">{{ post.body }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Post } from '@/models/post';

const props = defineProps<{
  post: Post;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update', id: number, data: Omit<Post, 'id'>, onSuccess: () => void): void;
  (e: 'delete', id: number): void;
}>();

const isEditing = ref(false);
const editForm = ref({ title: '', body: '' });

const startEditing = () => {
  editForm.value = { title: props.post.title, body: props.post.body };
  isEditing.value = true;
};

const handleCancel = () => {
  isEditing.value = false;
};

const handleSave = () => {
  emit('update', props.post.id, {
    title: editForm.value.title,
    body: editForm.value.body,
    userId: props.post.userId
  }, () => {
    // This callback is executed by the parent when the update succeeds
    isEditing.value = false;
  });
};
</script>
