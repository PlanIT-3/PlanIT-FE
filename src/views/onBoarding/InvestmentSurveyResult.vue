<template>
  <div class="min-h-[852px] w-full flex flex-col items-center justify-center relative overflow-hidden">
    <img
      src="@/assets/images/background.png"
      alt="Result Background"
      class="absolute inset-0 w-full h-[852px] object-cover z-0"
    />
    <div class="relative z-10 flex flex-col items-center justify-center w-full">
      <div class="flex flex-col items-center mb-8">
        <!-- <h1 class="text-3xl font-bold text-white mb-6">나의 투자성향</h1> -->
        <img :src="characterImg" :alt="resultInfo.name" class="w-40 h-40 object-contain" />
      </div>

      <div
        class="bg-white/10 border-white border-1 rounded-3xl shadow-lg px-8 py-8 flex flex-col items-center max-w-xs w-full relative"
      >
        <div class="text-2xl font-extrabold text-center mb-5 text-white">{{ resultInfo.name }}</div>
        <div class="text-lg font-semibold text-center mb-2 text-gray-200">{{ resultInfo.type }}</div>
        <div class="text-base text-center mb-4 text-gray-400">{{ resultInfo.desc }}</div>
        <div class="flex w-full justify-between mt-4">
          <button
            class="px-6 py-2 rounded-lg bg-transparent text-gray-100 font-bold shadow border-white border-1"
            @click="Retry"
          >
            다시하기
          </button>
          <button
            class="px-6 py-2 rounded-lg bg-[#B9AFFF] text-white font-bold shadow border-white border-1"
            @click="goHome"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { saveInvestmentType } from "@/api/surveyApi";

const route = useRoute();
const router = useRouter();

const resultMap = {
  안전형: {
    name: "크레이터",
    type: "안전형",
    apiType: "CONSERVATIVE",
    desc: "안정성과 원금 보전을 최우선으로 생각하는 투자자입니다. 예금, 적금, 채권 등 저위험 상품을 선호합니다.",
    img: "creator.svg",
  },
  안정추구형: {
    name: "가이아",
    type: "안정추구형",
    apiType: "STABLE",
    desc: "안정적인 수익과 약간의 성장 가능성을 추구합니다. 분산 투자와 중위험 상품에 관심이 많습니다.",
    img: "gaia.png",
  },
  위험중립형: {
    name: "루나",
    type: "위험중립형",
    apiType: "NEUTRAL",
    desc: "위험과 수익의 균형을 중시하며, 다양한 자산에 투자하는 것을 선호합니다.",
    img: "luna.svg",
  },
  적극투자형: {
    name: "볼케이노",
    type: "적극투자형",
    apiType: "GROWTH",
    desc: "높은 수익을 위해 일정 수준의 위험도 감수할 수 있는 투자자입니다.",
    img: "volcano.svg",
  },
  공격투자형: {
    name: "네뷸라",
    type: "공격투자형",
    apiType: "AGGRESSIVE",
    desc: "최고의 수익을 위해 높은 위험도 마다하지 않는 투자자입니다. 주식, 파생상품, 가상자산 등 고위험 상품에 관심이 많습니다.",
    img: "nevula.svg",
  },
  김동윤: {
    name: "김동윤",
    type: "리더형",
    apiType: "KIM",
    desc: "팀의 리더로서, 팀원들을 이끌고 목표를 달성하는 데 중점을 둡니다. 팀워크와 협업을 중요시하며, 팀의 성공을 위해 헌신합니다. 진짜입니다. 김동윤은 팀의 중심이자, 모든 팀원들에게 영감을 주는 존재입니다.",
    img: "KIM.png",
  },
};

const resultType = route.query.type || "안전형";
const resultInfo = resultMap[resultType] || resultMap["안전형"];
const characterImg = computed(() => new URL(`../../assets/images/${resultInfo.img}`, import.meta.url).href);

async function goHome() {
  const investType = resultInfo.apiType;

  try {
    // api 유틸리티를 사용해 POST 요청
    const response = await saveInvestmentType(investType);

    if (response.status === 200) {
      console.log("투자 성향이 성공적으로 저장되었습니다.");
      router.push("/");
    }
  } catch (error) {
    console.error("투자 성향 저장 중 오류가 발생했습니다:", error);
    alert("오류가 발생했습니다. 다시 시도해 주세요.");
  }
}
function Retry() {
  router.push("/investment-survey");
}
</script>

<style scoped>
.bg-blur {
  backdrop-filter: blur(8px);
}
</style>
