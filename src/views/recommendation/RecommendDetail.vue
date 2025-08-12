<template>
  <transition name="slide-reverse">
    <div v-if="product" class="absolute top-0 left-0 w-80 h-full bg-white shadow-lg p-5 z-10">
      <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" @click="$emit('close')">X</button>
      <h2 class="text-2xl font-semibold mb-4">{{ product.name }}</h2>
      <p class="mb-2">가격: {{ product.price }}원</p>
      <p>설명: {{ product.description }}</p>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  product: Object,
});
</script>

<style scoped>
/* 반대 방향 슬라이드 애니메이션: 왼쪽에서 나가는 느낌 */
.slide-reverse-enter-active,
.slide-reverse-leave-active {
  transition: transform 0.3s ease;
}
.slide-reverse-enter-from {
  transform: translateX(-100%);
}
.slide-reverse-enter-to {
  transform: translateX(0);
}
.slide-reverse-leave-from {
  transform: translateX(0);
}
.slide-reverse-leave-to {
  transform: translateX(-100%);
}
</style>
