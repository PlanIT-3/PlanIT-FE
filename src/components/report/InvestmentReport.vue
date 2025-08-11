<template>
  <div class="w-full max-w-xl flex flex-col gap-4">
    <GraphBox :title="title1" v-model:period="period1"> [그래프 영역] </GraphBox>
    <GraphBox :title="title2" v-model:period="period2">
      <DailyInvestmentChart 
        v-if="investmentData" 
        :data="investmentData" 
        :period="period2" 
        :chart-type="getChartType(period2)" 
      />
      <div v-else class="flex items-center justify-center h-32 text-gray-400">
        데이터를 불러오는 중...
      </div>
    </GraphBox>
    <GraphBoxNonPeriod title="투자 성향 vs 실제 투자 행동">
      <RadarChart :survey-data="investScoreData?.surveyInvestmentType" :real-data="investScoreData?.realInvestType" />
    </GraphBoxNonPeriod>
    <InvestAiAdvice />

    <GraphBoxNonPeriod title="월별 권장 투자 금액">
      <MonthlyRecommendChart 
        :monthly-data="monthlyData || {}" 
        :recommend-data="recommendData || {}" 
      />
    </GraphBoxNonPeriod>
    
    <InvestmentAdviceBox 
      :advice="recommendData?.investmentAdvice || ''" 
      :loading="recommendLoading"
      :error="recommendError"
      @retry="fetchRecommendData"
    />
  </div>
</template>

<script setup>
import GraphBox from "@/components/report/GraphBox.vue";
import GraphBoxNonPeriod from "@/components/report/GraphBoxNonPeriod.vue";
import RadarChart from "@/components/report/RadarChart.vue";
import InvestAiAdvice from "@/components/report/InvestAiAdvice.vue";
import DailyInvestmentChart from "@/components/report/DailyInvestmentChart.vue";
import MonthlyRecommendChart from "@/components/report/MonthlyRecommendChart.vue";
import InvestmentAdviceBox from "@/components/report/InvestmentAdviceBox.vue";
import api from "@/api";
import { ref, computed, onMounted, watch } from "vue";

const period1 = ref("weekly");
const period2 = ref("weekly");
const investScoreData = ref(null);
const investmentData = ref(null);
const monthlyData = ref(null);
const recommendData = ref(null);
const recommendLoading = ref(false);
const recommendError = ref(false);

const periodMap = {
  daily: "일별",
  weekly: "주별",
  monthly: "월별",
};

const title1 = computed(() => {
  return `${periodMap[period1.value] || "주별"} 수익률 변화`;
});

const title2 = computed(() => {
  return `${periodMap[period2.value] || "주별"} 투자금 총액 비교`;
});

const getChartType = (period) => {
  return period === 'daily' ? 'daily' : period === 'monthly' ? 'monthly' : 'weekly';
};

const fetchInvestScore = async () => {
  try {
    const response = await api.get("/auth/api/member/invest-score");
    investScoreData.value = response.data.data;
  } catch (error) {
    console.error("투자 성향 데이터 가져오기 실패:", error);
  }
};

const fetchInvestmentData = async (period) => {
  try {
    const response = await api.get(`/api/reports/returns/total/${period}`);
    investmentData.value = response.data;
  } catch (error) {
    console.error(`${period} 투자 데이터 가져오기 실패:`, error);
  }
};

const fetchMonthlyData = async () => {
  try {
    const response = await api.get('/api/reports/returns/total/monthly');
    monthlyData.value = response.data;
  } catch (error) {
    console.error('월별 투자 데이터 가져오기 실패:', error);
  }
};

const fetchRecommendData = async () => {
  recommendLoading.value = true;
  recommendError.value = false;
  
  try {
    const response = await api.get('/api/openai/recommendated-investment');
    recommendData.value = response.data;
  } catch (error) {
    console.error('권장 투자 데이터 가져오기 실패:', error);
    recommendError.value = true;
  } finally {
    recommendLoading.value = false;
  }
};

// period2 변경 시 데이터 다시 가져오기
watch(period2, (newPeriod) => {
  fetchInvestmentData(newPeriod);
}, { immediate: false });

onMounted(() => {
  fetchInvestScore();
  fetchInvestmentData(period2.value);
  fetchMonthlyData();
  fetchRecommendData();
});
</script>
