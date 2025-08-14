<template>
  <teleport to="body">
    <div
      v-if="isVisible"
      @click="closeModal"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg w-80 max-w-full shadow-lg overflow-hidden flex flex-col" @click.stop>
        <!-- 헤더 영역 -->
        <div class="bg-green-50 p-4 border-b border-green-200">
          <div class="flex items-center justify-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-green-800">연동 완료!</div>
              <div class="text-sm text-green-600">({{ currentStep }}/{{ totalSteps }}) 다음 은행으로 이동합니다.</div>
            </div>
          </div>
        </div>

        <!-- 확인 버튼 -->
        <div class="p-4">
          <button
            @click="closeModal"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
