import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "@/utils/constants";

// API 기본 설정

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 요청 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = "/login";
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

// API 메서드들
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

// 에러 처리 헬퍼
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

// API 응답 래퍼
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
