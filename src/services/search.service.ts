import api from "./api";
import { API } from "./endpoints";
import { CaseItem } from "@/types/case";
import { TaskItem } from "./task.service";

export interface SearchResults {
  cases: CaseItem[];
  tasks: TaskItem[];
  clients: { _id: string; name: string; email: string; }[];
}

export const globalSearch = async (query: string): Promise<SearchResults> => {
  const { data } = await api.get(`${API.SEARCH}?q=${encodeURIComponent(query)}`);
  return data.data; 
};
