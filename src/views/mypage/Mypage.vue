<template>
  <div>
    <DefaultLayout>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col items-start w-full px-0 gap-2">
          <h1 class="text-xl font-bold m-0">마이페이지</h1>
        </div>

        <div class="flex flex-row items-center justify-between mb-4 w-full px-6">
          <div class="flex flex-col items-center justify-center">
            <div class="w-24 h-24 rounded-ful flex items-center justify-center">
              <img
                :src="getThemeImage(investType)"
                :alt="getThemeName(investType)"
                class="w-20 h-20 rounded-full object-cover"
              />
            </div>
          </div>
          <div class="flex flex-col justify-center gap-1">
            <h2 class="text-base font-semibold text-gray-800">{{ name }}님 환영합니다!</h2>
            <p class="text-sm text-gray-500">오늘도 자산 관리, 함께해요!</p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-gray-400 mb-2">계정 설정</div>
          <router-link
            to="/mypage/edit-profile"
            class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600"
          >
            내 정보 수정
          </router-link>
          <router-link
            to="/mypage/edit-account"
            class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600"
          >
            연결된 계좌 관리
          </router-link>

          <div class="border-t my-4 border-gray-200"></div>

          <div class="text-sm text-gray-400 mb-2">서비스 설정</div>
          <router-link
            to="/alarm/setting"
            class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600"
          >
            알림 설정
          </router-link>
          <router-link to="/agreement" class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600">
            이용 약관 및 개인정보 처리방침
          </router-link>
          <router-link
            to="/mypage/delete-profile"
            class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600"
          >
            회원 탈퇴
          </router-link>
        </div>

        <button
          @click="logout"
          class="text-base text-indigo-600 hover:underline text-right flex items-center justify-end"
        >
          로그아웃
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </DefaultLayout>
  </div>
</template>
<script setup>
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { fetchInvestType } from "@/api/memberApi";

const auth = useAuthStore();
const router = useRouter();
const name = ref("User");

name.value = auth.username;

const logout = async () => {
  try {
    auth.logout();
    alert("로그아웃 되었습니다.");
    router.push({ name: "onboardLoading" });
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
    // 에러가 발생해도 로컬 데이터는 정리되므로 로그인 페이지로 이동
    router.push({ name: "onboardLoading" });
  }
};

const investType = ref("");

// 투자 성향 결과 매핑
const resultMap = {
  안전형: {
    name: "크레이터",
    type: "안전형",
    apiType: "CONSERVATIVE",
    desc: "안정성과 원금 보전을 최우선으로 생각하는 투자자입니다. 예금, 적금, 채권 등 저위험 상품을 선호합니다.",
    img: "creator.svg",
  },
  안정추구형: {
    name: "가이아",
    type: "안정추구형",
    apiType: "STABLE",
    desc: "안정적인 수익과 약간의 성장 가능성을 추구합니다. 분산 투자와 중위험 상품에 관심이 많습니다.",
    img: "gaia.png",
  },
  위험중립형: {
    name: "루나",
    type: "위험중립형",
    apiType: "NEUTRAL",
    desc: "위험과 수익의 균형을 중시하며, 다양한 자산에 투자하는 것을 선호합니다.",
    img: "luna.svg",
  },
  적극투자형: {
    name: "볼케이노",
    type: "적극투자형",
    apiType: "GROWTH",
    desc: "높은 수익을 위해 일정 수준의 위험도 감수할 수 있는 투자자입니다.",
    img: "volcano.svg",
  },
  공격투자형: {
    name: "네뷸라",
    type: "공격투자형",
    apiType: "AGGRESSIVE",
    desc: "최고의 수익을 위해 높은 위험도 마다하지 않는 투자자입니다. 주식, 파생상품, 가상자산 등 고위험 상품에 관심이 많습니다.",
    img: "nevula.svg",
  },
};

// API 타입으로 resultMap 찾기
const findResultByApiType = (apiType) => {
  return Object.values(resultMap).find((item) => item.apiType === apiType);
};

// 투자 성향에 따른 이미지 반환
const getThemeImage = (apiType) => {
  const result = findResultByApiType(apiType);
  return result ? `/src/assets/images/${result.img}` : "/src/assets/images/default-theme.png";
};

// 투자 성향에 따른 이름 반환
const getThemeName = (apiType) => {
  const result = findResultByApiType(apiType);
  return result ? result.name : "투자자";
};

//투자 성향 불러오기
onMounted(async () => {
  try {
    const type = await fetchInvestType();
    investType.value = type;
    console.log("투자 성향 조회 성공:", investType.value);
    console.log("API 응답 전체:", type);
    console.log("매핑된 이미지:", getThemeImage(type));
    console.log("매핑된 이름:", getThemeName(type));
  } catch (e) {
    console.error("투자성향 조회 실패:", e);
  }
});
</script>
<style scoped></style>
