<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div class="absolute top-5 left-0 w-full flex items-center h-16 px-6 bg-white z-10">
      <button @click="router.back()" class="p-0 h-8 w-8 bg-transparent border-none cursor-pointer">
        <ChevronLeftIcon class="h-5 w-5" />
      </button>
    </div>
    <div class="w-full max-w-md px-6 relative">
      <div class="">
        <h1 class="text-2xl font-extrabold text-black mb-10">로그인</h1>
        <form @submit.prevent="handleRegister" class="space-y-4 mb-8">
          <input
            v-model="formData.email"
            type="text"
            placeholder="Enter your email"
            class="w-full h-14 rounded-lg border border-[#E8ECF4] bg-[#F7F8F9] px-4 text-black placeholder:text-gray-500 focus:outline-none focus:ring-indigo-500"
          />
          <input
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            class="w-full h-14 rounded-lg border border-[#E8ECF4] bg-[#F7F8F9] px-4 text-black placeholder:text-gray-500 focus:outline-none focus:ring-indigo-500"
          />
          <Button label="Login" type="button" class="mt-4" />
        </form>
        <div class="text-center mb-6">
          <p class="text-gray-500 text-sm mb-4">Or Login with</p>
          <div class="flex justify-center gap-4">
            <button
              class="w-[80px] h-[44px] flex items-center justify-center rounded-lg border border-gray-300 bg-yellow-300"
              @click="redirectToKakao"
            >
              <img :src="KaKaoLogo" alt="Kakao Logo" class="w-full h-full object-cover  rounded-lg" />
            </button>
            <button
              class="w-[80px] h-[44px] flex items-center justify-center rounded-lg border border-gray-300 bg-[#03C75A]"
              @click="redirectToNaver"
            >
               <img :src="NaverLogo" alt="Naver Logo"  class="w-full h-full object-cover  rounded-lg" />
            </button>
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-600">
            회원가입하기
            <router-link to="/signup" class="text-indigo-600 font-medium ml-1">signup</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
// import { useAuthStore } from "@/stores/user";
import { ChevronLeft as ChevronLeftIcon } from "lucide-vue-next";
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import KaKaoLogo from "@/assets/kakao.png";
import NaverLogo from "@/assets/naver.png";

const router = useRouter();
// const auth = useAuthStore();

const formData = reactive({
  email: "",
  password: "",
});

const redirectToKakao = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
};

const redirectToNaver = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/naver";
};

const handleRegister = async () => {
  if (!formData.email || !formData.password) {
    alert("모든 필드를 입력해주세요. ");
    return;
  }
  try {
    // await auth.LogIn({
    //   email: formData.email,
    //   password: formData.password,
    // });
    // router.push("/home");
  } catch (error) {
    const msg = error?.response?.data?.message || "로그인 실패";
    alert("로그인 실패: " + msg);
  }
};
</script>
