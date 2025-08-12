<template>
  <div class="bg-blue-50 rounded-2xl border border-blue-200 p-6 shadow">
    <div class="flex flex-col mb-4">
      <h3 class="text-medium font-bold text-gray-800">🔍 목표 진행 요약</h3>
      <p class="text-xs text-gray-500 ml-2">목표 달성을 위한 AI 분석 결과</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">AI가 분석 중입니다...</span>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-2">⚠️ 분석 결과를 불러오는데 실패했습니다</p>
      <button @click="fetchAdvice" class="text-blue-600 hover:text-blue-800 underline">다시 시도</button>
    </div>

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

    <div v-else class="text-center py-8 text-gray-500">목표 진행 데이터를 분석하여 맞춤형 제언을 제공합니다.</div>
  </div>
</template>

<script setup>
import api from "@/api";
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  goalId: {
    type: [String, Number],
    required: true,
  },
});

const loading = ref(false);
const error = ref(false);
const adviceData = ref(null);

const adviceList = computed(() => {
  if (!adviceData.value || !adviceData.value.goalProgressAdvice) return [];

  // \n으로 구분된 텍스트를 배열로 분리
  return adviceData.value.goalProgressAdvice
    .split('\n')
    .map(advice => advice.trim())
    .filter(advice => advice.length > 0);
});

const fetchAdvice = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await api.get(`/api/openai/${props.goalId}/goal-progress`);
    adviceData.value = response.data;
  } catch (err) {
    console.error("목표 진행 분석 가져오기 실패:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.goalId) {
    fetchAdvice();
  }
});
</script>
