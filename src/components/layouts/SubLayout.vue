<!-- 루트 애플리케이션 컴포넌트 -->
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div id="app" class="w-[393px] min-h-[852px] bg-white shadow-md overflow-hidden relative flex flex-col">
      <OnboardingHeader />
      <div class="flex-1 w-full bg-white rounded-t-3xl rounded-b-3xl shadow-lg px-6 pt-12 pb-8 flex flex-col justify-start items-center z-20 -mt-[54px]">
        <slot />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import OnboardingHeader from "@/components/common/OnboardingHeader.vue";
</script>

<style>

</style>
