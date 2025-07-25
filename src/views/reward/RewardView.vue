<template>
  <div
    class="flex flex-col items-center justify-center min-h-[400px] w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden"
  >
    <!-- 미세한 격자 배경 -->
    <div class="absolute inset-0 opacity-[0.02]">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
          background-size: 20px 20px;
        "
      ></div>
    </div>

    <!-- 은은한 배경 별들 - 더 작고 절제된 -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="star in backgroundStars"
        :key="star.id"
        class="absolute bg-slate-300 rounded-full"
        :style="{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.opacity,
          animationDelay: `${star.delay}ms`,
        }"
      ></div>
    </div>

    <!-- 세련된 조명 효과 -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute top-1/3 left-1/3 w-96 h-48 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-[100px]"
      ></div>
      <div
        class="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-t from-indigo-400/30 to-purple-400/30 rounded-full blur-[120px]"
      ></div>
    </div>

    <!-- 전문적인 확산 효과 -->
    <div v-if="showBigBang" class="absolute inset-0 z-50 flex items-center justify-center">
      <!-- 중심점 -->
      <div
        v-if="bigBangStage >= 1"
        class="absolute w-1 h-1 bg-white rounded-full"
        :class="bigBangStage >= 2 ? 'animate-pulse' : ''"
      ></div>

      <!-- 첫 번째 확산 -->
      <div
        v-if="bigBangStage >= 2"
        class="absolute w-16 h-16 border border-white/20 rounded-full animate-ping opacity-60"
      ></div>

      <!-- 두 번째 확산 -->
      <div
        v-if="bigBangStage >= 3"
        class="absolute w-32 h-32 border border-slate-300/15 rounded-full animate-ping opacity-40"
      ></div>

      <!-- 세 번째 확산 -->
      <div
        v-if="bigBangStage >= 4"
        class="absolute w-64 h-64 border border-slate-400/10 rounded-full animate-ping opacity-30"
      ></div>

      <!-- 최종 확산 -->
      <div
        v-if="bigBangStage >= 5"
        class="absolute w-96 h-96 border border-white/5 rounded-full animate-ping opacity-20"
      ></div>

      <!-- 미세한 파티클들 -->
      <div
        v-if="bigBangStage >= 3"
        v-for="sparkle in sparkles"
        :key="sparkle.id"
        class="absolute w-0.5 h-0.5 bg-slate-200 rounded-full opacity-40 pointer-events-none"
        :style="{
          left: `${sparkle.x}%`,
          top: `${sparkle.y}%`,
          animationDelay: `${sparkle.delay}ms`,
          transform: `translate(${sparkle.moveX}px, ${sparkle.moveY}px)`,
          transition: `all ${sparkle.duration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
        }"
      ></div>

      <!-- 프리미엄 보상 모달 -->
      <div
        v-if="bigBangStage >= 6"
        class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/96 backdrop-blur-md z-70"
      >
        <!-- 메인 카드 -->
        <div class="relative">
          <div
            class="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-10 shadow-2xl border border-slate-700/30 max-w-md backdrop-blur-xl"
          >
            <!-- 미세한 테두리 글로우 -->
            <div class="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent rounded-2xl"></div>
            <div class="absolute inset-px bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl"></div>

            <!-- 카드 콘텐츠 -->
            <div class="relative text-center space-y-8">
              <!-- 아이콘 -->
              <div
                class="w-14 h-14 mx-auto bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center border border-slate-600/30"
              >
                <svg class="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>

              <!-- 텍스트 정보 -->
              <div class="space-y-4">
                <h1 class="text-xl font-medium text-white tracking-tight">프리미엄 분석 리포트</h1>
                <div class="text-base text-slate-300 font-normal">접근 권한 획득</div>
                <div class="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                  전문가 분석 리포트와 시장 인사이트에 대한 24시간 무제한 접근
                </div>
              </div>

              <!-- 상태 표시 -->
              <div class="inline-flex items-center px-5 py-2.5 bg-slate-800/50 rounded-lg border border-slate-600/20">
                <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></div>
                <span class="text-sm text-slate-200 font-medium">활성화 완료</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 확인 버튼 -->
        <button
          @click="closeBigBang"
          class="mt-10 px-10 py-3.5 bg-white/8 hover:bg-white/12 text-white font-medium rounded-lg border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20"
        >
          확인
        </button>
      </div>
    </div>

    <!-- 별자리 SVG -->
    <svg viewBox="0 0 800 600" class="w-[420px] h-[420px] max-w-[95vw] object-contain relative z-10">
      <defs>
        <filter id="subtleGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g v-for="constellation in constellations" :key="constellation.id" class="transition-all duration-500 ease-out">
        <!-- 연결선 -->
        <line
          v-for="line in constellation.lines"
          :key="line.id"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          :stroke="activeConstellationIds.includes(constellation.id) ? '#cbd5e1' : '#64748b'"
          :stroke-width="activeConstellationIds.includes(constellation.id) ? '1.5' : '1'"
          :opacity="activeConstellationIds.includes(constellation.id) ? '0.8' : '0.3'"
          filter="url(#subtleGlow)"
          stroke-linecap="round"
        />

        <!-- 별점 -->
        <circle
          v-for="star in constellation.stars"
          :key="star.id"
          :cx="star.x"
          :cy="star.y"
          :r="star.size * 0.8"
          :fill="activeConstellationIds.includes(constellation.id) ? '#f1f5f9' : '#94a3b8'"
          :opacity="activeConstellationIds.includes(constellation.id) ? '0.9' : '0.5'"
          filter="url(#subtleGlow)"
        />
      </g>
    </svg>

    <!-- 진행률 표시 -->
    <div class="mt-8 mb-8 text-center z-10">
      <div class="text-xl font-light text-white tracking-wide">
        {{ activeCount }}<span class="text-slate-500 mx-2">/</span>{{ totalCount }}
      </div>
      <div class="text-xs text-slate-500 mt-2 tracking-wider uppercase">Progress</div>
    </div>

    <!-- 보상 수령 버튼 -->
    <button
      @click="triggerBigBang"
      :disabled="showBigBang"
      class="absolute bottom-28 left-1/2 -translate-x-1/2 px-8 py-3 bg-white/8 hover:bg-white/12 disabled:bg-slate-800/40 text-white font-medium rounded-lg border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed z-20 text-sm"
    >
      보상 수령하기
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";

// 별자리 데이터 (동일)
const constellations = [
  {
    id: 1,
    name: "양자리",
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

// 반응형 변수들
const activeConstellationIds = ref([5]);
const showBigBang = ref(false);
const bigBangStage = ref(0);
const backgroundStars = ref([]);
const sparkles = ref([]);

// 계산된 값들
const activeCount = computed(() => constellations.filter((c) => activeConstellationIds.value.includes(c.id)).length);
const totalCount = computed(() => constellations.length);

// 절제된 배경 별들 생성
const createBackgroundStars = () => {
  backgroundStars.value = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.1,
    delay: Math.random() * 5000,
  }));
};

// 세련된 확산 효과
const triggerBigBang = () => {
  showBigBang.value = true;
  bigBangStage.value = 0;

  // 미세한 파티클 생성
  sparkles.value = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI;
    const distance = Math.random() * 80 + 60;
    return {
      id: i,
      x: 50,
      y: 50,
      moveX: Math.cos(angle) * distance,
      moveY: Math.sin(angle) * distance,
      delay: Math.random() * 300,
      duration: Math.random() * 800 + 1500,
    };
  });

  // 부드러운 단계별 진행
  setTimeout(() => (bigBangStage.value = 1), 100);
  setTimeout(() => (bigBangStage.value = 2), 300);
  setTimeout(() => (bigBangStage.value = 3), 600);
  setTimeout(() => (bigBangStage.value = 4), 900);
  setTimeout(() => (bigBangStage.value = 5), 1200);
  setTimeout(() => (bigBangStage.value = 6), 1600);
};

// 효과 종료
const closeBigBang = () => {
  showBigBang.value = false;
  bigBangStage.value = 0;
  sparkles.value = [];
};

// 초기화
onMounted(() => {
  createBackgroundStars();
});
</script>
