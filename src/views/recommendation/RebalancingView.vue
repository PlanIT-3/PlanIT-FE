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
      <h4 class="text-base font-semibold text-gray-800 mb-3">특정 기간 리밸런싱</h4>
      <div class="flex gap-2 mb-4">
        <button
          v-for="period in periods"
          :key="period"
          @click="selectedPeriod = period"
          :class="[
            'px-3 py-1 text-xs rounded-md border transition-colors',
            selectedPeriod === period
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ period }}
        </button>
      </div>
      <RebalanceCard
        title="한달"
        expected-yield="8.2%"
        yield-change="1.5%"
        goal-period="6개월"
        risk-level="중간"
        risk-color="text-orange-600"
        comment="현재 포트폴리오 비중이 목표와 잘 맞습니다."
        comment-emoji="✅"
      />
    </div>

    <!-- 포트폴리오 & 코인 -->
    <div class="mb-4">
      <h4 class="text-base font-semibold text-gray-800 mb-3">QQQ + QLD 포트폴리오</h4>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">예상 수익률:</span>
            <span class="font-semibold text-green-600 ml-2">4.3%</span>
          </div>
          <div>
            <span class="text-gray-600">4.5개월:</span>
            <span class="font-semibold ml-2">목표 달성</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="text-base font-semibold text-gray-800 mb-3">코인 보유 종목</h4>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-600">비중:</span>
            <span class="font-semibold ml-2">15.0%</span>
          </div>
          <div>
            <span class="text-gray-600">4.3%:</span>
            <span class="font-semibold text-orange-600 ml-2">위험도 높음</span>
          </div>
          <div>
            <span class="text-gray-600">현재 보유:</span>
            <span class="font-semibold text-red-600 ml-2">주의 필요</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import RebalanceCard from "@/components/goal/RebalanceCard.vue";
import { ref, onMounted } from "vue";
import api from "@/api";

// 리밸런싱 기간
const periods = ref(["한달", "3개월", "6개월", "1년"]);
const selectedPeriod = ref("한달");

// 투자 내역 데이터
const investmentData = ref([]);
const loading = ref(false);
const error = ref(false);

// 숫자 포맷팅 함수
const formatNumber = (number) => {
  return new Intl.NumberFormat("ko-KR").format(Math.floor(number));
};

// API 호출 함수
const fetchInvestmentData = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await api.get("/auth/rebalance/invest/info");
    investmentData.value = response.data;
  } catch (err) {
    console.error("투자 내역 조회 실패:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchInvestmentData();
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
