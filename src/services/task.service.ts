import api from "./api";
import { ApiResponse, UserRole } from "@/types/auth";

export interface TaskHistory {
  action: string;
  performedBy: { _id: string; name: string; role?: UserRole };
  createdAt: string;
  details: string;
}

export interface TaskItem {
  _id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  organizationId: string;
  createdBy: { _id: string; name: string; email: string; role?: UserRole };
  assignedTo?: { _id: string; name: string; email: string; role?: UserRole };
  history: TaskHistory[];
  createdAt: string;
}

const TASKS_URL = "/tasks";

export const getTasks = async () => {
  const { data } = await api.get<ApiResponse<TaskItem[]>>(TASKS_URL);
  return data;
};

export const createTask = async (payload: Partial<TaskItem>) => {
  const { data } = await api.post<ApiResponse<TaskItem>>(TASKS_URL, payload);
  return data;
};

export const updateTask = async (id: string, payload: Partial<TaskItem>) => {
  const { data } = await api.put<ApiResponse<TaskItem>>(`${TASKS_URL}/${id}`, payload);
  return data;
};

export const deleteTask = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`${TASKS_URL}/${id}`);
  return data;
};
