import api from "./api";
import { API } from "./endpoints";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "HEARING" | "TASK";
  details?: string;
  caseNumber?: string;
  status?: string;
  priority?: string;
}

export const getCalendarEvents = async () => {
  const response = await api.get<{ data: CalendarEvent[] }>(API.CALENDAR.EVENTS);
  return response.data;
};
