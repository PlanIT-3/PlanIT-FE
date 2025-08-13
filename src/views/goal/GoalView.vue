<template>
  <DefaultLayout>
    <div class="flex flex-col items-start w-full px-0 gap-2">
      <div class="flex items-center">
        <div class="text-indigo-600 mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-base font-semibold text-gray-800 whitespace-nowrap">목표 리스트</h3>
      </div>
    </div>

    <!-- 데이터 길이 체크 -->
    <div v-if="list.length > 0">
      <div v-for="item in list" :key="item.goalId" @click="goDetail(item.goalId)" class="cursor-pointer">
        <GoalList
          :title="item.goalName || ''"
          :rate="item.goalRate"
          :showLegend="false"
          :barChartData="[{ name: '진행', value: item.goalRate }]"
          :totalAmount="item.totalAmount"
          :targetAmount="item.targetAmount"
        />
      </div>
    </div>

    <!-- 로딩 또는 빈 리스트 -->
    <div v-else>
      <div class="flex justify-center items-center h-24">
        <div class="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import GoalCard from "@/components/goal/GoalCard.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import api from "@/api/objectApi";

import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import GoalList from "@/components/goal/GoalList.vue";

const list = ref([]);
const router = useRouter();

const load = async () => {
  try {
    const res = await api.getGoalList();
    // res.data 가 배열일 경우
    list.value = res.data || [];
  } catch (err) {
    console.log("GoalList API 호출 실패", err);
  }
};

const goDetail = (id) => {
  console.log("목표 상세로 이동", id);

  router.push(`/goal/detail/${id}`);
};

onMounted(load);
</script>
