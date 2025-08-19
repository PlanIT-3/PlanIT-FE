<template>
  <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
    <h4 class="font-semibold text-blue-800 mb-2">🔍 AI 투자 조언</h4>
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600 text-sm">조언을 불러오는 중...</span>
    </div>

    <div v-else-if="error" class="text-center py-4">
      <p class="text-red-600 text-sm mb-2">⚠️ 조언을 불러오는데 실패했습니다</p>
      <button @click="$emit('retry')" class="text-blue-600 hover:text-blue-800 underline text-sm">다시 시도</button>
    </div>

    <div v-else-if="advice" class="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-100">
      <p class="text-sm leading-relaxed whitespace-pre-line">{{ formatAdvice(advice) }}</p>
    </div>

    <div v-else class="flex items-center justify-center py-4">
      <span class="text-gray-500 text-sm">조언 데이터가 없습니다.</span>
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
  if (!text) return '';
  return text.replace(/\.\s+/g, '.\n');
};
</script>
