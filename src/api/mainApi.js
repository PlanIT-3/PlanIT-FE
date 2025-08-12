import api from "@/api";
// 공통 설정
const BASE_URL = "/auth/api/account";
export default {
  async getPeriod(period) {
    const { data } = await api.get(`${BASE_URL}/${period}`);
    console.log(`GET ${period} BALANCE: `, data);
    return data;
  },

  async getGoalRatio(period) {
    const { data } = await api.get(`${BASE_URL}/goal-ratio`);
    console.log("GET GOAL RATIO: ", data);
    return data;
  },
};
