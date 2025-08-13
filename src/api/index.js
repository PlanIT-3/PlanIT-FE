import axios from "axios";

import { useAuthStore } from "@/stores/auth";
import { API_BASE_URL, STORAGE_KEYS } from "@/utils/constants";
import router from "@/router";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    //jwt추출
    const auth = useAuthStore();
    const token = auth.getaccessToken();
    if (token) {
      console.log("🔍 token:", token);
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    }
    if (response.status === 404) {
      return Promise.reject("404: 페이지 없음" + response.request);
    }

    return response;
  },
  async (error) => {
    const auth = useAuthStore();
    const originalRequest = error.config;

    //에러 응답인 경우 (401, 403, 305, 500)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = auth.getrefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/reissue`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          auth.setToken(accessToken);
          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 사용자에게 알림 후 로그아웃
        console.warn("토큰이 만료되었습니다. 다시 로그인해주세요.");

        // 현재 경로가 메인 페이지나 인증이 필요한 페이지인 경우에만 로그아웃 처리
        const currentPath = window.location.pathname;
        const requiresAuthPaths = ["/main", "/goal", "/recommend", "/report", "/mypage"];

        if (requiresAuthPaths.some((path) => currentPath.startsWith(path))) {
          auth.logout();
          router.replace("/login");
        }

        return Promise.reject(refreshError);
      }
    }

    // 에러 로깅
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const api = {
  // GET 요청
  get: (url, config = {}) => apiClient.get(url, config),

  // POST 요청
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),

  // PUT 요청
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),

  // PATCH 요청
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),

  // DELETE 요청
  delete: (url, config = {}) => apiClient.delete(url, config),

  // 파일 업로드
  upload: (url, formData, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config.headers,
      },
    });
  },
};

export const handleApiError = (error) => {
  if (error.response) {
    // 서버 응답이 있는 경우
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return { message: data.message || "잘못된 요청입니다.", type: "warning" };
      case 401:
        return { message: "인증이 필요합니다.", type: "error" };
      case 403:
        return { message: "권한이 없습니다.", type: "error" };
      case 404:
        return { message: "요청한 리소스를 찾을 수 없습니다.", type: "error" };
      case 422:
        return { message: data.message || "입력 데이터를 확인해주세요.", type: "warning" };
      case 500:
        return { message: "서버 오류가 발생했습니다.", type: "error" };
      default:
        return { message: data.message || "알 수 없는 오류가 발생했습니다.", type: "error" };
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    return { message: "서버에 연결할 수 없습니다.", type: "error" };
  } else {
    // 요청 설정 중 오류가 발생한 경우
    return { message: error.message || "요청 처리 중 오류가 발생했습니다.", type: "error" };
  }
};

export const apiWrapper = async (apiCall) => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return {
      success: false,
      error: errorInfo,
      status: error.response?.status,
    };
  }
};

export default apiClient;
