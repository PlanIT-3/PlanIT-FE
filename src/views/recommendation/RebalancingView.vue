<template>
  <div class="space-y-4">
    <!-- 헤더 -->
    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">리밸런싱 제안</h1>
          <p class="text-xs text-gray-500 mt-1">포트폴리오 최적화</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-500">총 제안</div>
          <div class="text-sm font-bold text-gray-900">{{ apiData.length }}건</div>
        </div>
      </div>
    </div>

    <!-- 목표별 섹션 -->
    <div class="space-y-4">
      <div
        v-for="(items, goalName) in groupedData"
        :key="goalName"
        class="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <!-- 목표 헤더 -->
        <div class="bg-gray-50 p-2 border-b border-gray-200 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-900">{{ goalName }}</h2>
            <span class="text-xs text-gray-500">{{ items.length }}개</span>
          </div>
        </div>

        <!-- 제안 카드 -->
        <div class="p-3 space-y-3">
          <div
            v-for="item in items"
            :key="item.mpCode"
            class="border border-gray-200 rounded-lg p-3 hover:shadow transition-shadow bg-white"
          >
            <!-- 카드 헤더 -->
            <div class="flex items-center justify-between mb-3">
              <div
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium text-white',
                  item.action === 'BUY' ? 'bg-emerald-500' : 'bg-rose-500',
                ]"
              >
                {{ item.action === "BUY" ? "매수" : "매도" }}
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-semibold text-gray-900">{{ item.mpName }}</h3>
                <p class="text-[10px] text-gray-500">{{ item.mpCode }}</p>
              </div>
            </div>

            <!-- 금액 정보 -->
            <div class="grid grid-cols-2 gap-2 mb-3">
              <InfoCard title="현재 투자금액" :value="item.mpTotal" />
              <InfoCard title="ISA 목표금액" :value="item.targetIsaAmount" />
              <InfoCard :title="item.action === 'BUY' ? '매수 필요금액' : '매도 필요금액'" :value="item.tradeAmount" />
              <InfoCard title="사용가능 현금" :value="item.deposit" />
            </div>

            <!-- 제안 이유 -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <p class="text-xs text-gray-600">{{ item.reason }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

<<<<<<< HEAD
    <!-- 푸터 -->
    <div class="text-center text-[9px] text-gray-400">* 리밸런싱 제안은 시장 상황에 따라 변경될 수 있습니다.</div>
=======
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
>>>>>>> c4b6b08 (feat: 상품 목표별 추천)
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import InfoCard from "@/components/rebalance/InfoCard.vue";

import { getRebalance } from "@/api/rebalanceApi";

// API 데이터 저장
// const apiData = ref([]);

// 컴포넌트 마운트 시 데이터 불러오기
// onMounted(async () => {
//   try {
//     const result = await getRebalance();
//     apiData.value = result; // API에서 받아온 데이터 저장
//     console.log("리밸런싱 데이터:", result);
//   } catch (error) {
//     console.error("리밸런싱 데이터 불러오기 실패:", error);
//   }
// });

// 목표별 그룹핑
// const groupedData = computed(() => {
//   return apiData.value.reduce((acc, item) => {
//     if (!acc[item.goalName]) acc[item.goalName] = [];
//     acc[item.goalName].push(item);
//     return acc;
//   }, {});
// });

<<<<<<< HEAD
// 임시 데이터
const apiData = ref([
  {
    goalName: "goalname1-2",
    action: "SELL",
    mpName: "ACE 중장기국공채액티브",
    mpCode: "KR7272910001",
    tradeAmount: 2130603,
    targetIsaAmount: 2457982,
    mpTotal: 4588585.0,
    deposit: 327378.5,
    reason: "ISA 목표금액 초과 → 수익률 높은 종목 매도",
=======
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
            comment: "만약 이 상품으로 교체했다면,\n수익이 +4.13%p 높아지고\n구조 지표는 1034원만큼 개선됐을 거예요.",
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
>>>>>>> c4b6b08 (feat: 상품 목표별 추천)
  },
  {
    goalName: "goalname1-1",
    action: "BUY",
    mpName: "KBSTAR Fn창업투자회사",
    mpCode: "KR7427110002",
    tradeAmount: 75392,
    targetIsaAmount: 251987,
    mpTotal: 176595.0,
    deposit: 327378.5,
    reason: "ISA 목표금액 미달 → 수익률 높은 종목 매수",
  },
]);

<<<<<<< HEAD
// 목표별 그룹핑
const groupedData = computed(() => {
  return apiData.value.reduce((acc, item) => {
    if (!acc[item.goalName]) acc[item.goalName] = [];
    acc[item.goalName].push(item);
    return acc;
  }, {});
=======
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
>>>>>>> c4b6b08 (feat: 상품 목표별 추천)
});
</script>
