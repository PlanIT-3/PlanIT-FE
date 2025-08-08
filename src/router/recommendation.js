export default [
  {
    path: "/recommend",
    name: "recommend",
    component: () => import("../views/recommendation/RecommendView.vue"),
    meta: { requiresAuth: true },
  },
];
