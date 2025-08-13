<template>
  <div class="flex flex-col min-h-screen bg-white items-center justify-center relative px-6">
    <!-- 상단 뒤로가기 -->
    <div class="absolute top-6 left-6">
      <button @click="goBack" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="flex flex-col items-center justify-center flex-1">
      <!-- 체크 표시가 있는 원 -->
      <div class="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-6">
        <svg
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="4 8 7 11 12 5" />
        </svg>
      </div>

      <!-- 완료 메시지 -->
      <h1 class="text-2xl font-semibold text-black mb-8">계좌연동 완료</h1>
    </div>

    <!-- 하단 버튼 -->
    <div class="w-full max-w-md mb-10">
      <button @click="onComplete" class="w-full py-4 bg-[#433D8B] text-white rounded-lg font-semibold text-lg">
        완료
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 뒤로가기
function goBack() {
  router.go(-1);
}

// 완료 버튼 클릭
function onComplete() {
  // 인증 상태 확인
  const isAuthenticated = authStore.isLogin;
  const hasValidToken = authStore.getaccessToken();

  //여긴 확인 완료

  if (!isAuthenticated || !hasValidToken) {
    console.warn("인증 상태가 유효하지 않습니다. 온보딩 시작 페이지로 이동합니다.");
    router.push("/onboard-loading");
    return;
  }

  router.replace("/main");
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
