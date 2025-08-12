import api from "@/api";

const BASE_URL = "/auth/api/product";

export default {
  // 추천 상품 목록 조회
  async getRecommendList() {
    try {
      const { data } = await api.get(`${BASE_URL}/recommend`);
      console.log("추천 상품 조회:", data);
      return data;
    } catch (error) {
      console.error("추천 상품 조회 실패:", error);
      throw error;
    }
  },
};
