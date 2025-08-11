import api from "@/api";
// 공통 설정
const BASE_URL = "/api/product";
export default {
  // username 중복 체크
  // 반환값: true → 중복(사용 불가), false → 사용 가능
  async getProductList(username) {
    const { data } = await api.get(`${BASE_URL}/checkusername/${username}`);
    console.log("AUTH GET CHECKUSERNAME", data);
    return data;
  },
};
