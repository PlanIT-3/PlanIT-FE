<template>
  <header
    class="w-full h-[180px] relative rounded-b-3xl overflow-hidden flex flex-col justify-between z-10"
    style="background: none"
  >
    <img
      src="@/assets/images/headerBackground.svg"
      alt="PlanIT Header"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />
    <div class="relative z-10 flex flex-col h-full justify-between">
      <div class="flex items-start justify-between px-6 pt-5">
        <div class="flex flex-col items-start">
          <div class="flex items-center">
            <img src="@/assets/images/logo.svg" alt="PlanIT Logo" class="w-16 h-auto mr-2" />
          </div>
          <span class="text-white text-sm mt-1 ml-1 drop-shadow">스마트한 자산 관리</span>
        </div>
        <div class="flex items-center space-x-4 mt-2">
          <!-- 돋보기 아이콘 -->
          <button aria-label="검색" class="text-white hover:text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
          <!-- 알림 아이콘 -->
          <button aria-label="알림" class="text-white hover:text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </button>
          <!-- 유저 아이콘 -->
          <button aria-label="마이페이지" class="text-white hover:text-gray-200" @click="navigateTo('/mypage')">
            <svg
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped></style>
