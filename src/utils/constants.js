/**
 * 애플리케이션 상수 정의
 */

// API 기본 URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://srv.woojooin.site/";

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_PREFERENCES: "userPreferences",
};

// 기본 설정값
export const DEFAULT_SETTINGS = {
  THEME: "light",
  LANGUAGE: "ko",
};
