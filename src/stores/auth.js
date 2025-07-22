import { defineStore } from "pinia";
import axios from "axios";
import { LogIn } from "lucide-vue-next";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
  }),
  actions: {
    async signup(payload) {
      const res = await axios.post("/api/signup", payload);
    },
    async login(payload) {
      const res = await axios.post("/api/login", payload);
      this.token = res.data.token;
      this.user = res.data.user;
      this.role = res.data.user.role;
      this.isAuthenticated = true;
    },
    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      this.isAuthenticated = false;
    },
  },
});
