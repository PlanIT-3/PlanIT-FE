// 인증 상태를 관리하는 Pinia 스토어
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { api } from "@/api";
import { STORAGE_KEYS } from "@/utils/constants";
import router from "@/router";

// 초기 상태 정의
const initState = {
  token: {
    accessToken: "",
    refreshToken: "",
  },
  user: {
    username: "", // 사용자 ID
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
        roles: data.roles || [],
      };

      localStorage.setItem("auth", JSON.stringify(state.value));
      isLoggedIn.value = true;
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
    state.value.token.accessToken = accessToken;
    if (refreshToken !== null) {
      state.value.token.refreshToken = refreshToken;
    }
    // localStorage도 전체 auth 객체로 저장
    localStorage.setItem("auth", JSON.stringify(state.value));
    isLoggedIn.value = true;
  };

  // 프로필 변경 함수
  const changeProfile = (member) => {
    if (member.email) {
      state.value.user.email = member.email;
      localStorage.setItem("auth", JSON.stringify(state.value));
    }
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
    changeProfile,
  };
});
