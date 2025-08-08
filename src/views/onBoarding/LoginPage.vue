<template>
  <div class="min-h-screen bg-white px-6 py-4 flex flex-col">
    <div class="h-10">
      <goBackButton />
    </div>

    <h1 class="text-3xl font-semibold mt-6 mb-20">로그인 페이지</h1>

    <div class="mb-4">
      <BaseTextInput v-model="email" placeholder="Enter your email" />
    </div>

    <div class="mb-1 relative">
      <BasePasswordInput v-model="password" placeholder="Enter your password" />
      <div class="text-right mt-2">
        <button class="text-sm text-gray-400 hover:underline">Forgot Password?</button>
      </div>
    </div>

    <div class="mt-12"><Button :label="isLoading ? 'Loading...' : 'Login'" @click="login" :disabled="isLoading"></Button></div>

    <div class="flex items-center my-6">
      <hr class="flex-1 border-gray-200" />
      <span class="px-4 text-sm text-gray-400">Or Login with</span>
      <hr class="flex-1 border-gray-200" />
    </div>

    <div class="flex justify-center gap-3">
      <button class="flex items-center gap-2 px-4 h-12 bg-[#FEE500] text-black rounded-md text-sm font-semibold">
        <img src="@/assets/icons/Kakao.svg" alt="Kakao" class="w-4 h-4" />
        로그인
      </button>

      <button class="flex items-center gap-2 px-4 h-12 bg-[#03C75A] text-white rounded-md text-sm font-semibold">
        <img src="@/assets/icons/Naver.svg" alt="Kakao" class="w-4 h-4" />
        로그인
      </button>
    </div>

    <div class="mt-45 text-center">
      <button class="text-sm text-[#433D8B] font-semibold hover:underline">회원가입</button>
    </div>
  </div>
</template>

<script setup>
import goBackButton from "@/components/base/GoBackButton.vue";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import BasePasswordInput from "@/components/base/BasePasswordInput.vue";
import Button from "@/components/base/Button.vue";

import { authApi } from "@/services/api.js";
import { useUserStore } from "@/stores/user.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const loginForm = ref();
const loginStore = useUserStore();
const router = useRouter();
const isLoading = ref(false);

// 로그인 로직
const login = async () => {
  if (isLoading.value) return; // 중복 클릭 방지
  
  try {
    isLoading.value = true;
    const response = await authApi.login(email.value, password.value);

    if (response.data.accessToken) {
      await loginStore.setToken(response.data.accessToken, response.data.refreshToken);

      router.push({ name: "home" });
    } else {
      alert("로그인 실패: 토큰을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    alert("로그인 중 오류가 발생했습니다.");
  } finally {
    isLoading.value = false;
  }
};
</script>
