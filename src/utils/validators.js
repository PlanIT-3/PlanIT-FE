/**
 * 유효성 검사 유틸리티
 */

// 기본 유효성 검사 함수
export const validators = {
  // 필수 입력 검사
  required: (value, message = "필수 입력 항목입니다.") => {
    if (value === null || value === undefined || value === "") {
      return message;
    }
    return true;
  },

  // 이메일 형식 검사
  email: (value, message = "올바른 이메일 형식을 입력해주세요.") => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || message;
  },

  // 숫자만 허용
  numeric: (value, message = "숫자만 입력 가능합니다.") => {
    if (!value) return true;
    return !isNaN(value) || message;
  },
};
