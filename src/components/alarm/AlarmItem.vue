<template>
  <div class="w-full px-4 py-3 border border-gray-300 bg-[#C7BFE2]/20 rounded-md shadow-sm">
    <p class="text-sm font-semibold text-gray-800 whitespace-pre-line">{{ message }}</p>
    <p class="text-xs text-gray-400 mt-1">{{ time }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: String,
  time: String,
});
</script>
