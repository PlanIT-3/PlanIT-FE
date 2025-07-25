<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goBack() {
  router.back();
}
</script>

<template>
  <div>
    <button
      @click="goBack"
      class="left-4 top-6 w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="#222"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  </div>
</template>
