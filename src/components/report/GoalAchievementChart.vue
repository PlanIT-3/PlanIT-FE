<template>
  <div class="mb-0">
    <div class="text-sm font-semibold mb-2 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-red-500 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
      목표별 달성률
    </div>
    <div class="text-xs text-gray-400 mb-4">각 투자 목표의 현재 진행 상황</div>

    <!-- 차트 1 ~ 4개까지 자동 배치 가능 -->
    <div
      :class="[
        'grid gap-4 justify-center',
        goals.length === 1
          ? 'grid-cols-1'
          : goals.length === 2
            ? 'grid-cols-2'
            : goals.length === 3
              ? 'grid-cols-3'
              : 'grid-cols-4',
      ]"
    >
      <div v-for="(goal, i) in goals" :key="i" class="flex flex-col items-center">
        <CircleProgress :percent="goal.percent" :color="goal.color" :size="64" />
        <div class="text-xs font-semibold text-gray-700 mt-2">{{ goal.name }}</div>
        <div class="text-[11px] text-gray-400">{{ formatCurrency(goal.value) }} / {{ formatCurrency(goal.total) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CircleProgress from "@/components/report/CircleProgress.vue";

const props = defineProps({
  goals: {
    type: Array,
    default: () => [],
  },
});

const formatCurrency = (value) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(0) + "만원";
  }
  return value.toLocaleString() + "원";
};
</script>
