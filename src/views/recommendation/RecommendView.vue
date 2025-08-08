<template>
  <DefaultLayout>
    <CardContainer class="pb-0 px-0 rounded-t-3xl shadow-lg">
      <!-- 탭 네비게이션 -->
      <div class="relative top-[-3rem]">
        <div class="flex border-b border-gray-200 w-[343px] mx-auto">
          <button
            @click="activeTab = 'recommend'"
            :class="[
              'flex-1 py-4 px-4 text-sm font-semibold transition-all duration-200 relative',
              activeTab === 'recommend' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            상품 추천
            <div
              v-if="activeTab === 'recommend'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full transition-all duration-200"
            ></div>
          </button>
          <button
            @click="activeTab = 'rebalance'"
            :class="[
              'flex-1 py-4 px-4 text-sm font-semibold transition-all duration-200 relative',
              activeTab === 'rebalance' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            상품 리밸런싱
            <div
              v-if="activeTab === 'rebalance'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full transition-all duration-200"
            ></div>
          </button>
        </div>
      </div>

      <!-- 탭 콘텐츠 -->
      <!-- 상품 추천 탭 -->
      <div v-if="activeTab === 'recommend'">
        <EtfRecommendView />
      </div>

      <!-- 상품 리밸런싱 탭 -->
      <div v-if="activeTab === 'rebalance'">
        <RebalancingView />
      </div>
    </CardContainer>
  </DefaultLayout>
</template>

<script setup>
import CardContainer from "@/components/common/CardContainer.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import RebalancingView from "./RebalancingView.vue";
import { ref } from "vue";
import EtfRecommendView from "./EtfRecommendView.vue";

const activeTab = ref("recommend");
</script>
