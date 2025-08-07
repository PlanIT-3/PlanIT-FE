<template>
  <div class="min-w-full h-full flex">
    <div class="w-full h-[170px] bg-white p-4 relative">
      <!-- 상단 제목 + 아이콘 -->
      <div class="absolute left-4 top-4 w-[250px]">
        <div class="flex items-center text-black text-xs font-semibold">
          <component :is="icon" class="h-4 w-4 mr-2" :class="iconColor" />
          {{ title }}
        </div>
        <div v-if="statusText" :class="statusTextColor + ' text-xs mt-2 font-medium'">
          {{ statusText }}
        </div>
      </div>

      <!-- 오른쪽 상단 진행률 / 상태 -->
      <div class="absolute right-4 top-4">
        <div :class="badgeBgColor + ' rounded-full h-5 px-3 flex items-center justify-center'">
          <span class="text-white text-xs font-semibold">{{ badgeText }}</span>
        </div>
      </div>

      <!-- 바 차트 -->
      <div class="">
        <BarChart
          :showLegend="showLegend"
          :data="[
            { name: '식비', value: 40 },
            { name: '교통비', value: 30 },
            { name: '여가', value: 20 },
            { name: '기타', value: 10 },
          ]"
        />
      </div>

      <!-- 하단 달성 정보 -->
      <div :class="bgColor + ' rounded-lg h-10 w-[calc(100%-32px)] absolute left-4 bottom-4 p-2'">
        <div :class="textColor + ' text-xs font-bold'">예상 달성일: {{ dueDate }}</div>
        <div :class="textColor + ' text-xs'">{{ subText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import BarChart from "../graph/BarChart.vue";

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: [String, Object], required: true },
  iconColor: { type: String, default: "text-blue-600" },

  statusText: { type: String, default: "" },
  statusTextColor: { type: String, default: "text-blue-600" },

  badgeText: { type: String, required: true },
  badgeBgColor: { type: String, default: "bg-blue-500" },

  progressDetails: {
    type: Array,
    required: true,
  },

  dueDate: { type: String, required: true },
  subText: { type: String, default: "" },

  bgColor: { type: String, default: "bg-blue-50" },
  textColor: { type: String, default: "text-blue-800" },

  showLegend: { type: Boolean, default: true },
});

const leftOffsets = computed(() => {
  const offsets = [];
  let sum = 0;
  for (const p of props.progressDetails) {
    offsets.push(sum);
    sum += p.percent;
  }
  return offsets;
});
</script>
