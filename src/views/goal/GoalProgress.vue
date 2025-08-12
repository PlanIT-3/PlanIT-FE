<template>
  <div class="chart-container">
    <VChart :option="chartOption" autoresize class="progress-chart" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import VChart from "vue-echarts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { use } from "echarts/core";

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

// props로 진행 데이터 배열 받음
const props = defineProps({
  progressData: {
    type: Array,
    default: () => [],
  },
});

const chartOption = ref({});

watch(
  () => props.progressData,
  (newVal) => {
    if (!newVal || newVal.length === 0) {
      chartOption.value = {};
      return;
    }

    const rawData = newVal;

    const dates = rawData
      .map((item) => {
        if (!item.progressDate) return null;
        const [y, m, d] = item.progressDate;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      })
      .filter(Boolean);

    const depositData = rawData.filter((item) => item.progressDate).map((item) => item.depositProgress);

    const isaData = rawData.filter((item) => item.progressDate).map((item) => item.isaProgress);

    chartOption.value = {
      title: {
        text: "투자 진행 현황",
        left: "center",
        textStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#1f2937",
        },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: {
          color: "#374151",
        },
        formatter: function (params) {
          let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          params.forEach((param) => {
            const displayName = param.seriesName === "depositProgress" ? "적금 진행률" : "ISA 진행률";
            result += `<div style="margin: 4px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
              ${displayName}: <strong>${param.value}%</strong>
            </div>`;
          });
          return result;
        },
      },
      legend: {
        data: [
          { name: "depositProgress", icon: "circle" },
          { name: "isaProgress", icon: "circle" },
        ],
        top: 40,
        textStyle: {
          fontSize: 13,
          color: "#6b7280",
        },
        formatter: function (name) {
          return name === "depositProgress" ? "적금 진행률" : "ISA 진행률";
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "10%",
        top: "25%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: dates,
        axisLabel: {
          formatter: (value) => value.replace("2025-", ""),
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
        name: "진행률 (%)",
        nameTextStyle: {
          color: "#6b7280",
          fontSize: 12,
        },
        axisLabel: {
          formatter: "{value}%",
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
          name: "depositProgress",
          type: "line",
          data: depositData,
          smooth: true,
          lineStyle: {
            width: 4,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#3b82f6" },
                { offset: 1, color: "#1d4ed8" },
              ],
            },
          },
          itemStyle: {
            color: "#3b82f6",
            borderWidth: 3,
            borderColor: "#ffffff",
            shadowBlur: 8,
            shadowColor: "rgba(59, 130, 246, 0.3)",
          },
          symbol: "circle",
          symbolSize: 8,
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
                { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
              ],
            },
          },
        },
        {
          name: "isaProgress",
          type: "line",
          data: isaData,
          smooth: true,
          lineStyle: {
            width: 4,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#10b981" },
                { offset: 1, color: "#047857" },
              ],
            },
          },
          itemStyle: {
            color: "#10b981",
            borderWidth: 3,
            borderColor: "#ffffff",
            shadowBlur: 8,
            shadowColor: "rgba(16, 185, 129, 0.3)",
          },
          symbol: "circle",
          symbolSize: 8,
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(16, 185, 129, 0.3)" },
                { offset: 1, color: "rgba(16, 185, 129, 0.05)" },
              ],
            },
          },
        },
      ],
    };
  },
  { immediate: true }
);
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 350px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.chart-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
}

.progress-chart {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
    padding: 16px;
    border-radius: 12px;
  }
}
</style>
