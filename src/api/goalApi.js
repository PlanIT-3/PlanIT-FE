import { api } from "@/api";

export const createNewGoal = (goalData) => {
  const apiUrl = "/auth/api/goals";
  return api.post(apiUrl, goalData);
};
