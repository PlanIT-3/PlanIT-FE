<template>
  <div class="w-[346px] h-[69px] bg-[#dbeafe] rounded-[10px] p-4 flex items-start justify-center">
    <div class="w-full text-[14px] leading-[20px] text-[#18703a]">
      <span class="font-bold text-[#12512a]">
        <slot name="title"> 거의 다 왔어요! </slot>
      </span>
      <slot />
    </div>
  </div>
</template>

<script setup>
//
</script>
