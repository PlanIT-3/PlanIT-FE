<template>
  <div class="mb-0">
    <div class="text-sm font-semibold mb-2 flex items-center">
      <span class="text-red-500 mr-1">📈</span> 목표별 달성률
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
