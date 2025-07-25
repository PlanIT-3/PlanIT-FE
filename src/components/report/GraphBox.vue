<template>
  <div class="bg-white rounded-2xl shadow p-4">
    <div class="flex justify-between items-center mb-2">
      <span class="font-semibold text-sm">{{ title }}</span>
      <span class="text-xs text-gray-400">{{ dropdownText }}</span>
    </div>
    <div class="h-32 flex items-center justify-center text-gray-300">
      <slot>[그래프 영역]</slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  title: { type: String, required: true },
  dropdownText: { type: String, default: 'Weekly ▾' },
});
</script> 