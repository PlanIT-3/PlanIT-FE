<template>
  <MainLayout :chart-option="chartOption" :total-balance="totalBalance" :goal-count="goalRatioData.length">
    <div>
      <GoalSliderCard :goal-list="goalListData" />
      <InvestmentStatusChart />

      <!-- Investment Status Section -->
      <div class="w-full bg-white rounded-2xl shadow-lg p-5">
        <!-- Header -->
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center">
            <div class="text-indigo-600 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-800 whitespace-nowrap">일일 계좌 총 잔고 추이</h3>
          </div>
          <button class="text-xs text-indigo-600 font-medium whitespace-nowrap">전체보기</button>
        </div>

        <!-- Time Period Toggle Buttons -->
        <div class="flex justify-center space-x-1 bg-gray-100 rounded-lg p-1 -mb-6 relative z-10">
          <button
            @click="selectPeriod('daily')"
            :class="[
              'w-full py-1 text-xs rounded-md transition-colors duration-200',
              selectedPeriod === 'daily' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-200',
            ]"
          >
            일
          </button>
          <button
            @click="selectPeriod('weekly')"
            :class="[
              'w-full py-1 text-xs rounded-md transition-colors duration-200',
              selectedPeriod === 'weekly' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-200',
            ]"
          >
            주
          </button>
          <button
            @click="selectPeriod('monthly')"
            :class="[
              'w-full py-1 text-xs rounded-md transition-colors duration-200',
              selectedPeriod === 'monthly' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-200',
            ]"
          >
            월
          </button>
        </div>

        <!-- Investment Chart -->
        <div class="h-[150px]">
          <VChart :option="investmentChartOption" autoresize />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import MainLayout from "@/components/layouts/MainLayout.vue";
import GoalSliderCard from "@/components/goal/GoalSliderCard.vue";
import InvestmentStatusChart from "@/components/investment/InvestmentStatusChart.vue";
import mainApi from "@/api/mainApi";
import goalApi from "@/api/goalApi";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

// API에서 받아온 목표 비율 데이터
const goalRatioData = ref([]);
const totalBalance = ref(0);
// 목표 리스트 데이터
const goalListData = ref([]);

// 일자 버튼 클릭 시 API 호출
const fetchDailyData = async () => {
  try {
    const data = await mainApi.getPeriod("day");
    if (data.status === "OK" && data.data && data.data.balanceResList) {
      dailyData.value = data.data.balanceResList;
      updateInvestmentChart();
    }
  } catch (error) {
    console.error("일별 데이터 불러오기 실패:", error);
  }
};

// 주 버튼 클릭 시 API 호출
const fetchWeeklyData = async () => {
  try {
    const data = await mainApi.getPeriod("week");
    if (data.status === "OK" && data.data && data.data.balanceResList) {
      weeklyData.value = data.data.balanceResList;
      updateInvestmentChart();
    }
  } catch (error) {
    console.error("주별 데이터 불러오기 실패:", error);
  }
};

// 월 버튼 클릭 시 API 호출
const fetchMonthlyData = async () => {
  try {
    const data = await mainApi.getPeriod("month");
    if (data.status === "OK" && data.data && data.data.balanceResList) {
      monthlyData.value = data.data.balanceResList;
      updateInvestmentChart();
    }
  } catch (error) {
    console.error("월별 데이터 불러오기 실패:", error);
  }
};

// 목표 비율 데이터 API 호출
const fetchGoalRatioData = async () => {
  try {
    const data = await mainApi.getGoalRatio();
    if (data.status === "OK" && data.data) {
      totalBalance.value = data.data.totalBalance;
      goalRatioData.value = data.data.goalRatios;
      updateChartOption();
    }
  } catch (error) {
    console.error("목표 비율 데이터 불러오기 실패:", error);
  }
};

// 목표 리스트 데이터 API 호출
const fetchGoalListData = async () => {
  try {
    const data = await goalApi.getGoalList();
    if (data.status === "OK" && data.data) {
      goalListData.value = data.data;
    }
  } catch (error) {
    console.error("목표 리스트 데이터 불러오기 실패:", error);
  }
};

// 페이지 로드 시 일자 데이터 자동 로드
onMounted(() => {
  fetchDailyData();
  fetchGoalListData();
  fetchGoalRatioData();
});

const chartOption = ref({
  tooltip: {
    trigger: "item",
    formatter: (params) => `목표 현황<br/>${params.name}: ${params.value}%`,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderColor: "#ccc",
    borderWidth: 1,
    textStyle: {
      color: "#fff",
      fontSize: 13,
    },
  },
  series: [
    {
      name: "목표 현황",
      type: "pie",
      radius: ["35%", "65%"],
      center: ["40%", "50%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 2,
        borderColor: "#fff",
        borderWidth: 2,
        shadowBlur: 8,
        shadowColor: "rgba(0, 0, 0, 0.1)",
      },
      label: { show: false },
      data: [],
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: () => Math.random() * 200,
    },
  ],
});

// 도넛 차트 데이터 업데이트
const updateChartOption = () => {
  if (goalRatioData.value.length > 0) {
    const chartColors = [
      "#8b5cf6", // 보라
      "#10b981", // 초록
      "#eab308", // 노랑
      "#f59e0b", // 주황
      "#059669", // 진한 초록
      "#3b82f6", // 파랑
      "#06b6d4", // 청록
      "#ef4444", // 빨강
      "#f97316", // 주황
      "#84cc16", // 연두
      "#06b6d4", // 청록
      "#8b5cf6", // 보라
      "#f59e0b", // 주황
      "#eab308", // 노랑
      "#ef4444", // 빨강
      "#f97316", // 주황
    ];

    const chartData = goalRatioData.value.map((item, index) => ({
      value: item.ratio,
      name: item.objectName,
      itemStyle: { color: chartColors[index % chartColors.length] },
    }));

    chartOption.value.series[0].data = chartData;
  }
};
</script>
