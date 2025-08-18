<template>
  <div class="bg-blue-50 rounded-2xl border border-blue-200 p-6 shadow">
    <!-- 헤더 -->
    <div class="flex flex-col mb-4 items-start">
      <div class="flex items-center">
        <!-- AI 느낌 아이콘 -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-purple-600 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 2a9 9 0 00-9 9v3h18v-3a9 9 0 00-9-9zm0 11l3-3-3-3-3 3 3 3z"
          />
        </svg>
        <h3 class="text-medium font-bold text-gray-800">AI 투자 제언</h3>
      </div>
      <p class="text-xs text-gray-500 ml-8">투자 성향 분석 결과 기반 맞춤 제언</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">AI가 분석 중입니다...</span>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-2">⚠️ 제언을 불러오는데 실패했습니다</p>
      <button @click="fetchAdvice" class="text-blue-600 hover:text-blue-800 underline">다시 시도</button>
    </div>

    <!-- 제언 리스트 -->
    <div v-else-if="adviceData" class="space-y-4">
      <div
        v-for="(advice, index) in adviceList"
        :key="index"
        class="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-100"
      >
        <div
          class="flex-shrink-0 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5"
        >
          {{ index + 1 }}
        </div>
        <p class="text-gray-700 text-xs leading-relaxed">{{ advice }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/api";
import { ref, computed, onMounted } from "vue";

const loading = ref(false);
const error = ref(false);
const adviceData = ref(null);

const adviceList = computed(() => {
  if (!adviceData.value) return [];
  return [
    adviceData.value.investTypeAdvice1,
    adviceData.value.investTypeAdvice2,
    adviceData.value.investTypeAdvice3,
  ].filter(Boolean);
});

const fetchAdvice = async () => {
  loading.value = true;
  error.value = false;
<<<<<<< HEAD
  try {
    const response = await api.get("/api/openai/invest-type-advice");
    adviceData.value = response.data;
  } catch (err) {
    console.error("AI 투자 제언 가져오기 실패:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
=======

  // try {
  //   const response = await api.get("/api/openai/invest-type-advice");
  //   adviceData.value = response.data;
  // } catch (err) {
  //   console.error("AI 투자 제언 가져오기 실패:", err);
  //   error.value = true;
  // } finally {
  //   loading.value = false;
  // }
>>>>>>> c4b6b08 (feat: 상품 목표별 추천)
};

onMounted(() => {
  fetchAdvice();
});
</script>
