import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MainView from "../views/MainView.vue";
import authRoutes from "./auth";
import onBoardingRoutes from "./onBoarding";
import goalRoutes from "./goal";
import recommendationRoutes from "./recommendation";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/main",
      name: "main",
      component: MainView,
    },
    ...authRoutes,
    ...onBoardingRoutes,
    ...goalRoutes,
    ...recommendationRoutes,
  ],
});

export default router;
