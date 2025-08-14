<template>
  <div class="flex justify-center items-center w-full py-8">
    <div class="flex items-center">
      <div v-for="(step, index) in totalSteps" :key="index" class="flex items-center">
        <!-- 점 -->
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
          :class="index < completedSteps ? 'bg-[#433D8B] text-white shadow-md' : 'bg-gray-200 text-gray-400 border border-gray-300'"
        >
          <!-- 완료된 단계에 체크 표시 -->
          <svg
            v-if="index < completedSteps"
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
          <!-- 미완료 단계에 원 표시 -->
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

        <!-- 연결선 (마지막 점이 아닌 경우에만) -->
        <div
          v-if="index < totalSteps - 1"
          class="w-16 h-0.5 transition-all duration-300 rounded-full"
          :class="index < completedSteps ? 'bg-[#433D8B]' : 'bg-gray-300'"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  totalSteps: {
    type: Number,
    required: true,
    default: 3,
  },
  completedSteps: {
    type: Number,
    required: true,
    default: 0,
  },
});
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
