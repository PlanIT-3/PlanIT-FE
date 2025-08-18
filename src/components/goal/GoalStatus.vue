<template>
  <div class="flex items-center mb-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4 mr-2 text-indigo-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
    <h3 class="text-base font-semibold text-gray-800">상위 4개 목표 현황</h3>
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
