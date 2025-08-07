<template>
  <div class="bg-white rounded-t-2xl shadow-lg w-full relative z-30 h-16 -mt-2">
    <div class="flex justify-around items-center h-full px-4">
      <!-- 리포트 -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('report')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="['w-6 h-6', selectedTab === 'report' ? 'text-indigo-600' : 'text-gray-400']"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 4.5h13.5v15H3V4.5zm13.5 6.75H21M18.75 9v3m0 0v3m0-3h-3"
          />
        </svg>
        <span :class="['text-xs font-medium mt-1', selectedTab === 'report' ? 'text-indigo-600' : 'text-gray-400']"
          >리포트</span
        >
      </div>

      <!-- 추천 -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('recommend')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="['w-6 h-6', selectedTab === 'recommend' ? 'text-indigo-600' : 'text-gray-400']"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3l2.25 4.5L9 8.25l-2.25 4.5L3 15m18-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span :class="['text-xs font-medium mt-1', selectedTab === 'recommend' ? 'text-indigo-600' : 'text-gray-400']"
          >추천</span
        >
      </div>

      <!-- 홈 (가운데) -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('home')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="['w-6 h-6', selectedTab === 'home' ? 'text-indigo-600' : 'text-gray-400']"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125A1.125 1.125 0 0 0 5.625 21h12.75a1.125 1.125 0 0 0 1.125-1.125V9.75"
          />
        </svg>
        <span :class="['text-xs font-medium mt-1', selectedTab === 'home' ? 'text-indigo-600' : 'text-gray-400']"
          >홈</span
        >
      </div>

      <!-- 목표 -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('goals')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="['w-6 h-6', selectedTab === 'goals' ? 'text-indigo-600' : 'text-gray-400']"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75V12l3 1.5M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
          />
        </svg>
        <span :class="['text-xs font-medium mt-1', selectedTab === 'goals' ? 'text-indigo-600' : 'text-gray-400']"
          >목표</span
        >
      </div>

      <!-- 리워드 -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('reward')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="['w-6 h-6', selectedTab === 'reward' ? 'text-indigo-600' : 'text-gray-400']"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75l2.25 4.5H9.75l2.25-4.5zM21 12.75A9 9 0 113 12.75a9 9 0 0118 0z"
          />
        </svg>
        <span :class="['text-xs font-medium mt-1', selectedTab === 'reward' ? 'text-indigo-600' : 'text-gray-400']"
          >리워드</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const tabRoutes = {
  report: "/report",
  recommend: "/recommend",
  home: "/main",
  goals: "/goal/detail",
  reward: "/reward",
};

function getTabByPath(path) {
  return Object.keys(tabRoutes).find((key) => tabRoutes[key] === path);
}

const selectedTab = ref(getTabByPath(route.path) || "home");

watch(
  () => route.path,
  (newPath) => {
    selectedTab.value = getTabByPath(newPath) || "home";
  }
);

function selectTab(tab) {
  selectedTab.value = tab;
  router.push(tabRoutes[tab]);
}
</script>
