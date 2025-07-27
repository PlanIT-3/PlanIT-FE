<template>
  <div class="h-screen flex flex-col">
    <!-- 메인 콘텐츠: 스크롤 가능 -->
    <div class="flex-1 overflow-y-auto">
      <slot></slot>
    </div>

    <!-- NavBar: 하단 고정 -->
    <NavBar class="sticky bottom-0 bg-white z-10" />
  </div>
</template>

<script setup>
import NavBar from "../common/NavBar.vue";
</script>
