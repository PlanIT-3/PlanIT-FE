<template>
  <div class="chart-container -mt-2">
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
    console.log("GoalProgress received data:", newVal);

    if (!newVal) {
      chartOption.value = {};
      return;
    }

    // API 응답 구조에 따라 데이터 추출
    let rawData = [];
    if (Array.isArray(newVal)) {
      rawData = newVal;
    } else if (newVal.data && Array.isArray(newVal.data)) {
      rawData = newVal.data;
    } else {
      console.log("No valid data found");
      chartOption.value = {};
      return;
    }

    console.log("Raw data for chart:", rawData);

    if (rawData.length === 0) {
      chartOption.value = {};
      return;
    }

    const dates = rawData
      .map((item) => {
        if (!item.progressDate) return null;
        const [y, m, d] = item.progressDate;
        return `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
      })
      .filter(Boolean);

    const depositData = rawData.map((item) => item.depositProgress || 0);
    const isaData = rawData.map((item) => item.isaProgress || 0);

    console.log("Chart data - dates:", dates, "deposit:", depositData, "isa:", isaData);

    chartOption.value = {
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
            result += `<div style="margin: 4px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
              ${param.seriesName}: <strong>${param.value}%</strong>
            </div>`;
          });
          return result;
        },
      },
      legend: {
        data: ["적금 진행률", "ISA 진행률"],
        bottom: -5,
        textStyle: {
          fontSize: 13,
          color: "#6b7280",
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        top: "15%",
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
          name: "적금 진행률",
          type: "line",
          data: depositData,
          smooth: true,
          lineStyle: {
            width: 3,
            color: "#3b82f6",
          },
          itemStyle: {
            color: "#3b82f6",
            borderWidth: 2,
            borderColor: "#ffffff",
          },
          symbol: "circle",
          symbolSize: 6,
        },
        {
          name: "ISA 진행률",
          type: "line",
          data: isaData,
          smooth: true,
          lineStyle: {
            width: 3,
            color: "#ef4444",
          },
          itemStyle: {
            color: "#ef4444",
            borderWidth: 2,
            borderColor: "#ffffff",
          },
          symbol: "circle",
          symbolSize: 6,
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
  height: 280px;
  padding: 0px;
  position: relative;
  overflow: hidden;
}

.progress-chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
    padding: 16px;
    border-radius: 12px;
  }
}
</style>
