/**
 * 사용자 관련 스토어
 */

import { defineStore } from "pinia";
import { ref } from "vue";
import { authApi } from "@/services/api";
import { STORAGE_KEYS } from "@/utils/constants";

export const useUserStore = defineStore("user", () => {
  // 사용자 상태 관리
  const user = ref(null);
  const isLoggedIn = ref(false);
  const loading = ref(false);

  // 로그인 초기화 (앱 시작시 토큰 확인)
  const initAuth = () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      isLoggedIn.value = true;
    }
  };

  // 로그인
  const login = async (email, password) => {
    try {
      loading.value = true;
      const response = await authApi.login(email, password);

      // 토큰 저장
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }

      user.value = response.user;
      isLoggedIn.value = true;

      return { success: true, data: response };
    } catch (error) {
      console.error("로그인 실패:", error);
      return { success: false, error: error.response?.data?.message || "로그인에 실패했습니다." };
    } finally {
      loading.value = false;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      // 로컬 데이터 정리
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      user.value = null;
      isLoggedIn.value = false;
    }
  };

  // 사용자 정보 조회
  const getUserInfo = async () => {
    try {
      const response = await authApi.getUserInfo();
      user.value = response;
      return response;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      logout();
    }
  };

  // 토큰 설정 (외부에서 직접 설정할 때)
  const setToken = (accessToken, refreshToken = null) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    isLoggedIn.value = true;
  };

  return {
    // 상태
    user,
    isLoggedIn,
    loading,

    // 액션
    initAuth,
    login,
    logout,
    getUserInfo,
    setToken,
  };
});
