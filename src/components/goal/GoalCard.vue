<script setup>
import { computed } from "vue";
import BarChart from "../graph/BarChart.vue";

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: [String, Object] },
  iconColor: { type: String, default: "text-blue-600" },

  rate: { type: [Number, String], required: true },

  bgColor: { type: String, default: "bg-blue-50" },

  showLegend: { type: Boolean, default: true },

  barChartData: {
    type: Array,
    default: () => [
      { name: "식비", value: 40 },
      { name: "교통비", value: 30 },
      { name: "여가", value: 20 },
      { name: "기타", value: 10 },
    ],
    required: true,
  },
  labelValues: { type: Array },
  targetAmount: { type: Number },
  totalAmount: { type: Number },
});

const numericRate = computed(() => {
  const num = Number(props.rate);
  return isNaN(num) ? 0 : num;
});

const badgeText = computed(() => {
  return (numericRate.value > 100 ? 100 : numericRate.value) + "%";
});

const statusText = computed(() => {
  const num = numericRate.value;
  if (num > 100) return "목표달성!!";
  if (num >= 80) return "거의 다 왔어요!";
  if (num >= 50) return "절반 넘었어요!";
  if (num > 0) return "열심히 진행 중";
  return "";
});

const badgeBgColorComputed = computed(() => {
  const num = numericRate.value;
  if (num > 100) return "bg-green-600";
  if (num >= 80) return "bg-yellow-500";
  if (num >= 50) return "bg-orange-400";
  if (num > 0) return "bg-blue-500";
  return "bg-gray-400";
});

const statusTextColorComputed = computed(() => {
  const num = numericRate.value;
  if (num > 100) return "text-green-700";
  if (num >= 80) return "text-yellow-600";
  if (num >= 50) return "text-orange-500";
  if (num > 0) return "text-blue-600";
  return "text-gray-500";
});
</script>

<template>
  <div class="w-full p-3 my-2 relative rounded-xl" :class="bgColor">
    <!-- 상단 제목 + 아이콘 -->
    <div class="absolute left-4 top-4 w-[250px]">
      <div class="flex items-center text-black text-xs font-semibold">
        <component :is="icon" class="h-4 w-4 mr-2" :class="iconColor" />
        {{ title }}
      </div>
      <div v-if="statusText" :class="statusTextColorComputed + ' text-xs mt-2 font-medium'">
        {{ statusText }}
      </div>
    </div>

    <!-- 오른쪽 상단 진행률 / 상태 -->
    <div class="absolute right-4 top-4">
      <div :class="badgeBgColorComputed + ' rounded-full h-5 px-3 flex items-center justify-center'">
        <span class="text-white text-xs font-semibold">{{ badgeText }}</span>
      </div>
    </div>

    <!-- 바 차트 -->
    <div>
      <BarChart :data="barChartData" :labelValues="props.labelValues" />
      <!-- 바 차트 밑 텍스트 -->
      <div class="flex justify-between text-xs font-medium mt-1">
        <span>{{ props.totalAmount }}</span>
        <span>{{ props.targetAmount }}</span>
      </div>
    </div>
  </div>
</template>
