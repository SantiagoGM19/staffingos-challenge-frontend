import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
  const showToast = ref(false);
  const toastMessage = ref('');
  const toastTitle = ref('');
  const toastType = ref<'success' | 'error'>('error');
  
  let timeoutId: number | null = null;

  const showNotification = (message: string, title = 'Notification', type: 'error' | 'success' = 'error', duration = 5000) => {
    toastMessage.value = message;
    toastTitle.value = title;
    toastType.value = type;
    showToast.value = true;
    
    if (timeoutId) clearTimeout(timeoutId);
    
    timeoutId = window.setTimeout(() => {
      closeToast();
    }, duration);
  };
  
  const closeToast = () => {
    showToast.value = false;
  };

  return { showToast, toastMessage, toastTitle, toastType, showNotification, closeToast };
});
