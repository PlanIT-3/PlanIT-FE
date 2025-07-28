<template>
  <teleport to="body">
    <div
      v-if="isModal"
      @click="$emit('close')"
      class="modal modal-bg-opacity fixed inset-0 z-[1000] flex items-center justify-center"
    >
      <div class="page bg-white rounded-lg w-80 max-w-full shadow-lg overflow-hidden flex flex-col" @click.stop>
        <!-- 헤더 영역 -->
        <div class="card-header bg-gray-100 p-4">
          <div class="flex items-start justify-between mb-1">
            <div class="text-xl font-bold text-left">{{ title }}</div>
            <button
              class="close-btn bg-transparent border-none text-2xl leading-none cursor-pointer text-black"
              aria-label="Close"
              @click="$emit('close')"
            >
              ×
            </button>
          </div>
          <div class="text-left text-base text-gray-500">
            {{ subTitle }}
          </div>
        </div>

        <!-- 콘텐츠 영역 -->
        <div class="card-body p-6 text-base text-gray-800">
          <slot></slot>
          <slot name="ledgerPopup"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  isModal: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "알림",
  },
  subTitle: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);
</script>

<style scoped>
.modal-bg-opacity {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
