<script setup>
import { ref } from "vue";
import Button from "@/components/common/Button.vue";
import KbLogo from "@/assets/icons/bank/KB.svg?url";
import GoBackButton from "@/components/common/goBackButton.vue";

const email = ref("");
const password = ref("");
const showPassword = ref(false);

function login() {
  // 실제 로그인 로직은 추후 구현
  alert("로그인 시도: " + email.value);
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white px-6 pt-6 pb-0 items-center relative">
    <!-- 상단 뒤로가기 -->
    <GoBackButton />

    <div class="h-10"></div>
    <h2 class="text-2xl font-semibold text-center mb-3 mt-6">은행 로그인</h2>
    <span class="text-sm text-center mb-6">실제 은행 이메일과 비밀번호를 입력하세요.</span>
    <img :src="KbLogo" alt="KB 로고" class="w-24 h-24 mx-auto mb-8" />
    <div class="w-full max-w-md flex flex-col gap-4 mb-8">
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
      />
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Enter your password"
          class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-[#433D8B] pr-12"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          @click="showPassword = !showPassword"
        >
          <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
    </div>
    <Button label="Login" @click="login" class="w-full max-w-md mb-10" />
    <!-- 하단 프로그레스 -->
    <div class="flex items-center justify-center w-full max-w-md mt-auto py-16">
      <div class="flex-1 flex items-center">
        <div class="w-6 h-6 rounded-full bg-[#433D8B] flex items-center justify-center text-white">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 8 7 11 12 5" />
          </svg>
        </div>
        <div class="h-0.5 bg-[#433D8B] flex-1"></div>
        <div class="w-6 h-6 rounded-full bg-[#433D8B] flex items-center justify-center text-white">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 8 7 11 12 5" />
          </svg>
        </div>
        <div class="h-0.5 bg-gray-300 flex-1"></div>
        <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="8" cy="8" r="6" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  color: #e8ecf4;
  opacity: 1;
}
</style>
