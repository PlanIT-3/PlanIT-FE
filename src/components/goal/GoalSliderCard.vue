<template>
  <div class="h-[220px] w-full bg-white rounded-2xl shadow-lg p-4 relative overflow-hidden">
    <div class="flex items-center justify-between mb-4">
      <router-link
        to="/goal/detail"
        class="flex items-center text-black text-sm font-semibold hover:text-indigo-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        나의 목표
      </router-link>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>

    <div class="goals-slider absolute top-[38px] left-0 w-full h-[171px] overflow-hidden">
      <div
        class="flex transition-transform duration-300 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <GoalCard title="자가용 구매하기" statusText="목표 달성!" badge-text="목표달성" :showLegend="false"></GoalCard>

        <!-- 목표 추가 버튼 -->
        <div class="min-w-full h-full flex">
          <button
            class="w-full h-[170px] bg-white border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 flex flex-col items-center justify-center group"
          >
            <div
              class="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>

            <div class="text-center">
              <p class="text-gray-600 group-hover:text-indigo-600 text-sm font-medium transition-colors duration-200">
                새 목표 추가
              </p>
              <p class="text-gray-400 group-hover:text-indigo-400 text-xs mt-1 transition-colors duration-200">
                목표를 설정하고 달성해보세요
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Slide Indicators -->
    <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(slide, index) in 4"
        :key="index"
        @click="currentSlide = index"
        :class="['w-2 h-2 rounded-full transition-colors', currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300']"
      ></button>
    </div>

    <!-- Navigation Arrows -->
    <button
      v-if="currentSlide > 0"
      @click="previousSlide"
      class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors z-20"
    >
      <span class="text-gray-600">‹</span>
    </button>

    <button
      v-if="currentSlide < 3"
      @click="nextSlide"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors z-20"
    >
      <span class="text-gray-600">›</span>
    </button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";

import GoalCard from "@/components/goal/GoalCard.vue";

use([CanvasRenderer, LineChart, TooltipComponent, LegendComponent, GridComponent]);

const currentSlide = ref(0);

const nextSlide = () => {
  if (currentSlide.value < 3) currentSlide.value++;
};

const previousSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--;
};
</script>
