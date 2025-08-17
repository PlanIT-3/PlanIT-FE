<template>
  <div class="min-h-screen h-full flex flex-col">
    <MainHeader class="flex-shrink-0 relative z-10" />
    <div
      id="content"
      class="bg-white rounded-t-3xl shadow px-6 pt-10 pb-8 z-* -mt-[84px]"
      :style="{ maxHeight: 'calc(852px - 148px)', minHeight: 'calc(852px - 148px)' }"
    >
      <!-- 이 부분이 고정될 박스입니다 -->
      <div
        class="sticky -top-10 bg-white rounded-2xl shadow-lg p-5 flex items-center justify-around -mt-13 mb-6 z-30"
        style="height: 150px"
      >
        <div class="flex flex-col justify-center items-start w-auto h-[132px] mr-4 pr-4 flex-shrink-0 min-w-0">
          <div class="text-black text-base font-semibold mb-1 text-left whitespace-nowrap">전체 자산</div>
          <div class="text-gray-600 text-sm mb-1 text-left whitespace-nowrap">총 {{ goalCount }}개 목표</div>
          <div class="text-black text-2xl font-bold mb-1 text-left whitespace-nowrap">{{ formattedTotalBalance }}</div>
          <div class="text-green-600 text-xs text-left whitespace-nowrap">전월 대비 +12.5%</div>
        </div>
        <div class="ml-6 w-56 h-56 flex items-center justify-center">
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
import { defineProps } from "vue";
import MainHeader from "@/components/common/MainHeader.vue";
import NavBar from "@/components/common/NavBar.vue";
import VChart from "vue-echarts";
import { computed } from "vue";

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
});

const route = useRoute();

// 전체 자산 포맷팅
const formattedTotalBalance = computed(() => {
  return Math.round(props.totalBalance).toLocaleString() + "원";
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
