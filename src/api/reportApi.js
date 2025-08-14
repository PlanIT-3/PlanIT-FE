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

  async getCumulativeTaxSaving() {
    try {
      const { data } = await api.get(`${BASE_URL}/cumulative-tax-saving`);
      console.log("getCumulativeTaxSaving:", data);
      return data;
    } catch (error) {
      console.error("getCumulativeTaxSaving 실패:", error);
      throw error;
    }
  },

  async getInvestScore() {
    try {
      const { data } = await api.get("/auth/api/member/invest-score");
      console.log("getInvestScore:", data);
      return data.data;
    } catch (error) {
      console.error("getInvestScore 실패:", error);
      throw error;
    }
  },

  async getInvestmentData(period) {
    try {
      const { data } = await api.get(`/api/reports/returns/total/${period}`);
      console.log(`getInvestmentData ${period}:`, data);
      return data;
    } catch (error) {
      console.error(`getInvestmentData ${period} 실패:`, error);
      throw error;
    }
  },

  async getReturnRateData(period) {
    try {
      const type = period === "daily" ? "DAILY" : period === "weekly" ? "WEEKLY" : "MONTHLY";
      const { data } = await api.get(`/api/reports/returns?type=${type}`);
      console.log(`getReturnRateData ${type}:`, data);
      return data.data;
    } catch (error) {
      console.error(`getReturnRateData ${type} 실패:`, error);
      throw error;
    }
  },

  async getTaxSavingStatus() {
    try {
      const { data } = await api.get(`${BASE_URL}/tax-saving-status`);
      console.log("getTaxSavingStatus:", data);
      return data.data || {
        maxTaxSavingLimit: 0,
        currentTaxSaving: 0,
        remainingTaxSaving: 0,
        usageRate: 0,
      };
    } catch (error) {
      console.error("getTaxSavingStatus 실패:", error);
      throw error;
    }
  },

  async getTaxComparisonTrend() {
    try {
      const { data } = await api.get("/api/tax/comparison/trend");
      console.log("getTaxComparisonTrend:", data);
      return data.data || {
        quarterlyData: [],
        summary: {},
      };
    } catch (error) {
      console.error("getTaxComparisonTrend 실패:", error);
      throw error;
    }
  },
};
