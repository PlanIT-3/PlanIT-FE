<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Button from "@/components/base/Button.vue";
import GoBackButton from "@/components/base/GoBackButton.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import LoadingModal from "@/components/common/LoadingModal.vue";
import OnboardingProgress from "@/components/onBoarding/OnboardingProgress.vue";
import BankLoginProgress from "@/components/onBoarding/BankLoginProgress.vue";
import { registerMultipleAccounts } from "@/api/accountApi.js";

// SVG 아이콘들을 직접 import (실제로 존재하는 파일들만)
import KBIcon from "@/assets/icons/bank/KB국민은행.svg";
import ShinhanIcon from "@/assets/icons/bank/신한은행.svg";
import HanaIcon from "@/assets/icons/bank/하나은행.svg";
import WooriIcon from "@/assets/icons/bank/우리은행.svg";
import KBankIcon from "@/assets/icons/bank/케이뱅크.svg";
import IBKIcon from "@/assets/icons/bank/IBK기업은행.svg";
import NHIcon from "@/assets/icons/bank/농협은행.svg";
import SCIcon from "@/assets/icons/bank/SC제일은행.svg";
import BNKIcon from "@/assets/icons/bank/부산은행.svg";
import GwangjuIcon from "@/assets/icons/bank/광주은행.svg";
import SaemaulIcon from "@/assets/icons/bank/새마을금고.svg";
import CitiIcon from "@/assets/icons/bank/한국씨티은행.svg";
import ShIcon from "@/assets/icons/bank/수협은행.svg";
import KoreaIcon from "@/assets/icons/bank/한국산업은행.svg";
import ShinhyupIcon from "@/assets/icons/bank/신협.svg";
import PostIcon from "@/assets/icons/bank/우체국.svg";
import DaeguIcon from "@/assets/icons/bank/대구은행.svg";
import JejuIcon from "@/assets/icons/bank/제주은행.svg";
import JeonbukIcon from "@/assets/icons/bank/전북은행.svg";
import GyeongnamIcon from "@/assets/icons/bank/경남은행.svg";

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
const errorModal = ref(null); // 에러 모달 참조
const errorMessage = ref(""); // 에러 메시지
const isLoading = ref(false); // 로딩 상태

// 한국어 순으로 정렬하는 함수
function sortByKoreanOrder(array) {
  return [...array].sort((a, b) => {
    // 한국어가 영어보다 앞에 오도록
    const aIsKorean = /[가-힣]/.test(a);
    const bIsKorean = /[가-힣]/.test(b);

    if (aIsKorean && !bIsKorean) return -1;
    if (!aIsKorean && bIsKorean) return 1;

    // 둘 다 한국어이거나 둘 다 영어인 경우 사전순 정렬
    return a.localeCompare(b, "ko");
  });
}

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

// 에러 모달 닫기
function closeErrorModal() {
  errorModal.value = null;
  errorMessage.value = "";
}

// 은행명을 파일명으로 매핑하는 함수
function getBankIconByName(bankName) {
  const bankIconMap = {
    KB국민은행: KBIcon,
    신한은행: ShinhanIcon,
    하나은행: HanaIcon,
    우리은행: WooriIcon,
    케이뱅크: KBankIcon,
    IBK기업은행: IBKIcon,
    농협은행: NHIcon,
    SC제일은행: SCIcon,
    부산은행: BNKIcon,
    경남은행: BNKIcon,
    광주은행: GwangjuIcon,
    제주은행: JejuIcon,
    새마을금고: SaemaulIcon,
    한국씨티은행: CitiIcon,
    수협은행: ShIcon,
    전북은행: JeonbukIcon,
    우체국: PostIcon,
    한국산업은행: KoreaIcon,
    신협: ShinhyupIcon,
    대구은행: DaeguIcon,
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
    하나은행: "0081", // KEB하나은행
    우리은행: "0020",
    케이뱅크: "0004", // 기본값
    IBK기업은행: "0003",
    농협은행: "0011",
    SC제일은행: "0023",
    부산은행: "0032",
    경남은행: "0039",
    광주은행: "0034",
    제주은행: "0035",
    새마을금고: "0045",
    한국씨티은행: "0027",
    수협은행: "0007",
    전북은행: "0037",
    우체국: "0071",
    한국산업은행: "0002",
    신협: "0048",
    대구은행: "0031",
  };

  return bankOrgMap[bankName] || "0004"; // 기본값으로 0004
}

// 첫 번째 선택된 은행의 로고 URL
const firstBankIcon = computed(() => {
  if (selectedBanks.value.length > 0) {
    const bank = selectedBanks.value[currentBankIndex.value];
    return getBankIconByName(typeof bank === "string" ? bank : bank.name);
  }
  return KBIcon; // 기본값
});

// 현재 처리 중인 은행명
const currentBankName = computed(() => {
  if (selectedBanks.value.length > 0) {
    const bank = selectedBanks.value[currentBankIndex.value];
    return typeof bank === "string" ? bank : bank.name;
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
      console.error("selectedBanks 파싱 오류:", error);
      // 기존 방식으로도 시도 (하위 호환성)
      if (Array.isArray(route.query.selectedBanks)) {
        selectedBanks.value = route.query.selectedBanks;
      } else {
        selectedBanks.value = [route.query.selectedBanks];
      }
    }
  }

  if (route.query.selectedSecurities) {
    try {
      selectedSecurities.value = JSON.parse(route.query.selectedSecurities);
      console.log("선택된 증권사들:", selectedSecurities.value);
    } catch (error) {
      console.error("selectedSecurities 파싱 오류:", error);
      // 기존 방식으로도 시도 (하위 호환성)
      if (Array.isArray(route.query.selectedSecurities)) {
        selectedSecurities.value = route.query.selectedSecurities;
      } else {
        selectedSecurities.value = [route.query.selectedSecurities];
      }
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
    alert("이메일과 비밀번호를 입력하세요.");
    return;
  }

  if (isLoggingIn.value) {
    console.log("🚫 이미 로그인 중입니다. 중복 호출 방지");
    return;
  }

  isLoggingIn.value = true;
  isLoading.value = true; // 로딩 시작

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
      isLastBank.value, // 마지막 은행일 때만 true
      null // 은행은 isRural을 null로 설정
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

      // 현재 은행을 완료된 목록에 추가
      completedBanks.value.push(currentBankName.value);

      if (isLastBank.value) {
        // 마지막 은행이면 증권사 연동 여부 확인
        if (selectedSecurities.value.length > 0) {
          // 입력 필드 초기화
          email.value = "";
          password.value = "";

          // 증권사가 선택되어 있으면 증권사 연동 페이지로 이동
          router.push({
            path: "/certificate-login",
            query: {
              selectedBanks: JSON.stringify(sortByKoreanOrder(selectedBanks.value)),
              selectedSecurities: JSON.stringify(sortByKoreanOrder(selectedSecurities.value)),
              completedBanks: JSON.stringify(completedBanks.value),
            },
          });
        } else {
          // 입력 필드 초기화
          email.value = "";
          password.value = "";

          // 증권사가 선택되지 않았으면 계좌 연동 완료 페이지로 이동
          router.push("/account-link-complete");
        }
      } else {
        // 다음 은행이 있으면 다음 은행 로그인 페이지로 이동
        currentBankIndex.value++;

        // 입력 필드 초기화
        email.value = "";
        password.value = "";

        // 다음 은행 정보와 함께 같은 페이지로 이동 (새로운 요청)
        router.push({
          path: "/bank-login",
          query: {
            selectedBanks: JSON.stringify(sortByKoreanOrder(selectedBanks.value)),
            selectedSecurities: JSON.stringify(sortByKoreanOrder(selectedSecurities.value)),
            currentIndex: currentBankIndex.value,
            completedBanks: JSON.stringify(completedBanks.value),
          },
        });
      }
    } else {
      // 에러 메시지가 있으면 모달로 표시
      if (result.error?.message) {
        errorMessage.value = result.error.message;
        errorModal.value = true;
      } else {
        errorMessage.value = `${currentBankName.value} 연동에 실패했습니다. 다시 시도해주세요.`;
        errorModal.value = true;
      }
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    errorMessage.value = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
    errorModal.value = true;
  } finally {
    isLoggingIn.value = false;
    isLoading.value = false; // 로딩 종료
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
    <span class="text-sm text-center mb-6">실제 은행 아이디와 비밀번호를 입력하세요.</span>

    <!-- 동적 은행 로고 -->
    <div v-if="!imageLoadError" class="w-24 h-24 mx-auto mb-8">
      <img
        :src="firstBankIcon"
        :alt="
          (selectedBanks[0] && typeof selectedBanks[0] === 'string' ? selectedBanks[0] : selectedBanks[0]?.name) ||
          '은행 로고'
        "
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
        type="text"
        placeholder="id를 입력하세요"
        class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
      />
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="비밀번호를 입력하세요"
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
    <Button label="로그인" @click="login" class="w-full max-w-md mb-10" />

    <!-- 하단 프로그래스 바 -->
    <BankLoginProgress
      :total-steps="selectedBanks.length + selectedSecurities.length"
      :completed-steps="completedBanks.length"
    />

    <!-- 에러 모달 -->
    <BaseModal :is-modal="errorModal" title="연동 실패" sub-title="" @close="closeErrorModal">
      <div class="text-center">
        <p class="text-gray-700 mb-4">{{ errorMessage }}</p>
        <button
          @click="closeErrorModal"
          class="w-full bg-[#433D8B] text-white py-2 px-4 rounded-lg hover:bg-[#433D8B]/90 transition-colors"
        >
          확인
        </button>
      </div>
    </BaseModal>

    <!-- 로딩 모달 -->
    <LoadingModal
      :is-visible="isLoading"
      title="연동 중"
      message="은행 연동을 진행하고 있습니다. 잠시만 기다려주세요..."
    />
  </div>
</template>

<style scoped>
input::placeholder {
  color: #e8ecf4;
  opacity: 1;
}
</style>
