<template>
  <div class="bg-white rounded-xl border border-gray-200 p-3 mb-4 shadow-sm">
    <div class="grid grid-cols-3 gap-4">
      <!-- 총 목표 개수 -->
      <div class="text-center">
        <div class="text-lg font-bold text-blue-600">{{ totalGoals }}</div>
        <div class="text-sm text-gray-600">총 목표</div>
      </div>

      <!-- 평균 달성률 -->
      <div class="text-center">
        <div class="text-lg font-bold text-green-600">{{ averageRate.toFixed(0) }}%</div>
        <div class="text-sm text-gray-600">평균 달성률</div>
      </div>

      <!-- 달성 완료 개수 -->
      <div class="text-center">
        <div class="text-lg font-bold text-orange-600">{{ completedGoals }}</div>
        <div class="text-sm text-gray-600">달성 완료</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  goalList: {
    type: Array,
    default: () => [],
  },
});

// 총 목표 개수
const totalGoals = computed(() => props.goalList.length);

// 평균 달성률 계산
const averageRate = computed(() => {
  if (props.goalList.length === 0) return 0;
  const totalRate = props.goalList.reduce((sum, goal) => sum + (goal.goalRate || 0), 0);
  return totalRate / props.goalList.length;
});

// 달성 완료 개수 (100% 이상 달성한 목표)
const completedGoals = computed(() => {
  return props.goalList.filter((goal) => (goal.goalRate || 0) >= 100).length;
});
</script>
