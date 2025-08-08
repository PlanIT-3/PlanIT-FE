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
            <h3 class="text-base font-semibold text-gray-800 whitespace-nowrap">최근 투자 현황</h3>
          </div>
          <button class="text-xs text-indigo-600 font-medium whitespace-nowrap">전체보기</button>
        </div>

        <!-- Asset and ROI Summary -->
        <div class="flex justify-between items-baseline mb-3">
          <div>
            <p class="text-sm text-gray-500 whitespace-nowrap">총 투자 자산</p>
            <p class="text-xl font-bold whitespace-nowrap">12,450,000원</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 whitespace-nowrap">총 수익률</p>
            <p class="text-xl font-bold text-green-600 whitespace-nowrap">+8.2%</p>
          </div>
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
        <div class="h-[150px] pointer-events-none">
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

import MainLayout from "@/components/layouts/MainLayout.vue";
import GoalSliderCard from "@/components/goal/GoalSliderCard.vue";

use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const selectedPeriod = ref("daily");

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
  updateInvestmentChart();
};

const updateInvestmentChart = () => {
  const data = investmentData[selectedPeriod.value];
  investmentChartOption.value = {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const date = params[0].axisValue;
        let tooltip = `${date}<br/>`;
        params.forEach((cur) => {
          tooltip += `${cur.seriesName}: ${cur.value}%<br/>`;
        });
        return tooltip;
      },
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
      axisLabel: { formatter: "{value}%", fontSize: 10 },
      splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
    },
    series: [
      {
        name: "수익률",
        type: "line",
        smooth: true,
        data: data.returns,
        itemStyle: { color: "#3b82f6" },
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
      {
        name: "평균 수익률",
        type: "line",
        smooth: true,
        data: data.avgReturns,
        itemStyle: { color: "#10b981" },
        lineStyle: { type: "dashed" },
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
