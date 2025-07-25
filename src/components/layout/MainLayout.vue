<script setup lang="ts">
import MainHeader from "../common/MainHeader.vue";
import NavBar from "../common/NavBar.vue";
</script>

<template>
  <MainHeader></MainHeader>
  <slot></slot>
  <NavBar></NavBar>
</template>
