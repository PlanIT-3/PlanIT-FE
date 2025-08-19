<!-- InfoCard.vue -->
<template>
  <div class="p-3 sm:p-4 rounded-lg border" :class="borderClass">
    <div :class="titleClass" class="mb-1">{{ title }}</div>
    <div :class="valueClass" class="font-bold text-sm sm:text-lg">{{ formattedValue }}</div>
    <div :class="noteClass" class="mt-1 text-[10px] sm:text-xs">{{ note }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { toRef } from "vue";

// props 정의
const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], default: "-" },
  color: { type: String, default: "violet" }, // violet, blue, emerald, rose, purple 등
  note: { type: String, default: "" },
});

// 화폐 단위 포맷
const formattedValue = computed(() => {
  if (!props.value && props.value !== 0) return "-";
  return typeof props.value === "number" ? props.value.toLocaleString("ko-KR") + "원" : props.value;
});

// 색상별 클래스
const borderClass = computed(() => {
  switch (props.color) {
    case "blue":
      return "border-blue-200";
    case "emerald":
      return "border-emerald-200";
    case "rose":
      return "border-rose-200";
    case "purple":
      return "border-purple-200";
    default:
      return "border-violet-200";
  }
});

const titleClass = computed(() => {
  switch (props.color) {
    case "blue":
      return "text-blue-500 text-[10px] sm:text-xs";
    case "emerald":
      return "text-emerald-500 text-[10px] sm:text-xs";
    case "rose":
      return "text-rose-500 text-[10px] sm:text-xs";
    case "purple":
      return "text-purple-500 text-[10px] sm:text-xs";
    default:
      return "text-violet-500 text-[10px] sm:text-xs";
  }
});

const valueClass = computed(() => {
  switch (props.color) {
    case "blue":
      return "text-blue-700";
    case "emerald":
      return "text-emerald-600";
    case "rose":
      return "text-rose-600";
    case "purple":
      return "text-purple-700";
    default:
      return "text-violet-700";
  }
});

const noteClass = computed(() => {
  switch (props.color) {
    case "blue":
      return "text-blue-400";
    case "emerald":
      return "text-emerald-400";
    case "rose":
      return "text-rose-400";
    case "purple":
      return "text-purple-400";
    default:
      return "text-violet-400";
  }
});
</script>
