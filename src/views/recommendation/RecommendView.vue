<template>
  <DefaultLayout>
    <!-- 탭 네비게이션 -->
    <div class="relative -mt-2 mb-10">
      <div class="flex w-[343px] mx-auto">
        <!-- 상품 추천 -->
        <button
          @click="activeTab = 'recommend'"
          :class="[
            'flex-1 py-4 px-4 text-xs font-semibold transition-all duration-200 border-b-2 whitespace-nowrap',
            activeTab === 'recommend'
              ? 'border-purple-600 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]"
        >
          상품 추천
        </button>

        <!-- 목표 추천 -->
        <button
          @click="activeTab = 'goal'"
          :class="[
            'flex-1 py-4 px-4 text-xs font-semibold transition-all duration-200 border-b-2 whitespace-nowrap',
            activeTab === 'goal'
              ? 'border-purple-600 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]"
        >
          목표 추천
        </button>

        <!-- 상품 리밸런싱 -->
        <button
          @click="activeTab = 'rebalance'"
          :class="[
            'flex-1 py-4 px-4 text-xs font-semibold transition-all duration-200 border-b-2 whitespace-nowrap',
            activeTab === 'rebalance'
              ? 'border-purple-600 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]"
        >
          상품 리밸런싱
        </button>
      </div>
    </div>

    <!-- 탭 콘텐츠 -->
    <div v-if="activeTab === 'recommend'">
      <EtfRecommendView />
    </div>

    <div v-if="activeTab === 'goal'">
      <GoalRecommendView />
    </div>

    <div v-if="activeTab === 'rebalance'">
      <RebalancingView />
    </div>
  </DefaultLayout>
</template>

<script setup>
import CardContainer from "@/components/common/CardContainer.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import RebalancingView from "./RebalancingView.vue";
import { ref } from "vue";
import EtfRecommendView from "./EtfRecommendView.vue";
import GoalRecommendView from "./GoalRecommendView.vue";

const activeTab = ref("recommend");
</script>

<style scoped></style>
