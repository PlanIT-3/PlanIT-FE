<template>
  <div class="border border-gray-200 rounded-xl p-4 flex flex-col gap-2 bg-white shadow-sm">
    <div class="flex justify-between items-center">
      <div>
        <div class="font-bold text-base text-gray-900">{{ title }}</div>
        <div class="text-xs text-gray-500">{{ ratio }}</div>
      </div>
      <!-- 위험도 뱃지 -->
      <span
        :class="[
          'px-3 py-1 rounded-full text-xs font-bold',
          riskVariant === 'one' && 'bg-black text-white',
          riskVariant === 'two' && 'bg-gray-100 text-black',
          riskVariant === 'three' && 'bg-red-500 text-white',
        ]"
        aria-label="위험도"
      >
        {{ risk }}
      </span>
    </div>
    <div class="flex justify-between items-center mt-2">
      <div class="text-green-600 font-bold text-base">{{ yield }}</div>
      <button
        type="button"
        class="border border-gray-300 rounded-lg px-4 py-1 text-sm font-medium transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        상세보기
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  ratio: String,
  yield: String,
  risk: String,
  riskVariant: String,
});
</script>
