import api from "@/api";
// 공통 설정
const BASE_URL = "/auth/api/goals";

export default {
  //목표 리스트
  async getGoalList() {
    const { data } = await api.get(`${BASE_URL}`);
    console.log("GET GOAL List", data);
    return data;
  },

  //목표 세부
  async getGoal(goalId) {
    const { data } = await api.get(`${BASE_URL}/${goalId}`);
    console.log("GET GOAL", data);
    return data;
  },

  // 목표 진행 추이 조회
  async getGoalProgress(goalId) {
    const { data } = await api.get(`${BASE_URL}/${goalId}/progress`);
    console.log("GET GOAL PROGRESS", data);
    return data;
  },

  // 목표 대비 계좌별 진행률 조회
  // 목표 대비 계좌별 진행률 조회 (차트용 변환)
  async getGoalAccountRates(goalId) {
    const { data } = await api.get(`${BASE_URL}/${goalId}/rate`);
    console.log("RAW RESPONSE", data);

    // data.data 배열을 차트 데이터 형식으로 변환
    return data.data.map((item) => ({
      name: item.bankName,
      value: item.progressRate,
    }));
  },
};
