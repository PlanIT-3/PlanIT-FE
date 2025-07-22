<script setup>
defineProps({
  label: String,
});
</script>

<template>
  <div class="Button p-4">
    <button
      class="w-full px-6 py-4 bg-[#433D8B] text-white text-lg font-medium rounded-lg hover:bg-[#3a3376] transition-colors"
    >
      {{ label }}
    </button>
  </div>
</template>

<style scoped></style>
