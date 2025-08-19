// 인증 상태를 관리하는 Pinia 스토어
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { api } from "@/api";
import { STORAGE_KEYS } from "@/utils/constants";
import router from "@/router";
import { setupFCM } from "@/config/firebase";

// 초기 상태 정의
const initState = {
  token: {
    accessToken: "",
    refreshToken: "",
  },
  user: {
    username: "", // 사용자
    email: "", // 사용자 이메일
    roles: [], // 권한 목록
  },
};

export const useAuthStore = defineStore("auth", () => {
  const state = ref({ ...initState });
  const isLoggedIn = ref(false);

  // 로그인 초기화 (앱 시작시 토큰 확인)
  const initAuth = () => {
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      state.value = JSON.parse(authStr);
      isLoggedIn.value = !!state.value.token.accessToken;
    }
  };

  // 로그인 여부, !! : 강제로 boolean 형변환
  const isLogin = computed(() => !!state.value.user.email);

  // 로그인된 사용자 ID
  const username = computed(() => state.value.user.username);

  // 로그인된 사용자 이메일
  const email = computed(() => state.value.user.email);

  // 로그인 함수
  const login = async (userData) => {
    try {
      const { data } = await api.post("/api/login", userData);

      state.value.token = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      state.value.user = {
        email: data.email,
        username: data.username || "",
        role: data.role || [],
        memberId: data.id || data.memberId, // memberId 저장
      };

      localStorage.setItem("auth", JSON.stringify(state.value));
      isLoggedIn.value = true;

      // FCM 토큰 설정 (로그인 성공 후)
      try {
        const memberId = data.memberId || data.id;
        console.log("로그인 응답 데이터:", data);
        console.log("추출된 memberId:", memberId);
        
        if (memberId) {
          console.log("FCM 설정 시작 - memberId:", memberId);
          const fcmToken = await setupFCM(memberId);
          if (fcmToken) {
            console.log("FCM 토큰 발급 및 저장 완료:", fcmToken);
          } else {
            console.warn("FCM 토큰 설정 실패");
          }
        } else {
          console.warn("memberId가 없어서 FCM 설정을 건너뜁니다");
        }
      } catch (fcmError) {
        // FCM 실패해도 로그인은 성공 처리
        console.error("FCM 설정 중 오류:", fcmError);
      }

      return data;
    } catch (error) {
      console.error("로그인 실패:", error);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("auth"); // localStorage auth 제거
    state.value = { ...initState }; // 상태 초기화
    isLoggedIn.value = false;
  };

  // 토큰 조회 함수
  const getaccessToken = () => state.value.token.accessToken;
  const getrefreshToken = () => state.value.token.refreshToken;

  const setToken = (accessToken, refreshToken = null) => {
    // 객체 형태로 전달된 경우 처리
    if (typeof accessToken === "object" && accessToken !== null) {
      state.value.token.accessToken = accessToken.accessToken || accessToken;
      state.value.token.refreshToken = accessToken.refreshToken || refreshToken;
    } else {
      // 기존 방식 (개별 파라미터)
      state.value.token.accessToken = accessToken;
      if (refreshToken !== null) {
        state.value.token.refreshToken = refreshToken;
      }
    }

    // localStorage도 전체 auth 객체로 저장
    localStorage.setItem("auth", JSON.stringify(state.value));
    isLoggedIn.value = true;
  };

  // 앱 시작 시 인증 초기화
  initAuth();

  return {
    state,
    isLoggedIn,
    isLogin,
    username,
    email,
    login,
    logout,
    getaccessToken,
    getrefreshToken,
    setToken,
    initAuth,
  };
});
