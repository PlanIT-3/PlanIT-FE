export default [
  {
    path: "/goal/edit",
    name: "goalEditView",
    component: () => import('../views/goal/GoalEditView.vue'),
  }, 

  {
    path: "/goal/isa",
    name: "goalIsaRegisterView",
    component: () => import('../views/goal/IsaRegisterView.vue'),
  },
];
