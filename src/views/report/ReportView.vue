<template>
  <DefaultLayout>
    <div class="flex flex-col w-full">
      <!-- 투자 리포트 박스: 흰배경, 둥근 모서리, 회색 테두리 -->
      <div class="bg-white mb-4">
        <div class="flex flex-col items-center">
          <div class="flex items-center mb-2">
            <span class="inline-block w-6 h-6 mr-2">
              <!-- 차트/분석 아이콘 -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <h1 class="text-2xl font-bold">투자 리포트</h1>
          </div>
          <div class="text-gray-400 text-sm mb-4">2025년 7월 기준 · 개인 투자 현황 분석</div>
        </div>
        <!-- 목표별 달성률 영역 -->
        <div class="w-full p-6 border border-gray-200 rounded-2xl">
          <GoalAchievementChart :goals="goals" />
        </div>
      </div>

      <!-- 탭 버튼 -->
      <div class="flex justify-center gap-2 mb-4">
        <button
          @click="setActiveTab('isa')"
          :class="[
            'px-6 py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors text-sm',
            activeTab === 'isa'
              ? 'bg-blue-100 text-blue-600 border-blue-300'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200',
          ]"
        >
          <!-- 신용카드/계좌 아이콘 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          ISA 리포트
        </button>
        <button
          @click="setActiveTab('investment')"
          :class="[
            'px-6 py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors text-sm',
            activeTab === 'investment'
              ? 'bg-blue-100 text-blue-600 border-blue-300'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200',
          ]"
        >
          <!-- 차트/투자 아이콘 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          투자 리포트
        </button>
      </div>
    </div>

    <!-- 탭별 컨텐츠 -->
    <div v-if="activeTab === 'investment'">
      <InvestmentReport />
    </div>
    <div v-else-if="activeTab === 'isa'">
      <IsaReport />
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import CircleProgress from "@/components/report/CircleProgress.vue";
import InvestmentReport from "@/components/report/InvestmentReport.vue";
import GoalAchievementChart from "@/components/report/GoalAchievementChart.vue";
import IsaReport from "@/components/report/IsaReport.vue";
import { ref, onMounted } from "vue";
import api from "@/api";
import TaxSavingsSummary from "@/components/report/TaxSavingsSummary.vue";

const activeTab = ref("isa");
const goals = ref([]);
const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#F97316"];

const fetchGoals = async () => {
  try {
    const response = await api.get("/auth/api/goals");
    goals.value = response.data.data.slice(0, 4).map((goal, index) => ({
      name: goal.goalName,
      value: goal.totalAmount || 0,
      total: goal.targetAmount,
      percent: goal.goalRate || 0,
      color: colors[index % colors.length],
    }));
  } catch (error) {
    console.error("목표 데이터를 가져오는데 실패했습니다:", error);
  }
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

onMounted(() => {
  fetchGoals();
});
</script>
