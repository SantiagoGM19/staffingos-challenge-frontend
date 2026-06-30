<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <section class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
      <header>
        <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h1>
      </header>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true" />
        <fieldset class="space-y-4">
          <div>
            <label for="email-address" class="text-sm font-medium text-gray-700 block mb-1">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              :class="[
                'appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 sm:text-sm focus:outline-none focus:ring-indigo-500 focus:z-10',
                fieldErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
              ]"
              placeholder="Enter your email"
            />
            <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-500">{{ fieldErrors.email }}</p>
          </div>
          <div>
            <label for="password" class="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              :class="[
                'appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 sm:text-sm focus:outline-none focus:ring-indigo-500 focus:z-10',
                fieldErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
              ]"
              placeholder="Enter your password"
            />
            <p v-if="fieldErrors.password" class="mt-1 text-xs text-red-500">{{ fieldErrors.password }}</p>
          </div>
        </fieldset>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="
              group relative w-full flex justify-center py-2 px-4 
              border border-transparent rounded-md
              text-sm font-medium text-white 
              bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              transition duration-150 ease-in-out
            "
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </section>

    <!-- Error Toast Notification -->
    <ToastNotification 
      :show="showErrorMessage" 
      :message="errorMessage"
      title="Login Failed"
      @close="showErrorMessage = false" 
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ToastNotification from '@/components/ToastNotification.vue';
import { isAxiosError } from 'axios';
import type { ValidationError } from '@/models/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const showErrorMessage = ref(false);
const isLoading = ref(false);
const fieldErrors = ref<Record<string, string>>({});

const router = useRouter();
const authStore = useAuthStore();

const handleError = (error: unknown) => {
  if (!isAxiosError(error)) {
    if (error instanceof Error) {
      showToastError(error.message);
      return;
    }
    showToastError('An unexpected error occurred.');
    return;
  }

  if (error.response?.status === 422 && error.response.data?.errors) {
    const errors: ValidationError[] = error.response.data.errors;
    errors.forEach((err) => {
      fieldErrors.value[err.field] = err.message;
    });
    return;
  }

  showToastError(error.response?.data?.message || 'An error occurred during login.');
};

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  fieldErrors.value = {};
  
  try {
    const success = await authStore.login({ email: email.value, password: password.value });
    if (success) {
      router.push({ name: 'home' });
    } else {
      showToastError('Login failed. Please check your credentials.');
    }
  } catch (error: unknown) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

const showToastError = (msg: string) => {
  errorMessage.value = msg;
  showErrorMessage.value = true;
  setTimeout(() => {
    errorMessage.value = '';
    showErrorMessage.value = false;
  }, 5000);
};
</script>
