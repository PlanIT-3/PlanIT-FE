<template>
    <div class="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
      <div class="font-bold text-lg text-gray-900 mb-1">{{ title }}</div>
      <div class="grid grid-cols-3">
        <div class="flex flex-col items-center justify-center py-2 text-center">
          <div class="text-xs text-gray-500 mb-1">목표 달성</div>
          <div class="font-bold text-lg text-gray-900">{{ goalPeriod }}</div>
        </div>
        <div class="flex flex-col items-center justify-center py-2 text-center">
          <div class="text-xs text-gray-500 mb-1">예상 수익률</div>
          <div class="font-bold text-lg text-gray-900 flex items-center justify-center gap-1">
            <span>{{ expectedYield }}</span>
            <span v-if="yieldChange" class="text-green-600 text-xs font-semibold flex items-center">
              ▲ {{ yieldChange }}
            </span>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center py-2 text-center">
          <div class="text-xs text-gray-500 mb-1">위험도</div>
          <div class="font-bold text-lg" :class="riskColor">{{ riskLevel }}</div>
        </div>
      </div>
      <div class="mt-2 text-sm">
        <span class="mr-1">{{ commentEmoji }}</span>
        <span>
          <b> {{ comment }}</b>
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    title: { type: String, required: true },
    expectedYield: { type: String, required: true },
    yieldChange: { type: String, default: '' },
    goalPeriod: { type: String, required: true },
    riskLevel: { type: String, required: true },
    riskColor: { type: String, default: 'text-red-600' },
    commentEmoji: { type: String, default: '⚠️' },
    comment: { type: String, default: 'no_comment' },
  });
  </script> 