export default [
  {
    path: "/goal",
    name: "goalView",
    component: () => import("../views/goal/GoalView.vue"),
  },
  {
    path: "/goal/edit",
    name: "goalEditView",
    component: () => import("../views/goal/GoalEditView.vue"),
  },

  {
    path: "/goal/isa",
    name: "goalIsaRegisterView",
    component: () => import("../views/goal/IsaRegisterView.vue"),
  },
  {
    path: "/goal/detail",
    name: "goalDetailView",
    component: () => import("../views/goal/GoalDetailView.vue"),
  },
  {
    path: "/goal/deposit",
    name: "depositAssignmentView",
    component: () => import("../views/goal/DepositRegisterView.vue"),
  },
];
