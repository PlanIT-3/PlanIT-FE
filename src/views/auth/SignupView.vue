<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div class="absolute top-5 left-0 w-full flex items-center h-16 px-6 bg-white z-10">
      <goBackButton />
    </div>

    <div class="w-full max-w-md px-6 relative">
      <div class="pt-10">
        <h1 class="text-2xl font-extrabold text-black mb-10">회원가입</h1>
        <form @submit.prevent="handleRegister" class="space-y-4 mb-4">
          <BaseTextInput v-model="formData.username" type="text" placeholder="Username" />
          <BaseTextInput v-model="formData.email" type="text" placeholder="Email" />
          <BaseTextInput v-model="formData.password" type="password" placeholder="Password" />
          <BaseTextInput v-model="formData.confirmPassword" type="password" placeholder="Confirm Password" />
          <Button label="Sign Up" type="button" class="mt-4" />
        </form>

        <div class="text-center mb-6">
          <p class="text-gray-500 text-sm mb-4">Or Register with</p>
          <div class="flex justify-center gap-4"></div>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-indigo-600 font-medium ml-1">Login Now</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/base/Button.vue";
import goBackButton from "@/components/base/GoBackButton.vue";
import BaseTextInput from "@/components/base/BaseTextInput.vue";

// import { useAuthStore } from "@/stores/user";

const router = useRouter();
// const auth = useAuthStore();

const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const redirectToKakao = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
};

const redirectToNaver = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/naver";
};

const handleRegister = async () => {
  if (!formData.username || !formData.email || !formData.password) {
    alert("모든 필드를 입력해주세요.");
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    await auth.signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
    alert("회원가입이 완료되었습니다!");
    router.push("/login");
  } catch (error) {
    const msg = error?.response?.data?.message || "회원 가입 실패";
    alert("회원 가입 실패: " + msg);
  }
};
</script>
