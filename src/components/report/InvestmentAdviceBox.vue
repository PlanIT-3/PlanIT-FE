<template>
  <div class="bg-blue-50 rounded-2xl border border-blue-200 p-6 shadow">
    <div class="flex flex-col mb-4">
      <h3 class="text-medium font-bold text-gray-800">🔍 AI 투자 조언</h3>
      <p class="text-xs text-gray-500 ml-2">전체 투자 기반 맞춤 조언</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">AI가 분석 중입니다...</span>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-2">⚠️ 조언을 불러오는데 실패했습니다</p>
      <button @click="$emit('retry')" class="text-blue-600 hover:text-blue-800 underline">다시 시도</button>
    </div>

    <!-- 조언 내용 -->
    <div v-else-if="advice" class="p-3 bg-white rounded-lg border border-blue-100">
      <p class="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{{ formatAdvice(advice) }}</p>
    </div>

    <!-- 데이터 없음 -->
    <div v-else class="flex items-center justify-center py-8">
      <span class="text-gray-500">조언 데이터가 없습니다.</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  advice: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["retry"]);

// 마침표(.)로 끝나는 문장마다 줄바꿈 처리
const formatAdvice = (text) => {
  if (!text) return "";
  return text.replace(/\.\s+/g, ".\n");
};
</script>
