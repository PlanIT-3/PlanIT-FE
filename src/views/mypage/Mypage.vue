<template>
  <div>
    <CardContainer class="gap-4 overflow-y-auto">
      <!-- 마이페이지 헤더 -->
      <div class="flex justify-between items-center w-full px-0 mb-4">
        <h1 class="text-xl font-bold m-0">마이페이지</h1>
        <span
          class="flex items-center text-indigo-600 cursor-pointer text-sm"
          @click="navigateTo('/investment-survey')"
        >
          투자 성향 검사 다시 하기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>

      <div class="flex flex-col items-center justify-center">
        <div class="w-24 h-24 rounded-full bg-gray-200"></div>
      </div>

      <div class="flex flex-col gap-2 w-full">
        <div>이름</div>
        <!-- 이름 받아오기 -->
        <BaseTextInput placeholder="username" />
      </div>

      <div class="flex flex-col gap-2 w-full">
        <div>이메일</div>
        <!-- 이메일 받아오기 / 수정 불가 -->
        <BaseTextInput placeholder="email" disabled />
      </div>

      <div class="flex flex-col gap-2 w-full">
        <div class="flex justify-between items-center">
          <div>비밀번호</div>
          <span class="text-indigo-600 cursor-pointer text-sm" @click="navigateTo('/mypage/change-password')">
            비밀번호 변경
          </span>
        </div>
        <!-- 비밀번호 받아오기 -->
        <BaseTextInput placeholder="password" type="password" />
      </div>

      <div class="text-xl font-bold mb-4">연결된 계좌 정보</div>
      <!-- 계좌 카드 -->
      <div class="flex items-center bg-[#F7F9FB] rounded-xl px-4 py-3 mb-3 shadow-sm w-full">
        <div class="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
          <!-- 은행 아이콘 (예시: 카드 아이콘) -->
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" stroke-width="1.5" fill="none" />
            <path d="M3 10h18" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </div>
        <div class="flex-1">
          <div class="font-semibold text-base">국민은행</div>
          <div class="text-gray-400 text-sm">****-****-1234</div>
        </div>
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
        </svg>
      </div>
      <!-- 새 계좌 연결하기 -->
      <div
        class="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition"
      >
        + 새 계좌 연결하기
      </div>
    </CardContainer>
  </div>
</template>

<script setup>
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import CardContainer from "@/components/common/CardContainer.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped></style>
