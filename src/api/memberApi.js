import api from "@/api";

const BASE_URL = "/auth/api/member";

export async function fetchInvestType() {
  const res = await api.get(`${BASE_URL}/invest-type`);
  return res.data.data.investType;
}
