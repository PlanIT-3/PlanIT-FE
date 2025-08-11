export default [
  {
    path: "/goal",
    name: "goalView",
    component: () => import("../views/goal/GoalView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/goal/edit",
    name: "goalEditView",
    component: () => import("../views/goal/GoalEditView.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/goal/isa",
    name: "goalIsaRegisterView",
    component: () => import("../views/goal/IsaRegisterView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/goal/detail/:id",
    name: "goalDetailView",
    component: () => import("../views/goal/GoalDetailView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/goal/deposit",
    name: "depositAssignmentView",
    component: () => import("../views/goal/DepositRegisterView.vue"),
    meta: { requiresAuth: true },
  },
];
