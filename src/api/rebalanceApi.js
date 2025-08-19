import api from "@/api";

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
