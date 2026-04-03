import api from "./api";
import { API } from "./endpoints";
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
  assignedTo?: string | { _id: string; name: string; email: string; role?: UserRole };
  history: TaskHistory[];
  comments?: { _id: string; author: { _id: string; name: string; email: string }; text: string; createdAt: string; }[];
  createdAt: string;
}

export const getTasks = async () => {
  const { data } = await api.get<ApiResponse<TaskItem[]>>(API.TASKS.LIST);
  return data;
};

export const createTask = async (payload: Partial<TaskItem>) => {
  const { data } = await api.post<ApiResponse<TaskItem>>(API.TASKS.CREATE, payload);
  return data;
};

export const updateTask = async (id: string, payload: Partial<TaskItem>) => {
  const { data } = await api.put<ApiResponse<TaskItem>>(API.TASKS.UPDATE(id), payload);
  return data;
};

export const deleteTask = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(API.TASKS.DELETE(id));
  return data;
};

export const getTaskById = async (id: string) => {
  const { data } = await api.get<ApiResponse<TaskItem>>(API.TASKS.GET(id));
  return data;
};

export const addTaskComment = async (id: string, text: string) => {
  const { data } = await api.post<ApiResponse<TaskItem>>(API.TASKS.ADD_COMMENT(id), { text });
  return data;
};
