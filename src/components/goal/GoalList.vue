<script setup>
import { computed } from "vue";
import BarChart from "../graph/BarChart.vue";

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: [String, Object] },
  iconColor: { type: String, default: "text-blue-600" },
  rate: { type: [Number, String], required: true },
  bgColor: { type: String, default: "bg-white" },
  barChartData: { type: Array, required: true },
  labelValues: { type: Array },
  targetAmount: { type: Number },
  totalAmount: { type: Number },
});

const numericRate = computed(() => {
  const num = Number(props.rate);
  return isNaN(num) ? 0 : num;
});

const badgeText = computed(() => {
  const rate = numericRate.value > 100 ? 100 : numericRate.value;
  return Math.floor(rate) + "%";
});

const statusText = computed(() => {
  const num = numericRate.value;
  if (num > 100) return "목표달성!";
  if (num >= 80) return "거의 다 왔어요";
  if (num >= 50) return "절반 넘었어요";
  if (num > 0) return "진행 중";
  return "";
});

const badgeBgColorComputed = computed(() => {
  const num = numericRate.value;
  if (num > 100) return "bg-green-500";
  if (num >= 80) return "bg-yellow-400";
  if (num >= 50) return "bg-orange-400";
  if (num > 0) return "bg-blue-500";
  return "bg-gray-400";
});
</script>

<template>
  <div class="flex flex-col p-2 my-3 border-b border-gray-200 hover:bg-gray-50 transition" :class="[bgColor]">
    <!-- 상단 제목 + 진행률 -->
    <div class="flex justify-between items-center mb-0.5">
      <div class="flex items-center">
        <component :is="icon" class="h-4 w-4" :class="iconColor" />
        <span class="text-sm font-semibold text-gray-800 truncate">📌 {{ title }}</span>
      </div>
      <span :class="badgeBgColorComputed + ' text-white text-xs px-2 py-0.5 rounded-full font-medium'">
        {{ badgeText }} 달성
      </span>
    </div>

    <!-- 상태 텍스트 -->
    <div v-if="statusText" class="text-xs text-gray-600 mb-0.5">
      {{ statusText }}
    </div>

    <!-- 그래프 -->
    <!-- 그래프 -->
    <div class="relative w-full h-6 overflow-visible">
      <div class="absolute" style="top: -45px; left: 50%; transform: translateX(-50%); width: 200px">
        <BarChart :data="barChartData" :labelValues="labelValues" />
      </div>
    </div>

    <!-- 금액 정보 -->
    <div class="flex justify-between text-xs text-gray-600 mt-[-10px] mb-3">
      <span>{{ totalAmount?.toLocaleString() }}</span>
      <span>{{ targetAmount?.toLocaleString() }}</span>
    </div>
  </div>
</template>
