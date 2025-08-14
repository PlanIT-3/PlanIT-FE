import { api } from "@/api";

/** ISA 상품 목록 */
export async function getIsaProducts() {
  const res = await api.get("/auth/api/account/isa");
  return res.data; // { status, data, ... }
}

/** ISA 비과세 현황 */
export async function getTaxExemption() {
  const res = await api.get("/auth/api/account/isa/tax");
  return res.data; // { status, data: { taxSavedAmount, ... } }
}

/** ISA 계좌 할당 등록 */
export async function registerIsaAllocation(goalId, memberProductIds) {
  const body = {
    isaAccountProductRegisterReqs: memberProductIds.map((id) => ({
      goalId,
      memberProductId: id,
      accountType: "ISA",
    })),
  };
  const res = await api.post("/auth/api/account/isa", body);
  return res.data; // { status, message, ... }
}

export default {
  getIsaProducts,
  getTaxExemption,
  registerIsaAllocation,
};
