<template>
  <div class="bg-white rounded-t-2xl shadow-lg h-16 w-[393px] absolute left-0 top-[789px]">
    <div class="flex justify-around items-center h-full px-4">
      <!-- Home Button (Active) -->
      <div class="flex flex-col items-center">
        <div class="w-6 h-6 flex items-center justify-center text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <span class="text-xs text-indigo-600 font-medium mt-1">홈</span>
      </div>

      <!-- Goals Button -->
      <router-link to="/goals" class="flex flex-col items-center">
        <div class="w-6 h-6 flex items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <span class="text-xs text-gray-400 mt-1">목표</span>
      </router-link>

      <!-- Add Button (Center) -->
      <div class="flex flex-col items-center relative -top-5">
        <div class="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
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
        <span class="text-xs text-gray-500 mt-1">추가</span>
      </div>

      <!-- Investments Button -->
      <div class="flex flex-col items-center">
        <div class="w-6 h-6 flex items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span class="text-xs text-gray-400 mt-1">투자</span>
      </div>

      <!-- Profile Button -->
      <div class="flex flex-col items-center">
        <div class="w-6 h-6 flex items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <span class="text-xs text-gray-400 mt-1">프로필</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// 별도 로직 없음
</script>
