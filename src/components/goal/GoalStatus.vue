<template>
  <div class="flex items-center mb-3">
    <h3 class="text-base font-semibold text-gray-800">📊 상위 4개 목표 현황</h3>
  </div>
  <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div v-for="(goal, index) in topGoals" :key="goal.goalId" class="flex flex-col items-center text-center">
        <CircleProgress :percent="goal.goalRate" :size="64" :color="progressColors[index % progressColors.length]" />
        <div class="mt-2 text-sm font-medium text-gray-900 truncate w-full">
          {{ goal.goalName }}
        </div>
        <div class="text-xs text-gray-500">{{ goal.goalRate }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import CircleProgress from "@/components/report/CircleProgress.vue";

const props = defineProps({
  goalList: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const progressColors = ["#4a90e2", "#5D00A8", "#10b981", "#f59e0b"];

const topGoals = computed(() => {
  return props.goalList
    .filter((goal) => goal.goalRate != null)
    .sort((a, b) => (b.goalRate || 0) - (a.goalRate || 0))
    .slice(0, 4);
});
</script>
