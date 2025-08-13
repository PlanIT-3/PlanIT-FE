<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Button from "@/components/base/Button.vue";
import GoBackButton from "@/components/base/GoBackButton.vue";
import { registerMultipleAccounts } from "@/api/accountApi.js";

// SVG 아이콘들을 직접 import (실제로 존재하는 파일들만)
import KBIcon from "@/assets/icons/bank/KB.svg";
import ShinhanIcon from "@/assets/icons/bank/신한.svg";
import HanaIcon from "@/assets/icons/bank/하나.svg";
import WooriIcon from "@/assets/icons/bank/우리.svg";
import KakaoIcon from "@/assets/icons/bank/카카오뱅크.svg";
import KBankIcon from "@/assets/icons/bank/케이뱅크.svg";
import IBKIcon from "@/assets/icons/bank/IBK.svg";
import NHIcon from "@/assets/icons/bank/농협.svg";
import SCIcon from "@/assets/icons/bank/SC제일.svg";
import BNKIcon from "@/assets/icons/bank/BNK.svg";
import GwangjuIcon from "@/assets/icons/bank/광주.svg";
import SaemaulIcon from "@/assets/icons/bank/MG새마을금고.svg";
import CitiIcon from "@/assets/icons/bank/씨티.svg";
import ShIcon from "@/assets/icons/bank/Sh수협.svg";
import TossIcon from "@/assets/icons/bank/토스.svg";
import KoreaIcon from "@/assets/icons/bank/한국투자.svg";
import ShinhyupIcon from "@/assets/icons/bank/신협.svg";
import PostIcon from "@/assets/icons/bank/우체국.svg";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const selectedBanks = ref([]);
const selectedSecurities = ref([]);
const isLoggingIn = ref(false);
const currentBankIndex = ref(0); // 현재 처리 중인 은행 인덱스
const completedBanks = ref([]); // 완료된 은행들
const imageLoadError = ref(false); // 이미지 로딩 에러 상태

// 이미지 로딩 에러 처리
function handleImageError() {
  console.warn("은행 로고 이미지 로딩 실패:", firstBankIcon.value);
  imageLoadError.value = true;
}

// 이미지 로딩 성공 처리
function handleImageLoad() {
  console.log("은행 로고 이미지 로딩 성공:", firstBankIcon.value);
  imageLoadError.value = false;
}

// 은행명을 파일명으로 매핑하는 함수
function getBankIconByName(bankName) {
  const bankIconMap = {
    KB국민은행: KBIcon,
    신한은행: ShinhanIcon,
    하나은행: HanaIcon,
    우리은행: WooriIcon,
    카카오뱅크: KakaoIcon,
    케이뱅크: KBankIcon,
    IBK기업은행: IBKIcon,
    NH농협은행: NHIcon,
    SC제일은행: SCIcon,
    BNK부산은행: BNKIcon,
    BNK경남은행: BNKIcon,
    광주은행: GwangjuIcon,
    제주은행: GwangjuIcon, // 제주은행은 광주은행 아이콘 사용
    새마을금고: SaemaulIcon,
    씨티은행: CitiIcon,
    지역농협: NHIcon,
    iM뱅크: ShIcon,
    전북은행: ShIcon,
    우체국: PostIcon,
    SH수협은행: ShIcon,
    토스뱅크: TossIcon,
    한국산업은행: KoreaIcon,
    신협: ShinhyupIcon,
  };

  try {
    const iconPath = bankIconMap[bankName];
    if (iconPath) {
      // SVG 파일 경로 유효성 검사
      return iconPath;
    }
  } catch (error) {
    console.warn("은행 아이콘 경로 처리 중 오류:", error);
  }

  // 기본값으로 KB 로고 반환
  return KBIcon;
}

// 은행명을 organizationId로 매핑하는 함수
function getBankOrganizationId(bankName) {
  const bankOrgMap = {
    신한은행: "0088",
    KB국민은행: "0004",
    하나은행: "0004", // 기본값
    우리은행: "0004", // 기본값
    카카오뱅크: "0004", // 기본값
    케이뱅크: "0004", // 기본값
    IBK기업은행: "0004", // 기본값
    NH농협은행: "0004", // 기본값
    SC제일은행: "0004", // 기본값
    BNK부산은행: "0004", // 기본값
    BNK경남은행: "0004", // 기본값
    광주은행: "0004", // 기본값
    제주은행: "0004", // 기본값
    새마을금고: "0004", // 기본값
    씨티은행: "0004", // 기본값
    지역농협: "0004", // 기본값
    iM뱅크: "0004", // 기본값
    전북은행: "0004", // 기본값
    우체국: "0004", // 기본값
    SH수협은행: "0004", // 기본값
    토스뱅크: "0004", // 기본값
    한국산업은행: "0004", // 기본값
  };

  return bankOrgMap[bankName] || "0004"; // 기본값으로 0004
}

// 첫 번째 선택된 은행의 로고 URL
const firstBankIcon = computed(() => {
  if (selectedBanks.value.length > 0) {
    return getBankIconByName(selectedBanks.value[currentBankIndex.value]);
  }
  return KBIcon; // 기본값
});

// 현재 처리 중인 은행명
const currentBankName = computed(() => {
  if (selectedBanks.value.length > 0) {
    return selectedBanks.value[currentBankIndex.value];
  }
  return "";
});

// 현재 은행이 마지막인지 확인
const isLastBank = computed(() => {
  return currentBankIndex.value === selectedBanks.value.length - 1;
});

onMounted(() => {
  console.log("BankLoginView 마운트됨");

  // 이미지 에러 상태 초기화
  imageLoadError.value = false;

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

  // 현재 은행 인덱스 설정
  if (route.query.currentIndex) {
    try {
      currentBankIndex.value = parseInt(route.query.currentIndex);
      console.log("현재 은행 인덱스 설정:", currentBankIndex.value);
    } catch (error) {
      console.error("은행 인덱스 파싱 오류:", error);
      currentBankIndex.value = 0;
    }
  }

  // 완료된 은행들 설정
  if (route.query.completedBanks) {
    try {
      completedBanks.value = JSON.parse(route.query.completedBanks);
      console.log("완료된 은행들:", completedBanks.value);
    } catch (error) {
      console.error("완료된 은행 데이터 파싱 오류:", error);
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
  console.log("🔐 로그인 시작:", {
    email: email.value,
    currentBank: currentBankName.value,
    currentIndex: currentBankIndex.value,
    isLast: isLastBank.value,
  });

  try {
    console.log("🚀 registerMultipleAccounts 호출 시작");

    // 현재 은행만 처리 (last 값은 마지막 은행일 때만 true)
    const result = await registerMultipleAccounts(
      email.value,
      password.value,
      [currentBankName.value], // 현재 은행만
      [], // 증권사는 현재 은행 처리 후에
      getBankOrganizationId(currentBankName.value),
      isLastBank.value // 마지막 은행일 때만 true
    );

    console.log("📊 API 결과:", result);
    console.log("🔍 result.accessToken:", result.accessToken);
    console.log("🔍 result.refreshToken:", result.refreshToken);
    console.log("🔍 result.connectedId:", result.connectedId);
    console.log("🔍 result.results:", result.results);

    if (result.success) {
      // 토큰이 있으면 로컬스토리지에 저장
      if (result.accessToken && result.refreshToken) {
        console.log("✅ 토큰이 존재함 - Auth Store에 저장");

        // Auth Store에 토큰 저장
        authStore.setToken({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        // 로컬스토리지에도 직접 저장 (기존 구조 유지)
        const existingAuth = localStorage.getItem("auth");
        let authData;

        if (existingAuth) {
          // 기존 auth 데이터가 있으면 토큰만 업데이트
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
            // 파싱 실패 시 새로 생성
            authData = {
              token: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
              },
            };
          }
        } else {
          // 기존 auth 데이터가 없으면 새로 생성
          authData = {
            token: {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            },
          };
        }

        localStorage.setItem("auth", JSON.stringify(authData));

        console.log("🔑 로컬스토리지 업데이트 완료:", authData);

        // 새로 발급받은 토큰을 콘솔에 출력
        console.log("🔑 새로 발급받은 토큰:", {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          connectedId: result.connectedId,
          tokenLength: {
            accessToken: result.accessToken.length,
            refreshToken: result.refreshToken.length,
          },
        });

        console.log("🔑 토큰 저장 완료:", {
          accessToken: result.accessToken.substring(0, 20) + "...",
          refreshToken: result.refreshToken.substring(0, 20) + "...",
          connectedId: result.connectedId,
        });
      } else {
        console.log("❌ 토큰이 없음:", {
          hasAccessToken: !!result.accessToken,
          hasRefreshToken: !!result.refreshToken,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
      }

      // 현재 은행을 완료된 목록에 추가
      completedBanks.value.push(currentBankName.value);

      if (isLastBank.value) {
        // 마지막 은행이면 계좌 연동 완료 페이지로 이동
        const bankList = selectedBanks.value.join(", ");
        const securityList = selectedSecurities.value.length > 0 ? selectedSecurities.value.join(", ") : "없음";

        alert(`모든 계정 등록 완료!\n선택된 은행: ${bankList}\n선택된 증권사: ${securityList}`);
        router.push("/account-link-complete");
      } else {
        // 다음 은행이 있으면 다음 은행 로그인 페이지로 이동
        currentBankIndex.value++;
        alert(`${currentBankName.value} 연동 완료! 다음 은행으로 이동합니다.`);

        // 다음 은행 정보와 함께 같은 페이지로 이동 (새로운 요청)
        router.push({
          path: "/bank-login",
          query: {
            selectedBanks: JSON.stringify(selectedBanks.value),
            selectedSecurities: JSON.stringify(selectedSecurities.value),
            currentIndex: currentBankIndex.value,
            completedBanks: JSON.stringify(completedBanks.value),
          },
        });
      }
    } else {
      alert(`${currentBankName.value} 연동에 실패했습니다. 다시 시도해주세요.`);
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
  } finally {
    isLoggingIn.value = false;
    console.log("🏁 로그인 프로세스 완료");
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white px-6 pt-6 pb-0 items-center relative">
    <!-- 상단 뒤로가기 -->
    <GoBackButton />

    <div class="h-10"></div>
    <h2 class="text-2xl font-semibold text-center mb-3 mt-6">은행 로그인</h2>
    <span class="text-sm text-center mb-6">실제 은행 이메일과 비밀번호를 입력하세요.</span>

    <!-- 동적 은행 로고 -->
    <div v-if="!imageLoadError" class="w-24 h-24 mx-auto mb-8">
      <img
        :src="firstBankIcon"
        :alt="selectedBanks[0] || '은행 로고'"
        class="w-full h-full"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>

    <!-- 이미지 로딩 실패 시 기본 아이콘 -->
    <div v-else class="w-24 h-24 mx-auto mb-8 bg-blue-500 rounded-full flex items-center justify-center">
      <span class="text-white text-2xl font-bold">
        {{ currentBankName.charAt(0) || "B" }}
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
              d="M3.98 8.223A10.477 10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
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
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
    </div>
    <Button label="Login" @click="login" class="w-full max-w-md mb-10" />
    <!-- 하단 프로그레스 -->
    <div class="flex items-center justify-center w-full max-w-md mt-auto py-16">
      <div class="flex-1 flex items-center">
        <div class="w-6 h-6 rounded-full bg-[#433D8B] flex items-center justify-center text-white">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 8 7 11 12 5" />
          </svg>
        </div>
        <div class="h-0.5 bg-[#433D8B] flex-1"></div>
        <div class="w-6 h-6 rounded-full bg-[#433D8B] flex items-center justify-center text-white">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 8 7 11 12 5" />
          </svg>
        </div>
        <div class="h-0.5 bg-gray-300 flex-1"></div>
        <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="8" cy="8" r="6" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  color: #e8ecf4;
  opacity: 1;
}
</style>
