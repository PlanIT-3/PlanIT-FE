<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
    <!-- 배경 이미지 -->
    <img src="@/assets/images/invest-survey/ResultBack.png" alt="Result Background" class="absolute inset-0 w-full h-full object-cover z-0" />
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
      <div class="bg-white/80 rounded-3xl shadow-lg px-8 py-10 flex flex-col items-center max-w-md w-full mt-16 relative pt-24">
        <img :src="characterImg" :alt="resultInfo.name" class="w-40 h-40 object-contain absolute left-1/2 -translate-x-1/2 -top-20 z-10" />
        <div class="text-2xl font-extrabold text-center mb-2">{{ resultInfo.name }}</div>
        <div class="text-lg font-semibold text-gray-700 text-center mb-1">{{ resultInfo.type }}</div>
        <div class="text-base text-gray-600 text-center mb-4">{{ resultInfo.desc }}</div>
        <button class="mt-4 px-6 py-2 rounded-lg bg-[#B9AFFF] text-white font-bold shadow" @click="goHome">홈으로</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const resultMap = {
  '안전형': {
    name: '크레이터',
    type: '안전형',
    desc: '안정성과 원금 보전을 최우선으로 생각하는 투자자입니다. 예금, 적금, 채권 등 저위험 상품을 선호합니다.',
    img: 'Crater.png',
  },
  '안정추구형': {
    name: '가이아',
    type: '안정추구형',
    desc: '안정적인 수익과 약간의 성장 가능성을 추구합니다. 분산 투자와 중위험 상품에 관심이 많습니다.',
    img: 'Gaia.png',
  },
  '위험중립형': {
    name: '루나',
    type: '위험중립형',
    desc: '위험과 수익의 균형을 중시하며, 다양한 자산에 투자하는 것을 선호합니다.',
    img: 'Lunar.png',
  },
  '적극투자형': {
    name: '볼케이노',
    type: '적극투자형',
    desc: '높은 수익을 위해 일정 수준의 위험도 감수할 수 있는 투자자입니다.',
    img: 'Volcano.png',
  },
  '공격투자형': {
    name: '네뷸라',
    type: '공격투자형',
    desc: '최고의 수익을 위해 높은 위험도 마다하지 않는 투자자입니다. 주식, 파생상품, 가상자산 등 고위험 상품에 관심이 많습니다.',
    img: 'Nebula.png',
  },
};

const resultType = route.query.type || '안전형';
const resultInfo = resultMap[resultType] || resultMap['안전형'];
const characterImg = computed(() => new URL(`../../assets/images/invest-survey/${resultInfo.img}`, import.meta.url).href);

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.bg-blur {
  backdrop-filter: blur(8px);
}
</style> 