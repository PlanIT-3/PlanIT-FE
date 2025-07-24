<template>
  <div class="w-full h-screen flex items-center justify-center" :style="{ backgroundImage: `url(${background})` }">
    <img :src="logo" class="w-32 h-auto" />
  </div>
</template>

<script setup>
import background from "@/assets/images/background.png";
import logo from "@/assets/images/logo.svg";
</script>

<style scoped></style>
