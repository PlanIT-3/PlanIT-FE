<template>
  <div class="flex flex-col items-center mt-[-30px] gap-2">
    <div
      class="flex items-center justify-end w-[340px] bg-white rounded-full hover:cursor-pointer"
      @click="onClickSurvey"
    >
      <div class="flex flex-row items-center hover:bg-gray-100 transition-colors duration-300 rounded-2xl mt-1 mb-2">
        <span class="text-sm font-medium text-[#560bad]">투자 성향 검사 다시 하기</span>
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
      <div class="flex items-center justify-center w-[220px] h-[110px] rounded-full" :style="{ background: theme.bg }">
        <img :src="theme.img" :alt="theme.name" class="w-20 h-20" />
      </div>
    </div>
    <div class="mt-2 text-lg">
      <span class="font-bold text-[#560bad]">{{ theme.name }}</span>
      <span class="font-semibold text-black"> 추천상품</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { fetchInvestType } from "@/api/memberApi";
import { getInvestTheme } from "@/utils/Character";
import { computed, onMounted } from "vue";
import { ref } from "vue";

const router = useRouter();

const onClickSurvey = () => {
  router.push("/investment-survey");
};

const investType = ref("NEUTRAL");

//투자 성향 불러오기
onMounted(async () => {
  try {
    const type = await fetchInvestType();
    investType.value = type;
  } catch (e) {
    console.error("투자성향 조회 실패:", e);
  }
});

const theme = computed(() => getInvestTheme(investType.value) || { name: "", bg: "#f3f4f6", img: "" });
</script>
