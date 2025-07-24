<template>
  <div
    class="flex flex-col items-center justify-center min-h-[400px] w-full h-full bg-cover bg-center relative"
    style="background-image: url(&quot;/src/assets/images/background.png&quot;)"
  >
    <svg viewBox="0 0 800 600" class="w-[440px] h-[440px] max-w-[95vw] object-contain">
      <g
        v-for="constellation in constellations"
        :key="constellation.id"
        :class="
          activeConstellationIds.includes(constellation.id)
            ? 'transition-all duration-500 drop-shadow-[0_0_10px_#60a5fa] drop-shadow-[0_0_20px_#3b82f6]'
            : 'transition-all duration-500'
        "
      >
        <!-- 연결선 -->
        <line
          v-for="line in constellation.lines"
          :key="line.id"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          :class="
            activeConstellationIds.includes(constellation.id)
              ? 'stroke-blue-400 stroke-2 drop-shadow-[0_0_2px_#3b82f6]'
              : 'stroke-slate-500 stroke-1 opacity-80'
          "
        />
        <!-- 별 -->
        <circle
          v-for="star in constellation.stars"
          :key="star.id"
          :cx="star.x"
          :cy="star.y"
          :r="star.size"
          :class="
            activeConstellationIds.includes(constellation.id)
              ? 'fill-amber-400 animate-pulse drop-shadow-[0_0_6px_#fbbf24]'
              : 'fill-slate-500 opacity-80'
          "
        />
      </g>
    </svg>
    <!-- 별자리 진행률 텍스트: SVG 바로 아래, 버튼 위 -->
    <div class="mt-6 mb-2 text-white text-lg font-bold drop-shadow-md z-10">{{ activeCount }} / {{ totalCount }}</div>
    <!-- 하단 보상 수령 버튼: 기존보다 더 위쪽 (bottom-32) -->
    <button
      class="absolute bottom-32 left-1/2 -translate-x-1/2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-all z-20"
    >
      보상 수령
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

// 별자리 데이터는 그대로 유지
const constellations = [
  {
    id: 1,
    name: "양자리",
    fullName: "양자리 (Aries)",
    lines: [
      { id: 1, x1: 80, y1: 120, x2: 120, y2: 100 },
      { id: 2, x1: 120, y1: 100, x2: 140, y2: 130 },
      { id: 3, x1: 120, y1: 100, x2: 160, y2: 90 },
    ],
    stars: [
      { id: 1, x: 80, y: 120, size: 3 },
      { id: 2, x: 120, y: 100, size: 4 },
      { id: 3, x: 140, y: 130, size: 3 },
      { id: 4, x: 160, y: 90, size: 3 },
    ],
  },
  {
    id: 2,
    name: "황소자리",
    fullName: "황소자리 (Taurus)",
    lines: [
      { id: 1, x1: 250, y1: 80, x2: 280, y2: 100 },
      { id: 2, x1: 280, y1: 100, x2: 320, y2: 90 },
      { id: 3, x1: 320, y1: 90, x2: 340, y2: 110 },
      { id: 4, x1: 280, y1: 100, x2: 300, y2: 140 },
      { id: 5, x1: 300, y1: 140, x2: 320, y2: 90 },
    ],
    stars: [
      { id: 1, x: 250, y: 80, size: 4 },
      { id: 2, x: 280, y: 100, size: 5 },
      { id: 3, x: 320, y: 90, size: 4 },
      { id: 4, x: 340, y: 110, size: 3 },
      { id: 5, x: 300, y: 140, size: 3 },
    ],
  },
  {
    id: 3,
    name: "쌍둥이자리",
    fullName: "쌍둥이자리 (Gemini)",
    lines: [
      { id: 1, x1: 480, y1: 70, x2: 520, y2: 90 },
      { id: 2, x1: 520, y1: 90, x2: 540, y2: 120 },
      { id: 3, x1: 480, y1: 70, x2: 500, y2: 110 },
      { id: 4, x1: 500, y1: 110, x2: 540, y2: 120 },
      { id: 5, x1: 500, y1: 110, x2: 480, y2: 140 },
      { id: 6, x1: 520, y1: 90, x2: 560, y2: 100 },
    ],
    stars: [
      { id: 1, x: 480, y: 70, size: 4 },
      { id: 2, x: 520, y: 90, size: 4 },
      { id: 3, x: 540, y: 120, size: 3 },
      { id: 4, x: 500, y: 110, size: 3 },
      { id: 5, x: 480, y: 140, size: 3 },
      { id: 6, x: 560, y: 100, size: 3 },
    ],
  },
  {
    id: 4,
    name: "게자리",
    fullName: "게자리 (Cancer)",
    lines: [
      { id: 1, x1: 680, y1: 80, x2: 700, y2: 110 },
      { id: 2, x1: 700, y1: 110, x2: 720, y2: 90 },
      { id: 3, x1: 700, y1: 110, x2: 690, y2: 140 },
      { id: 4, x1: 690, y1: 140, x2: 710, y2: 130 },
    ],
    stars: [
      { id: 1, x: 680, y: 80, size: 3 },
      { id: 2, x: 700, y: 110, size: 4 },
      { id: 3, x: 720, y: 90, size: 3 },
      { id: 4, x: 690, y: 140, size: 3 },
      { id: 5, x: 710, y: 130, size: 3 },
    ],
  },
  {
    id: 5,
    name: "사자자리",
    fullName: "사자자리 (Leo)",
    lines: [
      { id: 1, x1: 60, y1: 230, x2: 90, y2: 250 },
      { id: 2, x1: 90, y1: 250, x2: 130, y2: 240 },
      { id: 3, x1: 130, y1: 240, x2: 160, y2: 260 },
      { id: 4, x1: 90, y1: 250, x2: 100, y2: 280 },
      { id: 5, x1: 100, y1: 280, x2: 140, y2: 270 },
      { id: 6, x1: 140, y1: 270, x2: 160, y2: 260 },
    ],
    stars: [
      { id: 1, x: 60, y: 230, size: 4 },
      { id: 2, x: 90, y: 250, size: 5 },
      { id: 3, x: 130, y: 240, size: 4 },
      { id: 4, x: 160, y: 260, size: 3 },
      { id: 5, x: 100, y: 280, size: 3 },
      { id: 6, x: 140, y: 270, size: 3 },
    ],
  },
  {
    id: 6,
    name: "처녀자리",
    fullName: "처녀자리 (Virgo)",
    lines: [
      { id: 1, x1: 250, y1: 220, x2: 280, y2: 240 },
      { id: 2, x1: 280, y1: 240, x2: 320, y2: 250 },
      { id: 3, x1: 320, y1: 250, x2: 340, y2: 230 },
      { id: 4, x1: 280, y1: 240, x2: 290, y2: 270 },
      { id: 5, x1: 290, y1: 270, x2: 310, y2: 280 },
    ],
    stars: [
      { id: 1, x: 250, y: 220, size: 3 },
      { id: 2, x: 280, y: 240, size: 4 },
      { id: 3, x: 320, y: 250, size: 5 },
      { id: 4, x: 340, y: 230, size: 3 },
      { id: 5, x: 290, y: 270, size: 3 },
      { id: 6, x: 310, y: 280, size: 3 },
    ],
  },
  {
    id: 7,
    name: "천칭자리",
    fullName: "천칭자리 (Libra)",
    lines: [
      { id: 1, x1: 480, y1: 210, x2: 510, y2: 230 },
      { id: 2, x1: 510, y1: 230, x2: 540, y2: 220 },
      { id: 3, x1: 540, y1: 220, x2: 570, y2: 240 },
      { id: 4, x1: 510, y1: 230, x2: 520, y2: 260 },
      { id: 5, x1: 520, y1: 260, x2: 550, y2: 250 },
    ],
    stars: [
      { id: 1, x: 480, y: 210, size: 3 },
      { id: 2, x: 510, y: 230, size: 4 },
      { id: 3, x: 540, y: 220, size: 4 },
      { id: 4, x: 570, y: 240, size: 3 },
      { id: 5, x: 520, y: 260, size: 3 },
      { id: 6, x: 550, y: 250, size: 3 },
    ],
  },
  {
    id: 8,
    name: "전갈자리",
    fullName: "전갈자리 (Scorpio)",
    lines: [
      { id: 1, x1: 680, y1: 200, x2: 700, y2: 220 },
      { id: 2, x1: 700, y1: 220, x2: 720, y2: 240 },
      { id: 3, x1: 720, y1: 240, x2: 740, y2: 260 },
      { id: 4, x1: 700, y1: 220, x2: 690, y2: 250 },
      { id: 5, x1: 690, y1: 250, x2: 710, y2: 270 },
      { id: 6, x1: 710, y1: 270, x2: 730, y2: 280 },
    ],
    stars: [
      { id: 1, x: 680, y: 200, size: 4 },
      { id: 2, x: 700, y: 220, size: 5 },
      { id: 3, x: 720, y: 240, size: 4 },
      { id: 4, x: 740, y: 260, size: 3 },
      { id: 5, x: 690, y: 250, size: 3 },
      { id: 6, x: 710, y: 270, size: 3 },
      { id: 7, x: 730, y: 280, size: 3 },
    ],
  },
  {
    id: 9,
    name: "사수자리",
    fullName: "사수자리 (Sagittarius)",
    lines: [
      { id: 1, x1: 60, y1: 370, x2: 90, y2: 390 },
      { id: 2, x1: 90, y1: 390, x2: 130, y2: 380 },
      { id: 3, x1: 130, y1: 380, x2: 150, y2: 400 },
      { id: 4, x1: 90, y1: 390, x2: 110, y2: 420 },
      { id: 5, x1: 110, y1: 370, x2: 130, y2: 380 },
      { id: 6, x1: 110, y1: 370, x2: 140, y2: 350 },
    ],
    stars: [
      { id: 1, x: 60, y: 370, size: 3 },
      { id: 2, x: 90, y: 390, size: 4 },
      { id: 3, x: 130, y: 380, size: 4 },
      { id: 4, x: 150, y: 400, size: 3 },
      { id: 5, x: 110, y: 420, size: 3 },
      { id: 6, x: 110, y: 370, size: 3 },
      { id: 7, x: 140, y: 350, size: 3 },
    ],
  },
  {
    id: 10,
    name: "염소자리",
    fullName: "염소자리 (Capricorn)",
    lines: [
      { id: 1, x1: 250, y1: 360, x2: 280, y2: 380 },
      { id: 2, x1: 280, y1: 380, x2: 320, y2: 370 },
      { id: 3, x1: 320, y1: 370, x2: 340, y2: 390 },
      { id: 4, x1: 280, y1: 380, x2: 290, y2: 410 },
      { id: 5, x1: 290, y1: 410, x2: 320, y2: 420 },
      { id: 6, x1: 320, y1: 420, x2: 340, y2: 390 },
    ],
    stars: [
      { id: 1, x: 250, y: 360, size: 3 },
      { id: 2, x: 280, y: 380, size: 4 },
      { id: 3, x: 320, y: 370, size: 4 },
      { id: 4, x: 340, y: 390, size: 3 },
      { id: 5, x: 290, y: 410, size: 3 },
      { id: 6, x: 320, y: 420, size: 3 },
    ],
  },
  {
    id: 11,
    name: "물병자리",
    fullName: "물병자리 (Aquarius)",
    lines: [
      { id: 1, x1: 480, y1: 350, x2: 510, y2: 370 },
      { id: 2, x1: 510, y1: 370, x2: 540, y2: 360 },
      { id: 3, x1: 540, y1: 360, x2: 570, y2: 380 },
      { id: 4, x1: 510, y1: 370, x2: 520, y2: 400 },
      { id: 5, x1: 520, y1: 400, x2: 550, y2: 410 },
      { id: 6, x1: 530, y1: 390, x2: 560, y2: 370 },
    ],
    stars: [
      { id: 1, x: 480, y: 350, size: 3 },
      { id: 2, x: 510, y: 370, size: 4 },
      { id: 3, x: 540, y: 360, size: 4 },
      { id: 4, x: 570, y: 380, size: 3 },
      { id: 5, x: 520, y: 400, size: 3 },
      { id: 6, x: 550, y: 410, size: 3 },
      { id: 7, x: 530, y: 390, size: 3 },
      { id: 8, x: 560, y: 370, size: 3 },
    ],
  },
  {
    id: 12,
    name: "물고기자리",
    fullName: "물고기자리 (Pisces)",
    lines: [
      { id: 1, x1: 680, y1: 340, x2: 700, y2: 360 },
      { id: 2, x1: 700, y1: 360, x2: 720, y2: 380 },
      { id: 3, x1: 720, y1: 380, x2: 740, y2: 400 },
      { id: 4, x1: 700, y1: 360, x2: 680, y2: 390 },
      { id: 5, x1: 680, y1: 390, x2: 700, y2: 420 },
      { id: 6, x1: 700, y1: 420, x2: 720, y2: 380 },
    ],
    stars: [
      { id: 1, x: 680, y: 340, size: 3 },
      { id: 2, x: 700, y: 360, size: 4 },
      { id: 3, x: 720, y: 380, size: 4 },
      { id: 4, x: 740, y: 400, size: 3 },
      { id: 5, x: 680, y: 390, size: 3 },
      { id: 6, x: 700, y: 420, size: 3 },
    ],
  },
];

// 활성화된 별자리 id 배열 (예시: 5, 7, 9번이 활성화)
const activeConstellationIds = ref([5]); // 실제 활성화된 별자리 id로 교체

// 활성화된 별자리 개수
const activeCount = computed(() => constellations.filter((c) => activeConstellationIds.value.includes(c.id)).length);
// 총 별자리 개수
const totalCount = computed(() => constellations.length);
</script>
