<template>
  <div class="bg-white rounded-2xl shadow p-4">
    <div class="flex justify-between items-center mb-2">
      <span class="font-semibold text-sm">{{ title }}</span>
    </div>
    <div class="h-64 flex items-center justify-center text-gray-300">
      <slot>[그래프 영역]</slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
});
</script>

<style scoped></style>
