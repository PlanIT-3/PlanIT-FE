<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
    <img
      src="@/assets/images/background.png"
      alt="Result Background"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
      <div class="flex flex-col items-center mb-8">
        <img :src="characterImg" :alt="resultInfo.name" class="w-40 h-40 object-contain" />
        <div class="text-2xl font-extrabold text-center mt-4 text-white">{{ resultInfo.name }}</div>
        <div class="text-lg font-semibold text-center mb-2 text-gray-200">{{ resultInfo.type }}</div>
      </div>

      <div
        class="bg-white/10 border border-white rounded-3xl shadow-lg px-8 py-6 flex flex-col items-start w-[330px] max-w-full mb-4"
      >
        <div class="flex items-center mb-2">
          <span class="text-yellow-400 mr-2">✨</span>
          <div class="text-xl font-bold text-white">핵심 성향</div>
        </div>
        <div class="text-base text-gray-300 leading-relaxed">
          {{ resultInfo.coreDesc }}
        </div>

        <br />

        <div class="flex items-center mb-2">
          <span class="text-yellow-400 mr-2">✨</span>
          <div class="text-xl font-bold text-white">성향 설명</div>
        </div>
        <div class="text-base text-gray-200 leading-relaxed mb-7">
          {{ resultInfo.detailDesc }}
        </div>

        <!-- 버튼 묶음 -->
        <div class="flex w-full justify-between mt-2">
          <button
            type="button"
            class="px-3 py-2 rounded-lg bg-transparent text-gray-100 font-bold shadow border border-white flex-1 mr-2"
            @click="Retry"
          >
            다시하기
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg bg-[#B9AFFF]/70 text-white font-bold shadow border border-white flex-1 ml-2"
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
    coreDesc: "손실을 최소화하고 원금 보전을 최우선으로 생각하는 보수적인 투자자입니다.",
    detailDesc: "예금, 적금, 채권 등 저위험 금융 상품을 선호하며, 안정적인 수익을 추구합니다.",
    img: "creator.svg",
  },
  안정추구형: {
    name: "가이아",
    type: "안정추구형",
    apiType: "STABLE",
    coreDesc: "생명체가 조용히 살아가는 '푸른 행성'처럼, 무리하지 않는 자연진화적 투자를 선호합니다.",
    detailDesc: "손실을 어느 정도 감수하되 여전히 안전성을 중요시하며, 균형 잡힌 투자를 추구합니다.",
    img: "gaia.png",
  },
  위험중립형: {
    name: "루나",
    type: "위험중립형",
    apiType: "NEUTRAL",
    coreDesc: "위험과 수익의 균형을 중시하며, 안정적인 성장과 수익률을 동시에 추구합니다.",
    detailDesc: "다양한 자산에 분산 투자하여 리스크를 관리하며, 시장 상황에 따라 유연하게 대처합니다.",
    img: "luna.svg",
  },
  적극투자형: {
    name: "볼케이노",
    type: "적극투자형",
    apiType: "GROWTH",
    coreDesc: "높은 수익을 위해 일정 수준의 위험도 감수할 수 있는 공격적인 투자자입니다.",
    detailDesc: "주식, 펀드 등 성장 가능성이 높은 상품에 주로 투자하며, 시장의 변동성을 기회로 활용합니다.",
    img: "volcano.svg",
  },
  공격투자형: {
    name: "네뷸라",
    type: "공격투자형",
    apiType: "AGGRESSIVE",
    coreDesc: "최고의 수익을 위해 높은 위험도 마다하지 않는 초공격적인 투자자입니다.",
    detailDesc: "주식, 파생상품, 가상자산 등 고위험/고수익 상품에 주로 투자하며, 공격적인 포트폴리오를 구성합니다.",
    img: "nevula.svg",
  },
};

const resultType = route.query.type || "안전형";
const resultInfo = resultMap[resultType] || resultMap["안전형"];
const characterImg = computed(() => new URL(`../../assets/images/${resultInfo.img}`, import.meta.url).href);

async function goHome() {
  const investType = resultInfo.apiType;

  try {
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
