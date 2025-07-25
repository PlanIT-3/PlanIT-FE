import { api } from "@/api";

const API_URL = "/auth/api/member/invest-type";

export const saveInvestmentType = (investType) => {
  return api.post(API_URL, null, {
    params: {
      type: investType,
    },
  });
};
