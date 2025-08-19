<template>
  <div class="min-h-screen h-full flex flex-col">
    <MainHeader class="flex-shrink-0 relative z-10" />
    <div
      id="content"
      class="bg-white rounded-t-3xl shadow px-6 pt-10 pb-8 z-* -mt-[84px] w-full"
      :style="{ maxHeight: 'calc(852px - 148px)', minHeight: 'calc(852px - 148px)' }"
    >
      <!-- 이 부분이 고정될 박스입니다 -->
      <div
        class="sticky -top-10 bg-white rounded-2xl shadow-lg p-5 flex items-center justify-around -mt-13 mb-6 z-30"
        style="height: 150px"
      >
        <div class="flex flex-col justify-center items-start h-[132px] mr-0 pr-0 flex-shrink-0 min-w-0">
          <div class="text-black text-base font-semibold mb-1 text-left whitespace-nowrap">전체 자산</div>
          <div class="text-gray-600 text-sm mb-1 text-left whitespace-nowrap">총 {{ goalCount }}개 목표</div>
          <div class="text-black text-2xl font-semibold mb-1 text-left whitespace-nowrap">
            {{ formattedTotalBalance }}
          </div>
          <div
            :class="[
              'text-xs text-left',
              totalBalance > 0
                ? (balanceStore.monthlyGrowthRate ?? 0) >= 0
                  ? 'text-green-500'
                  : 'text-red-600'
                : 'text-gray-500',
            ]"
          >
            {{ getGrowthRateText() }}
          </div>
        </div>
        <div class="ml-4 h-56 w-full flex items-center justify-center">
          <v-chart class="w-full h-full" :option="chartOption" autoresize />
        </div>
      </div>
      <div><slot></slot></div>
    </div>
    <NavBar class="sticky bottom-0 bg-white z-10" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { defineProps, onMounted, computed } from "vue";
import MainHeader from "@/components/common/MainHeader.vue";
import NavBar from "@/components/common/NavBar.vue";
import VChart from "vue-echarts";
import { useBalanceStore } from "@/stores/balance";

// 🔹 외부에서 chartOption 받기
const props = defineProps({
  chartOption: {
    type: Object,
    required: true,
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
  goalCount: {
    type: Number,
    default: 0,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const balanceStore = useBalanceStore();

// 전체 자산 포맷팅
const formattedTotalBalance = computed(() => {
  if (props.isLoading) {
    return "로딩 중...";
  } else {
    return Math.round(props.totalBalance).toLocaleString() + "원";
  }
});
const getGrowthRateText = () => {
  if (props.isLoading) {
    return "데이터 로딩 중...";
  } else if (props.totalBalance > 0) {
    return balanceStore.formattedMonthlyGrowthRate ?? "전월 대비 +0.0%";
  } else {
    return "전월 대비 +0.0%";
  }
};
// balance store에서 수익률 데이터 가져오기

// 컴포넌트 마운트 시 월별 데이터 로드
onMounted(async () => {
  await balanceStore.fetchMonthlyData();
});
</script>

<style scoped>
#content::-webkit-scrollbar {
  width: 4px;
}

#content::-webkit-scrollbar-track {
  background: transparent;
}

#content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

#content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
