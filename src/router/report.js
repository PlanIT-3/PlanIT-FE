export default [
    {
      path: "/report",
      name: "Report",
      component: () => import("@/views/report/ReportView.vue"),
      meta: { requiresAuth: true },
    },
  ];
  