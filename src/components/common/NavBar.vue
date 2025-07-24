<template>
  <div class="bg-white rounded-t-2xl shadow-lg h-16 w-[393px] absolute left-0 top-[789px] z-11">
    <div class="flex justify-around items-center h-full px-4">
      <!-- Home Button -->
      <div class="flex flex-col items-center cursor-pointer" @click="selectedTab = 'home'">
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
      <div class="flex flex-col items-center cursor-pointer" @click="selectedTab = 'goals'">
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
      <div class="flex flex-col items-center relative -top-5">
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
      <div class="flex flex-col items-center cursor-pointer" @click="selectedTab = 'invest'">
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
      <div class="flex flex-col items-center cursor-pointer" @click="selectedTab = 'reward'">
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
              d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
            />
          </svg>
        </div>
        <span :class="['text-xs mt-1', selectedTab === 'reward' ? 'text-indigo-600 font-medium' : 'text-gray-400']"
          >리워드</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const selectedTab = ref("home");
</script>
