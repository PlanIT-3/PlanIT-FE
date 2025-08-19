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

//isa 편집용 전체 보는 리스트 (할당된 / 안된 전부 )
export async function getIsaProductsForEdit(goalId) {
  const res = await api.get("/auth/api/account/isa/edit", {
    params: { goalId }, //get query params로
  });
  return res.data;
}

//수정 버튼 put
// export async function editIsaAllocation(goalId, allItems, selectedIds) {
//   const editReqs = allItems.map((p) => ({
//     goalId,
//     memberProductId: p.memberProductId ?? p.id, // 둘 중 있는 키 사용
//     accountType: "ISA",
//     checked: selectedIds.includes(p.memberProductId ?? p.id),
//   }));

//   const body = { editReqs }; //
//   const res = await api.put("/auth/api/account/isa", body);
//   return res.data;
// }
// 수정: 변경된 것만 보냄 (추가/해제 분리)
export async function editIsaAllocation(goalId, addedIds = [], removedIds = []) {
  const add = Array.isArray(addedIds) ? addedIds.map(Number) : [];
  const remove = Array.isArray(removedIds) ? removedIds.map(Number) : [];

  // 변경 없으면 요청 생략 가능
  if (add.length === 0 && remove.length === 0) {
    return { status: "OK", message: "No changes" };
  }

  const editReqs = [
    ...add.map((id) => ({ goalId, memberProductId: id, accountType: "ISA", checked: true })),
    ...remove.map((id) => ({ goalId, memberProductId: id, accountType: "ISA", checked: false })),
  ];

  const body = { editReqs }; // IsaAccountProductEditListReq.editReqs
  const res = await api.put("/auth/api/account/isa", body);
  return res.data;
}
export default {
  getIsaProducts,
  getTaxExemption,
  registerIsaAllocation,
  getIsaProductsForEdit,
  editIsaAllocation,
};
