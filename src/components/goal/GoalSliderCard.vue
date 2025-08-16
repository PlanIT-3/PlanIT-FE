<template>
  <div class="h-[220px] w-full bg-white rounded-2xl p-4 relative overflow-hidden">
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

    <div
      class="goals-slider absolute top-[38px] left-0 w-full h-[171px] overflow-hidden cursor-grab"
      :class="{ 'cursor-grabbing': isDragging }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <div
        class="flex h-full"
        :class="{ 'transition-transform duration-300 ease-in-out': !isDragging }"
        :style="{
          transform: `translateX(${-currentSlide * 100 + (isDragging ? dragOffset : 0)}%)`,
        }"
      >
        <!-- 실제 목표들 -->
        <div v-for="goal in goalList" :key="goal.goalId" class="min-w-full h-full flex">
          <GoalCard
            :title="goal.goalName"
            :rate="goal.goalRate"
            :target-amount="goal.targetAmount"
            :total-amount="goal.totalAmount"
            :bar-chart-data="goalAccountData[goal.goalId] || []"
            :showLegend="false"
            :bg-color="'bg-white'"
          />
        </div>

        <!-- 목표 추가 버튼 -->
        <!-- 목표 추가 버튼 -->
        <div class="min-w-full h-full flex">
          <router-link
            to="/goal/edit"
            class="w-full h-[170px] bg-white hover:bg-indigo-50 transition-colors duration-200 flex flex-col items-center justify-center group"
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
          </router-link>
        </div>
      </div>
    </div>

    <!-- Slide Indicators -->
    <div v-if="totalSlides > 1" class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(slide, index) in totalSlides"
        :key="index"
        @click="currentSlide = index"
        :class="['w-2 h-2 rounded-full transition-colors', currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300']"
      ></button>
    </div>

    <!-- Navigation Arrows -->
    <!-- <button
      v-if="currentSlide > 0"
      @click="previousSlide"
      class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors z-20"
    >
      <span class="text-gray-600">‹</span>
    </button>

    <button
      v-if="currentSlide < totalSlides - 1"
      @click="nextSlide"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors z-20"
    >
      <span class="text-gray-600">›</span>
    </button> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";

import GoalCard from "@/components/goal/GoalCard.vue";
import goalApi from "@/api/objectApi";

use([CanvasRenderer, LineChart, TooltipComponent, LegendComponent, GridComponent]);

const props = defineProps({
  goalList: {
    type: Array,
    default: () => [],
  },
});

const currentSlide = ref(0);

// 총 슬라이드 개수 (목표 개수 + 새 목표 추가 버튼 1개)
const totalSlides = computed(() => props.goalList.length + 1);

// 목표별 계좌 데이터 저장
const goalAccountData = ref({});

// 스와이프 관련 상태
const touchStart = ref(0);
const touchEnd = ref(0);
const isDragging = ref(false);
const dragOffset = ref(0);

const nextSlide = () => {
  if (currentSlide.value < totalSlides.value - 1) currentSlide.value++;
};

const previousSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--;
};

// 목표별 계좌 데이터 가져오기
const fetchGoalAccountData = async (goalId) => {
  try {
    const data = await goalApi.getGoalAccountRates(goalId);
    console.log(`목표 ${goalId} 계좌 데이터:`, data);

    // 데이터가 없거나 빈 배열일 경우 더미 데이터 제공
    if (!data || data.length === 0) {
      console.log(`목표 ${goalId}에 대한 더미 데이터 생성`);
      goalAccountData.value[goalId] = [
        { name: "KB국민은행", value: 40 },
        { name: "신한은행", value: 35 },
        { name: "우리은행", value: 25 },
      ];
    } else {
      goalAccountData.value[goalId] = data;
    }
  } catch (error) {
    console.error(`목표 ${goalId} 계좌 데이터 불러오기 실패:`, error);
    // API 실패 시에도 더미 데이터 제공
    goalAccountData.value[goalId] = [
      { name: "KB국민은행", value: 40 },
      { name: "신한은행", value: 35 },
      { name: "우리은행", value: 25 },
    ];
  }
};

// 목표 리스트가 변경될 때마다 계좌 데이터 가져오기
watch(
  () => props.goalList,
  async (newGoalList) => {
    for (const goal of newGoalList) {
      await fetchGoalAccountData(goal.goalId);
    }
  },
  { immediate: true }
);

// 스와이프 이벤트 핸들러
const handleTouchStart = (e) => {
  touchStart.value = e.touches[0].clientX;
  isDragging.value = true;
  e.preventDefault();
};

const handleMouseDown = (e) => {
  touchStart.value = e.clientX;
  isDragging.value = true;
  e.preventDefault();
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;
  touchEnd.value = e.touches[0].clientX;
  updateDragOffset();
  e.preventDefault();
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  touchEnd.value = e.clientX;
  updateDragOffset();
};

const updateDragOffset = () => {
  const diff = touchEnd.value - touchStart.value;
  const containerWidth = 100; // 100% width
  dragOffset.value = (diff / window.innerWidth) * containerWidth;
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;
  handleSwipe();
  resetDrag();
};

const handleMouseUp = () => {
  if (!isDragging.value) return;
  handleSwipe();
  resetDrag();
};

const resetDrag = () => {
  isDragging.value = false;
  dragOffset.value = 0;
};

const handleSwipe = () => {
  const swipeDistance = touchStart.value - touchEnd.value;
  const minSwipeDistance = 50; // 최소 스와이프 거리

  if (Math.abs(swipeDistance) < minSwipeDistance) return;

  if (swipeDistance > 0) {
    // 왼쪽으로 스와이프 (다음 슬라이드)
    nextSlide();
  } else {
    // 오른쪽으로 스와이프 (이전 슬라이드)
    previousSlide();
  }
};
</script>
