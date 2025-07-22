<template>
  <div class="flex flex-col items-center">
    <div class="relative flex items-center justify-center w-[300px] h-[140px]">
      <!-- 왼쪽 화살표 -->
      <button
        class="absolute left-0 top-1/2 -translate-y-1/2 text-3xl text-gray-400 hover:text-gray-600 transition"
        @click="goPrev"
        aria-label="이전"
      >
        &#60;
      </button>
      <!-- 원형 배경 + 캐릭터 -->
      <div
        class="flex items-center justify-center w-[220px] h-[110px] bg-[#f3e8ff] rounded-full border-2 border-blue-200"
      >
        <img src="@/assets/images/luna.svg" alt="루나" class="w-20 h-20" />
      </div>
      <!-- 오른쪽 화살표 -->
      <button
        class="absolute right-0 top-1/2 -translate-y-1/2 text-3xl text-gray-400 hover:text-gray-600 transition"
        @click="goNext"
        aria-label="다음"
      >
        &#62;
      </button>
    </div>
    <div class="mt-2 text-lg">
      <span class="font-bold text-[#560bad]">루나</span>
      <span class="font-semibold text-black"> 추천상품</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goPrev() {
  // 예시: 이전 추천 상품 페이지로 이동
  // router.push('/recommend/prev') 등으로 구현 가능
  // 현재는 /recommend에서 /recommend2로 이동 예시
  router.push("/recommend/prev");
}

function goNext() {
  // 예시: 다음 추천 상품 페이지로 이동
  router.push("/recommend/next");
}
</script>
