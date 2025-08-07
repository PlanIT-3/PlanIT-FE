<template>
  <div class="flex flex-col items-center mt-[-30px] gap-2">
    <div
      class="flex items-center justify-end w-[340px] bg-white rounded-full hover:cursor-pointer"
      @click="onClickSurvey"
    >
      <span
        class="text-sm font-bold text-[#560bad] hover:bg-gray-100 transition-colors duration-300 rounded-2xl px-2 py-2"
        >투자 성향 검사 다시 하기 ></span
      >
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
