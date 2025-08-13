<template>
  <DefaultLayout>
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex justify-center items-center h-24">
      <div class="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- 컨텐츠 영역 -->
    <div v-else class="gap-4">
      <!-- 목표 현황 컴포넌트 -->
      <GoalStatus :goalList="list" />

      <div class="flex flex-col items-start w-full px-0 gap-2">
        <div class="flex items-center">
          <div class="text-indigo-600 mr-2"></div>
          <h3 class="text-base font-semibold text-gray-800 whitespace-nowrap">목표 리스트</h3>
        </div>
      </div>

      <!-- 목표 리스트 -->
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

      <!-- 빈 리스트 -->
      <div v-else class="text-center py-8 text-gray-500">등록된 목표가 없습니다.</div>
    </div>
    <!-- 목표 슬라이더 카드 컴포넌트 -->
  </DefaultLayout>
</template>

<script setup>
import GoalCard from "@/components/goal/GoalCard.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import GoalStatus from "@/components/goal/GoalStatus.vue";
import api from "@/api/objectApi";

import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import GoalList from "@/components/goal/GoalList.vue";

const list = ref([]);
const router = useRouter();
const isLoading = ref(true);

const load = async () => {
  try {
    const res = await api.getGoalList();
    // res.data 가 배열일 경우
    list.value = res.data || [];
  } catch (err) {
    console.log("GoalList API 호출 실패", err);
  } finally {
    isLoading.value = false;
  }
};

const goDetail = (id) => {
  console.log("목표 상세로 이동", id);

  router.push(`/goal/detail/${id}`);
};

onMounted(load);
</script>
