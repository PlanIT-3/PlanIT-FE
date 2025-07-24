<template>
  <div
    class="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#2a1246] via-[#2a1246] to-[#3a2370] relative"
  >
    <!-- 상단 헤더 -->
    <div class="w-full flex items-start pt-8 pl-5 gap-3">
      <button class="bg-transparent border-none text-white text-2xl mt-0.5 cursor-pointer" @click="goBack">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
            />
          </svg>
        </span>
      </button>
      <div class="flex flex-col items-start">
        <div class="text-3xl font-bold text-white leading-none">리워드</div>
        <div class="text-lg text-gray-200 mt-0.5">스마트한 자산 관리</div>
      </div>
    </div>

    <!-- 별자리 타이틀 및 개수 -->
    <div class="mt-8 flex flex-col items-center">
      <div class="flex items-center text-2xl font-bold text-white gap-2">
        <span>나의 별자리</span>
      </div>
      <div class="mt-2 text-xl text-gray-400">8/12 개</div>
    </div>

    <!-- 별자리 원형 차트 (임시 star.png, 크게) -->
    <div class="mt-10 flex justify-center w-full">
      <img src="/src/assets/images/star.png" alt="star" class="w-[360px] h-[360px] max-w-[90vw] object-contain" />
    </div>

    <!-- 보상 수령 버튼 -->
    <div class="mt-12 w-full flex justify-center">
      <button
        class="bg-gradient-to-r from-[#3a5fff] to-[#3a8fff] text-white text-xl font-semibold rounded-xl px-12 py-4 shadow-lg active:from-[#2a4fcc] active:to-[#3a8fff] transition-all"
      >
        보상 수령
      </button>
    </div>

    <!-- 하단 네비게이션 바 -->
    <NavBar class="fixed left-0 bottom-0 w-full z-10" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import NavBar from "@/components/common/NavBar.vue";

const router = useRouter();
const goBack = () => {
  router.back();
};
</script>
