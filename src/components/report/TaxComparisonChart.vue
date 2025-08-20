<template>
  <div class="chart-container">
    <VChart v-if="!loading && !error" :option="chartOptions" autoresize class="tax-chart" />
    <div v-else class="flex items-center justify-center h-32 text-gray-400">데이터를 불러오는 중...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import api from "@/api";
import { trackTaxSavingsView } from "@/analytics";

use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent]);

const loading = ref(false);
const error = ref(false);
const taxData = ref({
  quarterlyData: [],
  summary: {},
});

const chartOptions = computed(() => {
  if (!taxData.value.quarterlyData || taxData.value.quarterlyData.length === 0) {
    return {};
  }

  const quarters = taxData.value.quarterlyData.map((item) => item.quarter);
  const isaGeneralTaxData = taxData.value.quarterlyData.map((item) => item.isaGeneralTax);
  const isaTaxSavedData = taxData.value.quarterlyData.map((item) => item.isaTaxSaved);

  return {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      borderRadius: 8,
      padding: [12, 16],
      textStyle: {
        color: "#374151",
        fontSize: 13,
      },
      formatter: function (params) {
        let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;
        params.forEach((param) => {
          const value = typeof param.value === "number" ? param.value : 0;
          const formattedValue = Math.round(value).toLocaleString();

          result += `<div style="margin: 4px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
            ${param.seriesName}: <strong>₩${formattedValue}</strong>
          </div>`;
        });
        return result;
      },
    },
    legend: {
      data: ["일반 계좌 세금", "ISA 절세 효과"],
      bottom: 0,
      textStyle: {
        fontSize: 13,
        color: "#6b7280",
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "15%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: quarters,
      axisLabel: {
        color: "#6b7280",
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
      axisTick: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "금액 (₩)",
      nameTextStyle: {
        color: "#6b7280",
        fontSize: 12,
      },
      axisLabel: {
        formatter: function (value) {
          if (value >= 10000) {
            return (value / 10000).toFixed(0) + "만";
          }
          return value.toLocaleString();
        },
        color: "#6b7280",
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#f3f4f6",
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "일반 계좌 세금",
        type: "bar",
        data: isaGeneralTaxData,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#ef4444" },
              { offset: 1, color: "#dc2626" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: "30%",
      },
      {
        name: "ISA 절세 효과",
        type: "line",
        data: isaTaxSavedData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#10b981",
        },
        itemStyle: {
          color: "#10b981",
          borderWidth: 2,
          borderColor: "#ffffff",
        },
        symbol: "circle",
        symbolSize: 8,
      },
    ],
  };
});

const fetchData = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await api.get("/api/tax/comparison/trend");
    console.log("세금 비교 데이터:", response);

    taxData.value = response.data.data || {
      quarterlyData: [],
      summary: {},
    };
    
    // GA 세금 절약 데이터 조회 추적
    const totalSavings = taxData.value.quarterlyData?.reduce((sum, item) => sum + (item.isaTaxSaved || 0), 0) || 0;
    trackTaxSavingsView(totalSavings);
  } catch (err) {
    console.error("세금 비교 데이터 가져오기 실패:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 270px;
  padding: 10px;
  position: relative;
  overflow: hidden;
}

.tax-chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
    padding: 8px;
  }
}
</style>
