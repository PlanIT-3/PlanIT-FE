<template>
  <div class="p-3 rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="text-[10px] text-gray-500 mb-1">{{ title }}</div>
    <div class="text-sm font-semibold text-gray-800">{{ formattedValue }}</div>
    <div v-if="note" class="text-[9px] text-gray-400 mt-1">{{ note }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], default: "-" },
  note: { type: String, default: "" },
});

const formattedValue = computed(() => {
  if (!props.value && props.value !== 0) return "-";
  return typeof props.value === "number" ? props.value.toLocaleString("ko-KR") + "원" : props.value;
});
</script>
