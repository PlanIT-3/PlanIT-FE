<template>
  <div
    class="w-full h-screen flex items-center justify-center cursor-pointer fade-container"
    :class="{ 'fade-out': isFadingOut }"
    :style="{ backgroundImage: `url(${background})` }"
    @click="navigateToNextPage"
  >
    <img :src="logo" class="w-32 h-auto" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import background from "@/assets/images/background.png";
import logo from "@/assets/images/logo.svg";

const auth = useAuthStore();
const router = useRouter();
const isFadingOut = ref(false);

const navigateToNextPage = () => {
  isFadingOut.value = true;
  setTimeout(() => {
    if (auth.isLoggedIn) {
      router.push("/main");
    } else {
      router.push("/login");
    }
  }, 500);
};

onMounted(() => {
  // 인증 상태 초기화
  auth.initAuth();

  setTimeout(() => {
    navigateToNextPage();
  }, 3000);
});
</script>

<style scoped>
.fade-container {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.fade-out {
  opacity: 0;
}
</style>
