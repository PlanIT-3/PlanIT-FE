<template>
  <div class="border border-gray-200 rounded-xl px-5 py-2 bg-white shadow-sm flex flex-col gap-0 w-full">
    <div class="font-semibold text-base text-gray-90">{{ goal }}</div>

    <div class="flex flex-row items-center justify-between w-full py-2">
      <div class="text-sm font-semibold text-gray-700 text-center flex-1">
        {{ PreProd }}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="w-4 h-4 text-gray-500 mx-2"
      >
        <path
          fill-rule="evenodd"
          d="M2 8c0 .414.336.75.75.75h8.69l-1.22 1.22a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 1 0-1.06 1.06l1.22 1.22H2.75A.75.75 0 0 0 2 8Z"
          clip-rule="evenodd"
        />
      </svg>
      <div class="text-sm font-semibold text-gray-90 text-center flex-1">
        {{ NextProd }}
      </div>
    </div>
    <div class="grid grid-cols-2">
      <div class="flex flex-col items-center justify-center py-2 text-center rounded-lg">
        <div class="text-xs text-gray-500">예상 수익률</div>
        <div class="font-bold text-lg text-gray-900 flex items-center justify-center gap-1">
          <span>{{ expectedYield }}</span>
          <span v-if="yieldChange" class="text-green-600 text-xs font-semibold flex items-center">
            ▲ {{ yieldChange }}
          </span>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center py-2 text-center">
        <div class="text-xs text-gray-500">위험도</div>
        <div class="font-bold text-lg" :class="riskColor">{{ riskLevel }}</div>
      </div>
    </div>
    <div
      class="mt-1 text-xs flex flex-col items-center justify-center text-center text-gray-600 bg-blue-50 p-2 rounded-lg whitespace-break-spaces"
    >
      <span>
        {{ comment }}
      </span>
      <span class="font-semibold text-blue-700">{{ comment2 }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  goal: { type: String, required: true },
  PreProd: { type: String, required: true },
  NextProd: { type: String, required: true },
  expectedYield: { type: String, required: true },
  yieldChange: { type: String, default: "" },
  riskLevel: { type: String, required: true },
  riskColor: { type: String, default: "text-red-600" },
  commentEmoji: { type: String, default: "⚠️" },
  comment: { type: String, default: "no_comment" },
  comment2: { type: String, default: "" },
});
</script>
