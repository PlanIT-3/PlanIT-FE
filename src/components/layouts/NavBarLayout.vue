<template>
  <div class="h-full flex flex-col">
    <div class="flex-1">
      <slot></slot>
    </div>

    <NavBar class="flex-shrink-0" />
  </div>
</template>

<script setup>
import NavBar from "../common/NavBar.vue";
</script>
