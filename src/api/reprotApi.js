import api from "@/api";

const BASE_URL = "/api/isa/reports";

export default {
  async getTaxSavingSummary() {
    try {
      // 백틱(`)으로 감싸야 ${BASE_URL}가 정상 동작합니다.
      const { data } = await api.get(`${BASE_URL}/account-comparison`);

      // 서버에서 Response<AccountComparisonDTO> 형태로 오는 경우
      // 실제 데이터는 data.data 안에 있을 가능성이 높습니다.
      console.log("getTaxSavingSummary:", data);
      return data.data ? data.data : data; // data.data가 있으면 반환, 없으면 전체 반환
    } catch (error) {
      console.error("getTaxSavingSummary 실패:", error);
      throw error;
    }
  },
};
