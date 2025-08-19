import api from "@/api";
const BASE_URL = "/auth/rebalance";

export const fetchInvestmentData = async () => {
  try {
    const response = await api.get("/auth/rebalance/invest/info");
    return response.data;
  } catch (error) {
    console.error("투자 내역 조회 실패:", error);
    throw error;
  }
};

export const fetchYieldData = async () => {
  try {
    const response = await api.get("/auth/rebalance");
    return response.data;
  } catch (error) {
    console.error("수익률 조회 실패:", error);
    throw error;
  }
};
export const getRebalance = async () => {
  try {
    const { data } = await api.get(`${BASE_URL}/rate`);

    console.log("리밸런싱 목록 조회:", data);
    return data.data ? data.data : data; // data.data가 있으면 반환, 없으면 전체 반환
  } catch (error) {
    console.error("getTaxSavingSummary 실패:", error);
    throw error;
  }
};
