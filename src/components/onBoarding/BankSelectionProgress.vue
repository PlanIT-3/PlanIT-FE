<template>
  <div class="flex justify-center items-center py-4">
    <div class="flex items-center">
      <div v-for="(step, index) in selectedBanks.length" :key="index" class="flex items-center">
        <!-- 점 -->
        <div
          class="w-3 h-3 rounded-full border-2 transition-all duration-300 relative z-10"
          :class="[
            index < completedSteps
              ? 'bg-[#433D8B] border-[#433D8B]' // 완료된 단계
              : 'bg-white border-gray-300', // 미완료 단계
          ]"
        >
          <!-- 완료된 단계에 체크 표시 -->
          <div v-if="index < completedSteps" class="w-full h-full flex items-center justify-center">
            <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- 연결선 (마지막 점이 아닌 경우에만) -->
        <div
          v-if="index < selectedBanks.length - 1"
          class="w-8 h-0.5 mx-2 transition-all duration-300"
          :class="[
            index < completedSteps
              ? 'bg-[#433D8B]' // 완료된 구간
              : 'bg-gray-300', // 미완료 구간
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  selectedBanks: {
    type: Array,
    required: true,
    default: () => [],
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
