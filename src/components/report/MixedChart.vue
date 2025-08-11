<template>
  <div class="w-full h-full">
    <VChart :option="chartOptions" autoresize />
  </div>
</template>

<script setup>
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from "echarts/components";

use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      date: [],
      barData: [],
      lineData: []
    })
  },
  barName: {
    type: String,
    default: "막대 데이터"
  },
  lineName: {
    type: String,
    default: "선 데이터"
  },
  barColor: {
    type: String,
    default: "#3b82f6"
  },
  lineColor: {
    type: String,
    default: "#10b981"
  },
  period: {
    type: String,
    default: "daily",
    validator: (value) => ["daily", "weekly", "monthly"].includes(value)
  }
});

// 타임스탬프를 기간별 날짜 문자열로 변환
const formatDate = (timestamp, period) => {
  const date = new Date(timestamp);
  
  switch (period) {
    case "daily":
      return `${date.getMonth() + 1}/${date.getDate()}`;
    case "weekly":
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    case "monthly":
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    default:
      return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

const chartOptions = computed(() => {
  const dates = props.data.date?.map(timestamp => formatDate(timestamp, props.period)) || [];
  const barData = props.data.barData || [];
  const lineData = props.data.lineData || [];
  
  // 날짜 역순으로 정렬 (가장 최신 날짜가 맨 오른쪽)
  const sortedData = dates.map((date, index) => ({
    date,
    barValue: barData[index],
    lineValue: lineData[index],
    timestamp: props.data.date[index]
  })).sort((a, b) => a.timestamp - b.timestamp);
  
  const sortedDates = sortedData.map(item => item.date);
  const sortedBarData = sortedData.map(item => item.barValue);
  const sortedLineData = sortedData.map(item => item.lineValue);
  
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(param => {
          const value = param.value ? param.value.toLocaleString() : '0';
          result += `${param.marker}${param.seriesName}: ₩${value}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: [props.barName, props.lineName],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%'
    },
    xAxis: {
      type: 'category',
      data: sortedDates,
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: 10,
        color: '#666'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '금액 (₩)',
        position: 'left',
        axisLabel: {
          formatter: function(value) {
            if (value >= 100000) {
              return (value / 10000).toFixed(0) + '만';
            }
            return value.toLocaleString();
          },
          fontSize: 10,
          color: '#666'
        },
        nameTextStyle: {
          fontSize: 10,
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: props.barName,
        type: 'bar',
        yAxisIndex: 0,
        data: sortedBarData,
        itemStyle: {
          color: props.barColor,
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '60%'
      },
      {
        name: props.lineName,
        type: 'line',
        yAxisIndex: 0,
        data: sortedLineData,
        lineStyle: {
          color: props.lineColor,
          width: 3
        },
        itemStyle: {
          color: props.lineColor
        },
        symbol: 'circle',
        symbolSize: 6,
        smooth: true
      }
    ]
  };
});
</script>