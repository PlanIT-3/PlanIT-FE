<template>
  <div class="min-h-screen flex flex-col px-6 py-8 bg-white">
    <div class="mb-6"></div>

    <!-- Title -->
    <h1 class="text-3xl font-bold text-gray-800 mb-12">로그인</h1>

    <!-- Email Input -->
    <div class="mb-4">
      <BaseTextInput v-model="userData.email" placeholder="Enter your email" />
    </div>

    <!-- Password Input -->
    <div class="mb-6">
      <BasePasswordInput v-model="userData.password" placeholder="Enter your password" />
      <div class="text-right mt-2">
        <button class="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Forgot your password?</button>
      </div>
    </div>

    <!-- Login Button -->
    <div class="mt-6">
      <Button :label="isLoading ? 'Logging in...' : 'Login'" @click="login" :disabled="isLoading" class="w-full" />
    </div>

    <!-- Divider -->
    <div class="flex items-center my-10">
      <hr class="flex-1 border-gray-200" />
      <span class="px-4 text-sm text-gray-400">OR</span>
      <hr class="flex-1 border-gray-200" />
    </div>

    <!-- Sign Up Redirect -->
    <div class="text-center">
      <span class="text-gray-600">Don’t have an account?</span>
      <button
        class="ml-2 text-sm text-indigo-600 font-semibold hover:underline"
        @click="router.push({ name: 'signup' })"
      >
        Sign up
      </button>
    </div>
  </div>
</template>
<script setup>
import goBackButton from "@/components/base/GoBackButton.vue";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import BasePasswordInput from "@/components/base/BasePasswordInput.vue";
import Button from "@/components/base/Button.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
const auth = useAuthStore();
const userData = reactive({
  email: "",
  password: "",
});
const router = useRouter();
const isLoading = ref(false);
// Login logic
const login = async () => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    await auth.login(userData);
    //semi_user , user 따라 라우팅
    const authData = JSON.parse(localStorage.getItem("auth"));
    const userRole = authData?.user?.role;

    console.log("User role:", userRole);

    if (userRole === "USER") {
      router.push({ name: "main" });
    } else {
      router.push({ name: "surveyLoading" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>
