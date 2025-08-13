import api from "@/api";
// 공통 설정
const BASE_URL = "/auth/api/goals";

export default {
  //목표 생성
  async createNewGoal(goalData) {
    return api.post(BASE_URL, goalData);
  },

  //목표 저장
  async saveGoal(goalId, goalData) {
    return api.put(`${BASE_URL}/${goalId}`, goalData);
  },

  //목표 리스트
  async getGoalList() {
    const { data } = await api.get(`${BASE_URL}`);
    console.log("GET GOAL List", data);
    return data;
  },

  //목표 세부
  async getGoal(goalId, payload) {
    const { data } = await api.get(`${BASE_URL}/${goalId}`, payload);

    console.log("GET GOAL", data);
    return data;
  },

  // 목표 진행 추이 조회
  async getGoalProgress(goalId) {
    const { data } = await api.get(`${BASE_URL}/${goalId}/progress`);
    console.log("GET GOAL PROGRESS", data);
    return data;
  },

  // (목표 대비 계좌별 진행률 조회)
  // 목표 대비 계좌별 진행률 조회 (차트용 변환)
  async getGoalAccountRates(goalId) {
    const { data } = await api.get(`${BASE_URL}/${goalId}/rate`);
    console.log("RAW RESPONSE", data);

    return data.data.map((item) => ({
      name: item.bankName,
      value: Number(item.progressRate.toFixed(2)),
    }));
  },

  // 목표에 할당된 계좌목록 조회
  async getGoalAccounts(goalId) {
    const { data } = await api.get(`${BASE_URL}/${goalId}/accounts`);
    console.log("API 계좌 목록 응답데이터 :", data);

    // 예금 계좌와 ISA 계좌 데이터를 하나로 합치고 변환
    const allAccounts = [
      ...data.goalDepositList.map((account) => ({
        bankName: account.bankName,
        productName: account.accountName,
        percent: 0, // 비율은 계산 필요
        amount: Math.round(account.accountBalance), // 만원 단위로 변환
      })),
      ...data.goalIsaList.map((account) => ({
        bankName: account.bankName,
        productName: account.accountName,
        percent: 0, // 비율은 계산 필요
        amount: Math.round(account.accountBalance), // 만원 단위로 변환
      })),
    ];

    // 총 금액 계산하여 비율 설정
    const totalAmount = allAccounts.reduce((sum, acc) => sum + acc.amount, 0);
    allAccounts.forEach((account) => {
      account.percent = totalAmount > 0 ? Math.round((account.amount / totalAmount) * 100) : 0;
    });

    return allAccounts;
  },

  // 해당 목표 targetamount 조회
  async getGoalAmount(goalId) {
    const { data } = await api.get(`${BASE_URL}/${goalId}/goal-amount`);
    return data;
  },
};
