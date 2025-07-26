<template>
  <div class="flex justify-between items-center border-b py-3">
    <p class="text-sm font-extrabold text-gray-800 ml-5">{{ title }}</p>
    <label class="relative inline-block w-11 h-6 cursor-pointer">
      <!-- 체크박스 (숨김) -->
      <input
        type="checkbox"
        class="sr-only peer"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <!-- 배경 -->
      <div class="w-11 h-6 bg-gray-300 peer-checked:bg-[#433D8B] rounded-full transition-colors"></div>
      <!-- 흰색 동그라미 -->
      <div
        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"
      ></div>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
});
defineEmits(["update:modelValue"]);
</script>
