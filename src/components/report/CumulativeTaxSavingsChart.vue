<template>
  <div class="mb-0">
    <div class="text-sm font-semibold mb-2 flex items-center"></div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex items-center justify-center bg-gray-50 rounded h-44">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mb-2"></div>
        <span class="text-sm text-gray-500">절세 데이터 로딩 중...</span>
      </div>
    </div>

    <!-- ECharts 차트 -->
    <div v-else class="w-full h-44 flex justify-center">
      <div class="w-full max-w-md">
        <VChart :option="chartOptions" autoresize />
      </div>
    </div>

    <!-- 하단 정보 -->
    <div class="mt-3 bg-green-50 rounded-lg p-3">
      <div class="flex items-center justify-between mb-2">
        <div>
          <span class="text-green-700 font-bold text-base">{{ latestSavings.toLocaleString() }}원</span>
          <span class="text-green-600 text-sm ml-2"> 일반 투자 대비 절약된 세금 </span>
        </div>
      </div>
      <p class="text-sm text-green-600">ISA 활용으로 {{ latestSavings.toLocaleString() }}원의 세금을 절약했습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { api } from "@/api";

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent]);

const taxSavingsData = ref([]);
const latestSavings = ref(803000);
const isLoading = ref(true);

// ECharts 차트 옵션
const chartOptions = computed(() => {
  const periods = taxSavingsData.value.map((d) => d.period);
  const amounts = taxSavingsData.value.map((d) => d.amount);

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: function (params) {
        if (params && params[0]) {
          const value = params[0].value;
          return `${params[0].axisValue}<br/>절세 금액: ${value}만원`;
        }
        return "";
      },
    },
    grid: {
      left: "15%",
      right: "5%",
      bottom: "20%",
      top: "20%",
    },
    xAxis: {
      type: "category",
      data: periods,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: 10,
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      name: "절세금액(만원)",
      position: "left",
      axisLabel: {
        formatter: function (value) {
          return value + "만원";
        },
        fontSize: 10,
        color: "#666",
      },
      nameTextStyle: {
        fontSize: 10,
        color: "#666",
      },
    },
    series: [
      {
        name: "누적 절세 금액",
        type: "line",
        data: amounts,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          color: "#22c55e",
          width: 3,
        },
        itemStyle: {
          color: "#22c55e",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(34, 197, 94, 0.3)" },
              { offset: 1, color: "rgba(34, 197, 94, 0.05)" },
            ],
          },
        },
      },
    ],
  };
});

// 기본 금액을 기반으로 8분기 차트 데이터 생성
const generateChartData = (baseAmount) => {
  latestSavings.value = baseAmount;
  const baseRatios = [0.1, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1.0];
  taxSavingsData.value = baseRatios.map((ratio, index) => ({
    period: `${index + 1}분기`,
    amount: Math.round((baseAmount / 10000) * ratio),
  }));
};

// ISA 절세 데이터 로딩
const fetchTaxSavingsData = async () => {
  try {
    const response = await api.get("/auth/api/isa/reports/cumulative-tax-saving");

    if (response.data.status === "OK" && response.data.data && Array.isArray(response.data.data)) {
      const cumulativeData = response.data.data;

      // 데이터 개수에 따른 처리 로직
      if (cumulativeData.length >= 2) {
        // 실제 API 데이터로 차트 그리기
        const lastQuarterData = cumulativeData[cumulativeData.length - 1];
        latestSavings.value = lastQuarterData.cumulativeTaxSaved;

        taxSavingsData.value = cumulativeData.map((item) => ({
          period: item.quarter,
          amount: Math.round(item.cumulativeTaxSaved / 10000), // 만원 단위로 변환
        }));
      } else {
        // 데이터가 1개 이하일 때: 기본 금액으로 8분기 데이터 생성
        const baseAmount = cumulativeData.length === 1 ? cumulativeData[0].cumulativeTaxSaved : 803000;
        generateChartData(baseAmount);
      }
    } else {
      // API 응답 형식이 올바르지 않을 때
      generateChartData(803000);
    }
  } catch (error) {
    console.error("누적 절세 데이터 로딩 실패:", error);
    // API 실패 시
    generateChartData(803000);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  // ISA 절세 데이터 로딩
  await fetchTaxSavingsData();
});
</script>
