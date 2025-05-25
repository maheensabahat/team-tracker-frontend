import axios, { type AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export type GoalStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: GoalStatus;
}

export interface CreateGoalDTO {
  title: string;
  description?: string;
  dueDate: string;
  status?: GoalStatus;
}

export interface UpdateGoalDTO {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: GoalStatus;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function handleAxiosError(error: AxiosError) {
  if (error.response) {
    // Server responded with a status other than 2xx
    throw new Error(
      (error.response.data as any)?.error ||
        `API Error: ${error.response.statusText}`
    );
  } else if (error.request) {
    // No response received
    throw new Error("No response from server");
  } else {
    // Other errors
    throw new Error(error.message);
  }
}

export const apiService = {
  async getGoals(status?: GoalStatus): Promise<Goal[]> {
    try {
      const response = await axiosInstance.get<Goal[]>("/goals", {
        params: status ? { status } : undefined,
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
      throw error;
    }
  },

  async createGoal(data: CreateGoalDTO): Promise<Goal> {
    try {
      const response = await axiosInstance.post<Goal>("/goals", data);
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
      throw error;
    }
  },

  async updateGoal(id: string, data: UpdateGoalDTO): Promise<Goal> {
    try {
      const response = await axiosInstance.put<Goal>(`/goals/${id}`, data);
      return response.data;
    } catch (error) {
      handleAxiosError(error as AxiosError);
      throw error;
    }
  },

  async deleteGoal(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/goals/${id}`);
    } catch (error) {
      handleAxiosError(error as AxiosError);
      throw error;
    }
  },
};
