<script setup>
import GoBackButton from "@/components/base/goBackButton.vue";
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white">
    <GoBackButton />
    <div class="h-10"></div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="0.5"
      stroke="currentColor"
      class="w-20 h-20"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
    <h2 class="text-2xl font-normal text-center mb-3 mt-6">계좌 연동 성공</h2>
  </div>
</template>
<style scoped></style>
