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

    <!-- 푸터 -->
    <div class="text-center text-[9px] text-gray-400">* 리밸런싱 제안은 시장 상황에 따라 변경될 수 있습니다.</div>
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

// 목표별 그룹핑
const groupedData = computed(() => {
  return apiData.value.reduce((acc, item) => {
    if (!acc[item.goalName]) acc[item.goalName] = [];
    acc[item.goalName].push(item);
    return acc;
  }, {});
});
</script>
