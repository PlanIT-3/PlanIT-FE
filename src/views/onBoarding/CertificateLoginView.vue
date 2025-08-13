<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Button from "@/components/base/Button.vue";
import GoBackButton from "@/components/base/GoBackButton.vue";
import BankLoginProgress from "@/components/onBoarding/BankLoginProgress.vue";
import { registerMultipleAccounts } from "@/api/accountApi.js";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const selectedBanks = ref([]);
const selectedSecurities = ref([]);
const isLoggingIn = ref(false);
const currentSecurityIndex = ref(0); // 현재 처리 중인 증권사 인덱스
const completedBanks = ref([]); // 완료된 은행들
const completedSecurities = ref([]); // 완료된 증권사들

// 현재 처리 중인 증권사명
const currentSecurityName = computed(() => {
  if (selectedSecurities.value.length > 0) {
    return selectedSecurities.value[currentSecurityIndex.value];
  }
  return "";
});

// 현재 증권사가 마지막인지 확인
const isLastSecurity = computed(() => {
  return currentSecurityIndex.value === selectedSecurities.value.length - 1;
});

onMounted(() => {
  console.log("CertificateLoginView 마운트됨");

  // 쿼리 파라미터에서 선택된 은행과 증권사 파싱
  if (route.query.selectedBanks) {
    try {
      selectedBanks.value = JSON.parse(route.query.selectedBanks);
      console.log("선택된 은행들:", selectedBanks.value);
    } catch (error) {
      console.error("은행 데이터 파싱 오류:", error);
    }
  }

  if (route.query.selectedSecurities) {
    try {
      selectedSecurities.value = JSON.parse(route.query.selectedSecurities);
      console.log("선택된 증권사들:", selectedSecurities.value);
    } catch (error) {
      console.error("증권사 데이터 파싱 오류:", error);
    }
  }

  // 완료된 은행들 설정
  if (route.query.completedBanks) {
    try {
      completedBanks.value = JSON.parse(route.query.completedBanks);
      console.log("완료된 은행들:", completedBanks.value);
    } catch (error) {
      console.error("완료된 은행 데이터 파싱 오류:", error);
      completedBanks.value = [];
    }
  }
});

async function login() {
  if (!email.value || !password.value) {
    alert("이메일과 비밀번호를 입력해주세요.");
    return;
  }

  if (isLoggingIn.value) {
    console.log("🚫 이미 로그인 중입니다. 중복 호출 방지");
    return;
  }

  isLoggingIn.value = true;
  console.log("🔐 증권사 로그인 시작:", {
    email: email.value,
    currentSecurity: currentSecurityName.value,
    currentIndex: currentSecurityIndex.value,
    isLast: isLastSecurity.value,
  });

  try {
    console.log("🚀 registerMultipleAccounts 호출 시작");

    // 현재 증권사만 처리
    const result = await registerMultipleAccounts(
      email.value,
      password.value,
      [], // 은행은 이미 완료됨
      [currentSecurityName.value], // 현재 증권사만
      "0004", // 증권사 기본 organization ID
      isLastSecurity.value // 마지막 증권사일 때만 true
    );

    console.log("📊 API 결과:", result);

    if (result.success) {
      // 토큰이 있으면 로컬스토리지에 저장
      if (result.accessToken && result.refreshToken) {
        console.log("✅ 토큰이 존재함 - Auth Store에 저장");

        // Auth Store에 토큰 저장
        authStore.setToken({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        // 로컬스토리지에도 직접 저장
        const existingAuth = localStorage.getItem("auth");
        let authData;

        if (existingAuth) {
          try {
            const parsed = JSON.parse(existingAuth);
            authData = {
              ...parsed,
              token: {
                ...parsed.token,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
              },
            };
          } catch (error) {
            authData = {
              token: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
              },
            };
          }
        } else {
          authData = {
            token: {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            },
          };
        }

        localStorage.setItem("auth", JSON.stringify(authData));
        console.log("🔑 로컬스토리지 업데이트 완료:", authData);
      }

      // 현재 증권사를 완료된 목록에 추가
      completedSecurities.value.push(currentSecurityName.value);

      if (isLastSecurity.value) {
        // 마지막 증권사이면 계좌 연동 완료 페이지로 이동
        const bankList = selectedBanks.value.join(", ");
        const securityList = selectedSecurities.value.join(", ");
        alert(`모든 계정 등록 완료!\n선택된 은행: ${bankList}\n선택된 증권사: ${securityList}`);
        router.push("/account-link-complete");
      } else {
        // 다음 증권사가 있으면 다음 증권사 로그인 페이지로 이동
        currentSecurityIndex.value++;
        router.push({
          path: "/certificate-login",
          query: {
            selectedBanks: JSON.stringify(selectedBanks.value),
            selectedSecurities: JSON.stringify(selectedSecurities.value),
            completedBanks: JSON.stringify(completedBanks.value),
            completedSecurities: JSON.stringify(completedSecurities.value),
          },
        });
      }
    } else {
      alert(
        `❌ ${currentSecurityName.value} 연동에 실패했습니다.\n(${currentSecurityIndex.value + 1}/${selectedSecurities.value.length}) 다시 시도해주세요.`
      );
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
  } finally {
    isLoggingIn.value = false;
    console.log("🏁 증권사 로그인 프로세스 완료");
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white px-6 pt-6 pb-0 items-center relative">
    <!-- 상단 뒤로가기 -->
    <GoBackButton />

    <div class="h-10"></div>
    <h2 class="text-2xl font-semibold text-center mb-3 mt-6">증권사 로그인</h2>
    <span class="text-sm text-center mb-6">실제 증권사 아이디와 비밀번호를 입력하세요.</span>

    <!-- 증권사 로고 -->
    <div class="w-24 h-24 mx-auto mb-8 bg-blue-500 rounded-full flex items-center justify-center">
      <span class="text-white text-2xl font-bold">
        {{ currentSecurityName.charAt(0) || "S" }}
      </span>
    </div>

    <div class="w-full max-w-md flex flex-col gap-4 mb-8">
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
      />
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Enter your password"
          class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-[#433D8B] pr-12"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          @click="showPassword = !showPassword"
        >
          <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        </button>
      </div>
    </div>

    <Button
      :label="isLoggingIn ? '연동 중...' : 'Login'"
      @click="login"
      :disabled="isLoggingIn || !email || !password"
      class="w-full max-w-md mb-10"
    />

    <!-- 하단 프로그래스 바 -->
    <BankLoginProgress
      :total-steps="selectedBanks.length + selectedSecurities.length"
      :completed-steps="completedBanks.length + completedSecurities.length"
    />
  </div>
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
