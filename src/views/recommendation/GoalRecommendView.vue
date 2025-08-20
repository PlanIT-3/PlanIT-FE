<template>
  <div>
    <!-- 나의 투자 내역 -->
    <div class="mb-8 custom-scroll">
      <h4 class="text-base font-semibold text-gray-800 mb-4">나의 투자 내역</h4>

      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">로딩 중...</div>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>

      <div v-else class="space-y-4 max-h-60 overflow-y-auto">
        <div v-for="(item, index) in investmentData" :key="index" class="bg-white border-b border-gray-300 p-2">
          <div class="flex justify-between items-start mb-1 gap-1">
            <div class="flex-1">
              <h5 class="font-semibold text-gray-800 text-sm mb-1">{{ item.itemName }}</h5>
              <div class="text-xs text-gray-600">
                {{ item.quantity }}주 · 현재가 {{ formatNumber(item.valuationAmount) }}원
              </div>
            </div>
            <div class="text-right">
              <div class="text-base font-semibold text-gray-800 mb-1">
                {{ formatNumber(item.totalValuationAmount) }}원
              </div>
              <div
                :class="[
                  'text-sm font-medium flex items-center justify-end',
                  item.earningsRate >= 0 ? 'text-green-600' : 'text-red-600',
                ]"
              >
                <span :class="item.earningsRate >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ item.earningsRate >= 0 ? "↗" : "↘" }}
                </span>
                <span class="ml-1"> {{ item.earningsRate >= 0 ? "+" : "" }}{{ item.earningsRate.toFixed(2) }}% </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 리밸런싱 -->
    <div class="mb-4">
      <h4 class="text-base font-semibold text-gray-800 mb-3">목표별 최대 수익 상품 추천</h4>

      <div v-if="rebalanceLoading" class="text-center py-8">
        <div class="text-gray-500">리밸런싱 데이터 로딩 중...</div>
      </div>

      <div v-else-if="rebalanceError" class="text-center py-8">
        <div class="text-red-500">리밸런싱 데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>

      <div v-else class="space-y-4">
        <template v-for="goal in rebalanceData" :key="goal.goalName">
          <div v-if="goal.rebalanceInfo && goal.rebalanceInfo.length > 0">
            <template v-for="rebalanceItem in goal.rebalanceInfo" :key="rebalanceItem.memberProductId">
              <RebalanceCard
                :goal="goal.goalName"
                :PreProd="rebalanceItem.previousProductName"
                :NextProd="rebalanceItem.nextProductName"
                :expected-yield="rebalanceItem.expectedReturnRate.toFixed(2) + '%'"
                :risk-level="getRiskLevel(rebalanceItem.investType)"
                :risk-color="getRiskColor(rebalanceItem.investType)"
                :comment="parseComment(rebalanceItem.comment).part1"
                :comment2="parseComment(rebalanceItem.comment).part2"
              />
            </template>
          </div>
        </template>

        <div
          v-if="
            rebalanceData.length === 0 ||
            rebalanceData.every((goal) => !goal.rebalanceInfo || goal.rebalanceInfo.length === 0)
          "
          class="text-center py-8"
        >
          <div class="text-gray-500">현재 추천할 리밸런싱이 없습니다.</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import RebalanceCard from "@/components/goal/RebalanceCard.vue";
import { ref, onMounted } from "vue";
import { fetchInvestmentData, fetchYieldData } from "@/api/rebalanceApi";

// 리밸런싱 기간
const periods = ref(["한달", "3개월", "6개월", "1년"]);
const selectedPeriod = ref("한달");

// 투자 내역 데이터
const investmentData = ref([]);
const loading = ref(false);
const error = ref(false);

// 리밸런싱 데이터
const rebalanceData = ref([]);
const rebalanceLoading = ref(false);
const rebalanceError = ref(false);

// 숫자 포맷팅 함수
const formatNumber = (number) => {
  return new Intl.NumberFormat("ko-KR").format(Math.floor(number));
};

// API 호출 함수
const loadInvestmentData = async () => {
  loading.value = true;
  error.value = false;

  try {
    const data = await fetchInvestmentData();
    investmentData.value = data;
  } catch (err) {
    console.error("투자 내역 조회 실패:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// 목 데이터
const mockRebalanceData = {
  code: "GEN-000",
  message: "Success!",
  status: "OK",
  data: {
    rebalancingInfo: [
      {
        goalName: "테스트",
        rebalanceInfo: [],
      },
      {
        goalName: "test",
        rebalanceInfo: [
          {
            productCode: "0023A0",
            memberProductId: 25940,
            goalId: 18092,
            comment: "만약 이 상품으로 교체했다면,\n수익이 +4.13%p 높아지고\n구조 지표는 1034만큼 개선됐을 거예요.",
            expectedReturnRate: -14.36,
            previousProductName: "KBSTAR 팔라듐선물(H)",
            nextProductName: "SOL 미국양자컴퓨팅TOP10",
            investType: "MODERATE",
          },
        ],
      },
      {
        goalName: "goalname1-2",
        rebalanceInfo: [
          {
            productCode: "0007N0",
            memberProductId: 25941,
            goalId: 8093,
            comment: "만약 이 상품으로 교체했다면,\n수익이 +4.13%p 높아지고\n구조 지표는 1034만큼 개선됐을 거예요.",
            expectedReturnRate: -0.52,
            previousProductName: "TIGER 글로벌멀티에셋TIF액티브",
            nextProductName: "아이엠에셋 200",
            investType: "CONSERVATIVE",
          },
        ],
      },
      {
        goalName: "goalname1-1",
        rebalanceInfo: [
          {
            productCode: "0007N0",
            memberProductId: 25939,
            goalId: 8092,
            comment: "만약 이 상품으로 교체했다면,\n수익이 +4.13%p 높아지고\n구조 지표는 1034만큼 개선됐을 거예요.",
            expectedReturnRate: -0.52,
            previousProductName: "KODEX Top5PlusTR",
            nextProductName: "아이엠에셋 200",
            investType: "CONSERVATIVE",
          },
        ],
      },
    ],
  },
};

// comment를 분리하는 함수
const parseComment = (commentText) => {
  const lines = commentText.split("\n");
  const part1 = lines[0] || "";
  const part2 = lines.slice(1).join("\n");
  return { part1, part2 };
};

// 리밸런싱 데이터 로드
const loadRebalanceData = async () => {
  rebalanceLoading.value = true;
  rebalanceError.value = false;

  try {
    // 목 데이터 사용
    rebalanceData.value = mockRebalanceData.data.rebalancingInfo || [];
    console.log("리밸런싱 데이터:", rebalanceData.value);

    // 실제 API 사용시 아래 주석 해제
    // const response = await fetchYieldData();
    // rebalanceData.value = response.data.rebalancingInfo || [];
  } catch (err) {
    console.error("수익률 추천 데이터 조회 실패:", err);
    rebalanceError.value = true;
  } finally {
    rebalanceLoading.value = false;
  }
};

// 위험도 색상 매핑
const getRiskColor = (investType) => {
  switch (investType) {
    case "CONSERVATIVE":
      return "text-green-600";
    case "MODERATE":
      return "text-orange-600";
    case "AGGRESSIVE":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

// 위험도 레벨 텍스트 매핑
const getRiskLevel = (investType) => {
  switch (investType) {
    case "CONSERVATIVE":
      return "낮음";
    case "MODERATE":
      return "중간";
    case "AGGRESSIVE":
      return "높음";
    default:
      return "알수없음";
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadInvestmentData();
  loadRebalanceData();
});
</script>
<style scoped>
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scroll::-webkit-scrollbar {
  width: 4px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 2px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

.custom-scroll::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
