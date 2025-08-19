<template>
  <div class="w-full bg-white rounded-2xl shadow p-5 mt-2">
    <!-- Header -->
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center">
        <div class="text-indigo-600 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-gray-800 whitespace-nowrap">계좌 총 잔고 추이</h3>
      </div>
    </div>

    <!-- Time Period Toggle Buttons -->
    <div class="flex justify-center space-x-1 bg-gray-100 rounded-lg p-1 -mb-8 relative z-10">
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
    <div class="h-[200px]">
      <VChart :option="investmentChartOption" autoresize />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { useBalanceStore } from "@/stores/balance";

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const selectedPeriod = ref("daily");
const balanceStore = useBalanceStore();

const investmentChartOption = ref({});

// Mock 데이터 (API 실패 시 fallback)
const investmentData = {
  daily: {
    labels: ["-6일", "-5일", "-4일", "-3일", "-2일", "-1일", "오늘"],
    returns: [7.5, 7.8, 8.0, 7.9, 8.2, 8.1, 8.2],
  },
  weekly: {
    labels: ["-6주", "-5주", "-4주", "-3주", "-2주", "-1주", "이번주"],
    returns: [5.5, 6.2, 6.8, 7.0, 7.5, 8.0, 8.2],
  },
  monthly: {
    labels: ["-6달", "-5달", "-4달", "-3달", "-2달", "-1달", "이번달"],
    returns: [2.1, 3.5, 4.0, 5.8, 6.5, 7.2, 8.2],
  },
};

// 기간 선택
const selectPeriod = async (period) => {
  selectedPeriod.value = period;
  if (period === "daily") {
    await balanceStore.fetchDailyData();
  } else if (period === "weekly") {
    await balanceStore.fetchWeeklyData();
  } else if (period === "monthly") {
    await balanceStore.fetchMonthlyData();
  }
  updateInvestmentChart();
};

// 차트 업데이트
const updateInvestmentChart = () => {
  let data;

  if (selectedPeriod.value === "daily" && balanceStore.hasDailyData) {
    const labels = balanceStore.dailyData.map((item) => {
      const date = new Date(item.createdAt);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const amounts = balanceStore.dailyData.map((item) => Math.round(item.amount / 10000));

    data = { labels, returns: amounts };
  } else if (selectedPeriod.value === "weekly" && balanceStore.hasWeeklyData) {
    const labels = balanceStore.weeklyData.map((item) => {
      const date = new Date(item.createdAt);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const amounts = balanceStore.weeklyData.map((item) => Math.round(item.amount / 10000));

    data = { labels, returns: amounts };
  } else if (selectedPeriod.value === "monthly" && balanceStore.hasMonthlyData) {
    const labels = balanceStore.monthlyData.map((item) => {
      const date = new Date(item.createdAt);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const amounts = balanceStore.monthlyData.map((item) => Math.round(item.amount / 10000));

    data = { labels, returns: amounts };
  } else {
    // Fallback to mock data
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
      borderColor: "#7c3aed",
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
        itemStyle: { color: "#7c3aed" },
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
              { offset: 0, color: "rgba(124, 58, 237, 0.3)" },
              { offset: 1, color: "rgba(124, 58, 237, 0)" },
            ],
          },
        },
      },
    ],
  };
};

// 초기 로드
onMounted(async () => {
  await balanceStore.fetchDailyData();
  updateInvestmentChart();
});
</script>
