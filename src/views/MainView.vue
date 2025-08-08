<template>
  <MainLayout :chart-option="chartOption">
    <div>
      <GoalSliderCard />

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
import { ref } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { onMounted } from "vue";

import MainLayout from "@/components/layouts/MainLayout.vue";
import GoalSliderCard from "@/components/goal/GoalSliderCard.vue";

use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const selectedPeriod = ref("daily");

// API에서 받아온 daily 데이터
const dailyData = ref([]);
// API에서 받아온 weekly 데이터
const weeklyData = ref([]);
// API에서 받아온 monthly 데이터
const monthlyData = ref([]);

// 일자 버튼 클릭 시 API 호출
const fetchDailyData = async () => {
  try {
    const response = await fetch("http://localhost:8080/auth/api/account/day");
    const json = await response.json();
    if (json.status === "OK" && json.data && json.data.balanceResList) {
      dailyData.value = json.data.balanceResList;
      updateInvestmentChart();
    }
  } catch (error) {
    console.error("일별 데이터 불러오기 실패:", error);
  }
};

// 주 버튼 클릭 시 API 호출
const fetchWeeklyData = async () => {
  try {
    const response = await fetch("http://localhost:8080/auth/api/account/week");
    const json = await response.json();
    if (json.status === "OK" && json.data && json.data.balanceResList) {
      weeklyData.value = json.data.balanceResList;
      updateInvestmentChart();
    }
  } catch (error) {
    console.error("주별 데이터 불러오기 실패:", error);
  }
};

// 월 버튼 클릭 시 API 호출
const fetchMonthlyData = async () => {
  try {
    const response = await fetch("http://localhost:8080/auth/api/account/month");
    const json = await response.json();
    if (json.status === "OK" && json.data && json.data.balanceResList) {
      monthlyData.value = json.data.balanceResList;
      updateInvestmentChart();
    }
  } catch (error) {
    console.error("월별 데이터 불러오기 실패:", error);
  }
};

// 페이지 로드 시 일자 데이터 자동 로드
onMounted(() => {
  fetchDailyData();
});

const investmentData = {
  daily: {
    labels: ["-6일", "-5일", "-4일", "-3일", "-2일", "-1일", "오늘"],
    returns: [7.5, 7.8, 8.0, 7.9, 8.2, 8.1, 8.2],
    avgReturns: [7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.15],
  },
  weekly: {
    labels: ["-6주", "-5주", "-4주", "-3주", "-2주", "-1주", "이번주"],
    returns: [5.5, 6.2, 6.8, 7.0, 7.5, 8.0, 8.2],
    avgReturns: [5.8, 6.0, 6.5, 6.8, 7.2, 7.6, 7.9],
  },
  monthly: {
    labels: ["-6달", "-5달", "-4달", "-3달", "-2달", "-1달", "이번달"],
    returns: [2.1, 3.5, 4.0, 5.8, 6.5, 7.2, 8.2],
    avgReturns: [2.5, 3.0, 3.8, 4.9, 5.8, 6.8, 7.5],
  },
};

const investmentChartOption = ref({});

const selectPeriod = (period) => {
  selectedPeriod.value = period;
  if (period === "daily") {
    fetchDailyData();
  } else if (period === "weekly") {
    fetchWeeklyData();
  } else if (period === "monthly") {
    fetchMonthlyData();
  } else {
    updateInvestmentChart();
  }
};

const updateInvestmentChart = () => {
  let data;

  if (selectedPeriod.value === "daily" && dailyData.value.length > 0) {
    // API에서 받아온 daily 데이터 사용
    const labels = dailyData.value.map((item) => {
      const date = new Date(item.createdAt);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const amounts = dailyData.value.map((item) => Math.round(item.amount / 10000)); // 만원 단위로 변환

    data = {
      labels: labels,
      returns: amounts,
    };
  } else if (selectedPeriod.value === "weekly" && weeklyData.value.length > 0) {
    // API에서 받아온 weekly 데이터 사용
    const labels = weeklyData.value.map((item) => {
      const date = new Date(item.createdAt);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const amounts = weeklyData.value.map((item) => Math.round(item.amount / 10000)); // 만원 단위로 변환

    data = {
      labels: labels,
      returns: amounts,
    };
  } else if (selectedPeriod.value === "monthly" && monthlyData.value.length > 0) {
    // API에서 받아온 monthly 데이터 사용
    const labels = monthlyData.value.map((item) => {
      const date = new Date(item.createdAt);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const amounts = monthlyData.value.map((item) => Math.round(item.amount / 10000)); // 만원 단위로 변환

    data = {
      labels: labels,
      returns: amounts,
    };
  } else {
    // 기존 mock 데이터 사용
    data = investmentData[selectedPeriod.value];
  }

  investmentChartOption.value = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const date = params.name || params.axisValue;
        const value = params.value;
        let tooltip = `<div style="font-weight: bold; margin-bottom: 5px;">${date}</div>`;
        if (
          selectedPeriod.value === "daily" ||
          selectedPeriod.value === "weekly" ||
          selectedPeriod.value === "monthly"
        ) {
          tooltip += `<div style="margin: 2px 0;">잔고: <span style="color: #3b82f6; font-weight: bold;">${value.toLocaleString()}만원</span></div>`;
        } else {
          tooltip += `<div style="margin: 2px 0;">수익률: <span style="color: #3b82f6; font-weight: bold;">${value}%</span></div>`;
        }
        return tooltip;
      },
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#3b82f6",
      borderWidth: 2,
      textStyle: { color: "#333", fontSize: 13 },
      padding: [8, 12],
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.labels,
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter:
          selectedPeriod.value === "daily" || selectedPeriod.value === "weekly" || selectedPeriod.value === "monthly"
            ? "{value}만원"
            : "{value}%",
        fontSize: 10,
      },
      splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
    },
    series: [
      {
        name:
          selectedPeriod.value === "daily" || selectedPeriod.value === "weekly" || selectedPeriod.value === "monthly"
            ? "잔고"
            : "수익률",
        type: "line",
        smooth: true,
        data: data.returns,
        itemStyle: { color: "#3b82f6" },
        symbol: "circle",
        symbolSize: 6,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
              { offset: 1, color: "rgba(59, 130, 246, 0)" },
            ],
          },
        },
      },
    ],
  };
};

updateInvestmentChart();

const chartOption = ref({
  tooltip: {
    trigger: "item",
    formatter: (params) => `목표 현황<br/>${params.name}: ${params.value}개 (${params.percent}%)`,
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
      radius: ["45%", "90%"],
      center: ["50%", "50%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 2,
        borderColor: "#fff",
        borderWidth: 2,
        shadowBlur: 8,
        shadowColor: "rgba(0, 0, 0, 0.1)",
      },
      label: { show: false },
      data: [
        { value: 1, name: "자가용-주거래", itemStyle: { color: "#10b981" } },
        { value: 1, name: "자가용-적금", itemStyle: { color: "#059669" } },
        { value: 1, name: "여행-주거래", itemStyle: { color: "#3b82f6" } },
        { value: 1, name: "여행-적금", itemStyle: { color: "#06b6d4" } },
        { value: 1, name: "여행-투자", itemStyle: { color: "#8b5cf6" } },
        { value: 1, name: "비상-통장", itemStyle: { color: "#f59e0b" } },
        { value: 1, name: "비상-예금", itemStyle: { color: "#eab308" } },
      ],
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: () => Math.random() * 200,
    },
  ],
});
</script>
