<template>
  <MainLayout
    :chart-option="chartOption"
    :total-balance="totalBalance"
    :goal-count="goalRatioData.length"
    :is-loading="isLoading"
  >
    <GoalSliderCard :goal-list="goalListData" />
    <InvestmentStatusChart />
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
import goalApi from "@/api/objectApi";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

// API에서 받아온 목표 비율 데이터
const goalRatioData = ref([]);
const totalBalance = ref(0);
// 목표 리스트 데이터
const goalListData = ref([]);
// 기간별 데이터
const dailyData = ref([]);
const weeklyData = ref([]);
const monthlyData = ref([]);
// 로딩 상태
const isLoading = ref(false);

// 일자 버튼 클릭 시 API 호출
const fetchDailyData = async () => {
  try {
    const data = await mainApi.getPeriod("day");
    if (data.status === "OK" && data.data && data.data.balanceResList) {
      dailyData.value = data.data.balanceResList;
    } else {
      dailyData.value = [];
    }
  } catch (error) {
    console.error("일별 데이터 불러오기 실패:", error);
    dailyData.value = [];
    // 인증 관련 에러인 경우 처리
    if (error.response?.status === 401) {
      console.warn("인증이 필요합니다. 로그인 페이지로 이동합니다.");
      // 에러를 다시 던져서 API 인터셉터가 처리하도록 함
      throw error;
    }
  }
};

// 주 버튼 클릭 시 API 호출
const fetchWeeklyData = async () => {
  try {
    const data = await mainApi.getPeriod("week");
    if (data.status === "OK" && data.data && data.data.balanceResList) {
      weeklyData.value = data.data.balanceResList;
    } else {
      weeklyData.value = [];
    }
  } catch (error) {
    console.error("주별 데이터 불러오기 실패:", error);
    weeklyData.value = [];
    // 인증 관련 에러인 경우 처리
    if (error.response?.status === 401) {
      console.warn("인증이 필요합니다. 로그인 페이지로 이동합니다.");
      throw error;
    }
  }
};

// 월 버튼 클릭 시 API 호출
const fetchMonthlyData = async () => {
  try {
    const data = await mainApi.getPeriod("month");
    if (data.status === "OK" && data.data && data.data.balanceResList) {
      monthlyData.value = data.data.balanceResList;
    } else {
      monthlyData.value = [];
    }
  } catch (error) {
    console.error("월별 데이터 불러오기 실패:", error);
    monthlyData.value = [];
    // 인증 관련 에러인 경우 처리
    if (error.response?.status === 401) {
      console.warn("인증이 필요합니다. 로그인 페이지로 이동합니다.");
      throw error;
    }
  }
};

// 목표 비율 데이터 API 호출
const fetchGoalRatioData = async () => {
  isLoading.value = true;
  try {
    const data = await mainApi.getGoalRatio();
    if (data.status === "OK" && data.data && data.data.goalRatios && data.data.goalRatios.length > 0) {
      totalBalance.value = data.data.totalBalance || 0;
      goalRatioData.value = data.data.goalRatios;
      updateChartOption();
    } else {
      // 데이터가 없는 경우 기본값 설정
      totalBalance.value = 0;
      goalRatioData.value = [];
      updateChartOption();
    }
  } catch (error) {
    console.error("목표 비율 데이터 불러오기 실패:", error);
    // 에러 발생 시 기본값 설정
    totalBalance.value = 0;
    goalRatioData.value = [];
    updateChartOption();
    // 인증 관련 에러인 경우 처리
    if (error.response?.status === 401) {
      console.warn("인증이 필요합니다. 로그인 페이지로 이동합니다.");
      throw error;
    }
  } finally {
    isLoading.value = false;
  }
};

// 목표 리스트 데이터 API 호출
const fetchGoalListData = async () => {
  try {
    const data = await goalApi.getGoalList();
    if (data.status === "OK" && data.data && data.data.length > 0) {
      goalListData.value = data.data;
    } else {
      goalListData.value = [];
    }
  } catch (error) {
    console.error("목표 리스트 데이터 불러오기 실패:", error);
    goalListData.value = [];
  }
};

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
  } else {
    // 데이터가 없는 경우 빈 차트 표시
    chartOption.value.series[0].data = [];
  }
};
</script>
