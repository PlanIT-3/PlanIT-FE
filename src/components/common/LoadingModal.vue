<template>
  <teleport to="body">
    <div v-if="isVisible" class="modal modal-bg-opacity fixed inset-0 z-[1000] flex items-center justify-center">
      <div class="page bg-white rounded-lg w-80 max-w-full shadow-lg overflow-hidden flex flex-col" @click.stop>
        <!-- 로딩 스피너 -->
        <div class="flex flex-col items-center justify-center p-8">
          <!-- 스피너 애니메이션 -->
          <div class="w-16 h-16 border-4 border-gray-200 border-t-[#433D8B] rounded-full animate-spin mb-4"></div>

          <!-- 로딩 메시지 -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-600">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "연동 중",
  },
  message: {
    type: String,
    default: "잠시만 기다려주세요...",
  },
});
</script>

<style scoped>
.modal-bg-opacity {
  background-color: rgba(0, 0, 0, 0.4);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
