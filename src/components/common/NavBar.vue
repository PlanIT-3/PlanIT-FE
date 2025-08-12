<template>
  <div class="bg-white rounded-t-2xl shadow-lg w-full relative z-30 h-16 -mt-2">
    <div class="flex justify-around items-center h-full px-4">
      <!-- Home Button -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('home')">
        <div
          :class="[
            'w-6 h-6 flex items-center justify-center',
            selectedTab === 'home' ? 'text-indigo-600' : 'text-gray-400',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </div>
        <span :class="['text-xs font-medium mt-1', selectedTab === 'home' ? 'text-indigo-600' : 'text-gray-400']"
          >홈</span
        >
      </div>

      <!-- Goals Button -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('goals')">
        <div
          :class="[
            'w-6 h-6 flex items-center justify-center',
            selectedTab === 'goals' ? 'text-indigo-600' : 'text-gray-400',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
            />
          </svg>
        </div>
        <span :class="['text-xs mt-1', selectedTab === 'goals' ? 'text-indigo-600 font-medium' : 'text-gray-400']"
          >목표</span
        >
      </div>

      <!-- Add Button (Center) -->
      <div class="flex flex-col items-center relative -top-5" @click="selectTab('add')">
        <div
          class="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 hover:bg-indigo-700 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>

      <!-- Investments Button -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('invest')">
        <div
          :class="[
            'w-6 h-6 flex items-center justify-center',
            selectedTab === 'invest' ? 'text-indigo-600' : 'text-gray-400',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
            />
          </svg>
        </div>
        <span :class="['text-xs mt-1', selectedTab === 'invest' ? 'text-indigo-600 font-medium' : 'text-gray-400']"
          >투자</span
        >
      </div>

      <!-- Profile Button -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectTab('reward')">
        <div
          :class="[
            'w-6 h-6 flex items-center justify-center',
            selectedTab === 'reward' ? 'text-indigo-600' : 'text-gray-400',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 17.25v-4.5m3 4.5v-1.5m3 1.5v-6m3.75 8.25H5.25a2.25 2.25 0 01-2.25-2.25V5.25a2.25 2.25 0 012.25-2.25h9.75L19.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25z"
            />
          </svg>
        </div>
        <span :class="['text-xs mt-1', selectedTab === 'reward' ? 'text-indigo-600 font-medium' : 'text-gray-400']"
          >리포트</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const tabRoutes = {
  home: "/main",
  goals: "/goal",
  invest: "/recommend",
  reward: "/report",
  add: "/goal/edit",
};

// 경로 기반으로 탭 이름 역으로 찾기
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
