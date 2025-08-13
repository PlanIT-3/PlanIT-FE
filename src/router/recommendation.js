export default [
  {
    path: "/recommend",
    name: "recommend",
    component: () => import("../views/recommendation/RecommendView.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/product/:shortenCode",
    name: "ProductDetail",
    component: () => import("../views/recommendation/RecommendDetail.vue"),
    props: true,
  },
];
