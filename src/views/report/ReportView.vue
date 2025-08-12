<template>
  <DefaultLayout>
    <div class="flex flex-col w-full">
      <!-- 투자 리포트 박스: 흰배경, 둥근 모서리, 회색 테두리 -->
      <div class="bg-white mb-4">
        <div class="flex flex-col items-center">
          <div class="flex items-center mb-2">
            <span class="inline-block w-6 h-6 mr-2">
              <span class="text-2xl">📊</span>
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
          <span class="text-base">💳</span> ISA 리포트
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
          <span class="text-base">📊</span> 투자 리포트
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

const activeTab = ref("investment");
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
