export default [
  {
    path: "/goal/edit",
    name: "goalEditView",
    component: () => import("../views/goal/GoalEditView.vue"),
  },
  {
    path: "/goal/detail",
    name: "goalDetailView",
    component: () => import("../views/goal/GoalDetailView.vue"),
  },
];
