<template>
  <div class="relative w-full h-80 flex items-center justify-center -top-4">
    <svg viewBox="0 0 400 400" class="w-full h-full">
      <!-- 배경 격자 -->
      <g v-for="level in 5" :key="level" class="opacity-20">
        <polygon :points="getPolygonPoints(level * 20)" fill="none" stroke="#333333" stroke-width="1" />
      </g>

      <!-- 축선 -->
      <g v-for="(label, index) in labels" :key="index" class="opacity-30">
        <line
          :x1="200"
          :y1="200"
          :x2="getAxisEndPoint(index).x"
          :y2="getAxisEndPoint(index).y"
          stroke="#9ca3af"
          stroke-width="1"
        />
      </g>

      <!-- 실제 투자 행동 (빨간색) -->
      <polygon
        v-if="realData"
        :points="getDataPolygonPoints(realData)"
        fill="rgba(239, 68, 68, 0.3)"
        stroke="#ef4444"
        stroke-width="2"
      />

      <!-- 투자 성향 (파란색) -->
      <polygon
        v-if="surveyData"
        :points="getDataPolygonPoints(surveyData)"
        fill="rgba(59, 130, 246, 0.3)"
        stroke="#3b82f6"
        stroke-width="2"
      />

      <!-- 레이블 -->
      <g v-for="(label, index) in labels" :key="index">
        <text
          :x="getLabelPosition(index).x"
          :y="getLabelPosition(index).y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-sm font-medium fill-gray-700"
        >
          {{ label }}
        </text>
      </g>
    </svg>

    <!-- 범례 -->
    <div
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/80 px-3 py-2 rounded-lg"
    >
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full opacity-70"></div>
        <span class="text-xs text-gray-700">설문</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-500 rounded-full opacity-70"></div>
        <span class="text-xs text-gray-700">실제 투자</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  surveyData: {
    type: Object,
    default: null,
  },
  realData: {
    type: Object,
    default: null,
  },
});

const labels = ["안정성", "수익성", "유동성", "성장성", "분산투자"];

const getPolygonPoints = (radius) => {
  const points = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const x = 200 + radius * Math.cos(angle);
    const y = 200 + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
};

const getAxisEndPoint = (index) => {
  const angle = (index * 72 - 90) * (Math.PI / 180);
  const x = 200 + 100 * Math.cos(angle);
  const y = 200 + 100 * Math.sin(angle);
  return { x, y };
};

const getLabelPosition = (index) => {
  const angle = (index * 72 - 90) * (Math.PI / 180);
  const x = 200 + 120 * Math.cos(angle);
  const y = 200 + 120 * Math.sin(angle);
  return { x, y };
};

const getDataPolygonPoints = (data) => {
  if (!data) return "";

  const values = [data.stable, data.income, data.liquid, data.growth, data.diversified];
  const maxValue = Math.max(...values);
  const scaleFactor = maxValue > 0 ? Math.max(0.3, maxValue / 100) : 0.3; // 최소 30% 크기 보장
  const points = [];

  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    // 값을 정규화하고 최소 크기를 보장하면서 스케일링
    const normalizedValue = values[i] / Math.max(maxValue, 50); // 최소 50을 기준으로 정규화
    const radius = Math.max(20, normalizedValue * 100); // 최소 반지름 20, 최대 100
    const x = 200 + radius * Math.cos(angle);
    const y = 200 + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(" ");
};
</script>
