import api from "@/api";
import { API_BASE_URL } from "@/utils/constants";

const BASE_URL = API_BASE_URL.endsWith("/") ? API_BASE_URL + "api" : API_BASE_URL + "/api";

export default {
  async signup(userData) {
    const { data } = await api.post(`${BASE_URL}/signup`, {
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname,
    });
    return data;
  },

  async update(userData) {
    const { data } = await api.put(`${BASE_URL}/${userData.username}`, {
      username: userData.username,
      password: userData.password,
      email: userData.email,
    });
    return data;
  },

  async changePassword(data) {
    const { data: res } = await api.put(`${BASE_URL}/${data.username}/changepassword`, data);
    console.log("AUTH PUT(changePassword): ", res);
    return res;
  },
};
