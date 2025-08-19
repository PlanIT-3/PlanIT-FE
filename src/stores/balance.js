import { defineStore } from "pinia";
import { ref, computed } from "vue";
import mainApi from "@/api/mainApi";

export const useBalanceStore = defineStore("balance", () => {
  // State
  const dailyData = ref([]);
  const weeklyData = ref([]);
  const monthlyData = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchPeriodData = async (period) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await mainApi.getPeriod(period);
      if (data.status === "OK" && data.data && data.data.balanceResList) {
        switch (period) {
          case "day":
            dailyData.value = data.data.balanceResList;
            break;
          case "week":
            weeklyData.value = data.data.balanceResList;
            break;
          case "month":
            monthlyData.value = data.data.balanceResList;
            break;
        }
      } else {
        error.value = `${period} 데이터 형식이 올바르지 않습니다`;
      }
    } catch (err) {
      console.error(`${period} 데이터 불러오기 실패:`, err);
      error.value = err.message || `${period} 데이터 불러오기에 실패했습니다`;
    } finally {
      loading.value = false;
    }
  };

  const fetchDailyData = () => fetchPeriodData("day");
  const fetchWeeklyData = () => fetchPeriodData("week");
  const fetchMonthlyData = () => fetchPeriodData("month");

  const clearData = () => {
    dailyData.value = [];
    weeklyData.value = [];
    monthlyData.value = [];
    error.value = null;
  };

  // Getters
  const hasMonthlyData = computed(() => monthlyData.value.length > 0);
  const hasDailyData = computed(() => dailyData.value.length > 0);
  const hasWeeklyData = computed(() => weeklyData.value.length > 0);

  const latestMonthlyBalance = computed(() => {
    if (monthlyData.value.length === 0) return null;
    return monthlyData.value[monthlyData.value.length - 1];
  });

  const latestDailyBalance = computed(() => {
    if (dailyData.value.length === 0) return null;
    return dailyData.value[dailyData.value.length - 1];
  });

  const latestWeeklyBalance = computed(() => {
    if (weeklyData.value.length === 0) return null;
    return weeklyData.value[weeklyData.value.length - 1];
  });

  // 전월 대비 수익률 계산
  const monthlyGrowthRate = computed(() => {
    if (monthlyData.value.length < 2) return null;

    const currentMonth = monthlyData.value[monthlyData.value.length - 1];
    const previousMonth = monthlyData.value[monthlyData.value.length - 2];

    if (!currentMonth || !previousMonth || previousMonth.amount === 0) return null;

    const growthRate = ((currentMonth.amount - previousMonth.amount) / previousMonth.amount) * 100;
    return growthRate;
  });

  // 포맷된 수익률 (+ 또는 - 기호 포함)
  const formattedMonthlyGrowthRate = computed(() => {
    if (monthlyGrowthRate.value === null) return "데이터 없음";

    const rate = monthlyGrowthRate.value;
    const sign = rate >= 0 ? "+" : "";
    console.log(`전월 대비 수익률: ${sign}${rate.toFixed(1)}%`);

    return `전월 대비 ${sign}${rate.toFixed(1)}%`;
  });

  return {
    // State
    dailyData,
    weeklyData,
    monthlyData,
    loading,
    error,

    // Actions
    fetchPeriodData,
    fetchDailyData,
    fetchWeeklyData,
    fetchMonthlyData,
    clearData,

    // Getters
    hasMonthlyData,
    hasDailyData,
    hasWeeklyData,
    latestMonthlyBalance,
    latestDailyBalance,
    latestWeeklyBalance,
    monthlyGrowthRate,
    formattedMonthlyGrowthRate,
  };
});
