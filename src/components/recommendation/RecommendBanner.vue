<template>
  <div class="flex flex-col items-center mt-[-30px] gap-2">
    <div
      class="flex items-center justify-end w-[340px] bg-white rounded-full hover:cursor-pointer"
      @click="onClickSurvey"
    >
      <div class="flex flex-row items-center hover:bg-gray-100 transition-colors duration-300 rounded-2xl mt-1 mb-2">
        <span class="text-sm font-bold text-[#560bad]">투자 성향 검사 다시 하기</span>
        <svg
          class="text-sm font-bold text-[#560bad] size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </div>
    <div class="relative flex items-center justify-center w-[300px] h-[100px]">
      <!-- 원형 배경 + 캐릭터 -->
      <div
        class="flex items-center justify-center w-[220px] h-[110px] bg-[#f3e8ff] rounded-full border-2 border-blue-200"
      >
        <img src="@/assets/images/luna.svg" alt="루나" class="w-20 h-20" />
      </div>
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
const onClickSurvey = () => {
  router.push("/investment-survey");
};
</script>
