<template>
  <div class="w-[346px] h-[191px] bg-[#dbeafe] rounded-[10px] p-4 flex items-start justify-center">
    <div class="w-full">
      <h2 v-if="$slots.title" class="text-[16px] font-semibold text-[#12512a] mt-[1px] mb-7">
        <slot name="title"> 🔍 요약 한 마디 </slot>
      </h2>
      <p class="text-[14px] font-medium text-[#18703a] whitespace-pre-line">
        <slot />
      </p>
    </div>
  </div>
</template>

<script setup></script>
