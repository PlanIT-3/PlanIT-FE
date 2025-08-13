import { api } from "@/api";

/**
 * Deposit(예적금) 관련 API 서비스
 */
export const depositService = {
  /**
   * 회원의 모든 예적금 계좌 조회
   * @param {number} memberId - 회원 ID
   * @returns {Promise} API 응답
   */
  getDepositAccounts: (memberId) => {
    return api.get(`/auth/api/account/deposit/${memberId}`);
  },

  /**
   * 특정 목적(Goal)에 할당된 예적금 계좌 조회
   * @param {number} memberId - 회원 ID
   * @param {number} goalId - 목적 ID
   * @returns {Promise} API 응답
   */
  getDepositAccountsByGoal: (memberId, goalId) => {
    return api.get(`/auth/api/account/deposit/edit/${memberId}?goalId=${goalId}`);
  },

  /**
   * 특정 목적에 할당 가능한 예적금 계좌 조회
   * @param {number} memberId - 회원 ID
   * @param {number} goalId - 목적 ID
   * @returns {Promise} API 응답
   */
  getAvailableDeposits: (memberId, goalId) => {
    return api.get(`/auth/api/account/deposit/available/${memberId}?goalId=${goalId}`);
  },

  /**
   * 예적금 계좌 등록
   * @param {number} memberId - 회원 ID
   * @param {Object} data - 등록할 예적금 데이터
   * @param {Array} data.depositAccountRegisterReqs - 등록할 예적금 계좌 목록
   * @returns {Promise} API 응답
   */
  registerDeposits: (memberId, data) => {
    return api.post(`/auth/api/account/deposit/${memberId}`, data);
  },

  /**
   * 예적금 계좌 수정
   * @param {number} memberId - 회원 ID
   * @param {Object} data - 수정할 예적금 데이터
   * @param {Array} data.editReqs - 수정할 예적금 계좌 목록
   * @returns {Promise} API 응답
   */
  updateDeposits: (memberId, data) => {
    return api.put(`/auth/api/account/deposit/${memberId}`, data);
  },
};

/**
 * Deposit 데이터 변환 유틸리티
 */
export const depositUtils = {
  /**
   * 등록 요청 데이터 형식으로 변환
   * @param {Array} accounts - 계좌 데이터 배열
   * @returns {Object} 등록 요청 형식
   */
  formatRegisterRequest: (accounts) => {
    return {
      depositAccountRegisterReqs: accounts.map((account) => ({
        goalId: account.goalId,
        memberAccountId: account.memberAccountId,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        amount: account.amount,
        allocatedRate: account.allocatedRate,
        accountAllocatedRate: account.accountAllocatedRate,
        actionType: account.actionType || "DEPOSIT",
      })),
    };
  },

  /**
   * 수정 요청 데이터 형식으로 변환
   * @param {Array} accounts - 계좌 데이터 배열
   * @returns {Object} 수정 요청 형식
   */
  formatUpdateRequest: (accounts) => {
    return {
      editReqs: accounts.map((account) => ({
        goalId: account.goalId,
        memberAccountId: account.memberAccountId,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        amount: account.amount,
        allocatedRate: account.allocatedRate,
        accountAllocatedRate: account.accountAllocatedRate,
        checked: account.checked,
        actionType: account.actionType || "DEPOSIT",
      })),
    };
  },

  /**
   * 금액을 원화 형식으로 포매팅
   * @param {number} amount - 금액
   * @returns {string} 포매팅된 금액 문자열
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  },
};

export default depositService;
