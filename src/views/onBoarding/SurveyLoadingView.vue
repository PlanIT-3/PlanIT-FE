<template>
  <div
    class="w-full h-screen flex items-center justify-center"
    :style="{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="flex flex-col items-center">
      <!-- 로고: 가운데 고정 -->
      <img :src="logo" class="w-32 h-20" />

      <!-- 버튼: 아래로 내림 -->
      <button
        class="mt-10 px-6 py-3 bg-[#433D8B] hover:bg-[#3c3497] text-white text-sm border border-white font-semibold rounded-lg shadow bg-opacity-70"
      >
        투자 성향 검사하기
      </button>
    </div>
  </div>
</template>

<script setup>
import background from "@/assets/images/background.png";
import logo from "@/assets/images/logo.svg";
</script>

<style scoped></style>
