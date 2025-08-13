<script setup>
import { computed } from "vue";

const props = defineProps({
  selectedBanks: {
    type: Array,
    default: () => [],
  },
  selectedSecurities: {
    type: Array,
    default: () => [],
  },
  completedSteps: {
    type: Number,
    default: 0,
  },
});

// 각 단계의 상태 계산
const stepStatuses = computed(() => {
  const steps = [];

  // 은행 단계들
  props.selectedBanks.forEach((bankName, index) => {
    steps.push({
      type: "bank",
      name: bankName,
      completed: index < props.completedSteps,
    });
  });

  // 증권사 단계들
  props.selectedSecurities.forEach((security, index) => {
    steps.push({
      type: "security",
      name: security,
      completed: props.selectedBanks.length + index < props.completedSteps,
    });
  });

  return steps;
});
</script>

<template>
  <div class="flex items-center justify-center w-full max-w-md mt-auto py-16">
    <div class="flex-1 flex items-center justify-center">
      <!-- 동적 단계들 (은행 + 증권사) -->
      <template v-for="(step, index) in stepStatuses" :key="`step-${index}`">
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
          :class="step.completed ? 'bg-[#433D8B] text-white' : 'bg-gray-200 text-gray-400'"
        >
          <svg
            v-if="step.completed"
            width="16"
            height="16"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 8 7 11 12 5" />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="8" cy="8" r="6" />
          </svg>
        </div>

        <!-- 단계 간 연결선 (마지막 단계가 아닌 경우에만) -->
        <div
          v-if="index < stepStatuses.length - 1"
          class="h-0.5 w-4"
          :class="step.completed ? 'bg-[#433D8B]' : 'bg-gray-300'"
        ></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
