import api from "./api";

export interface WhatsAppSession {
  _id: string;
  name: string;
  sessionId: string;
  status: "CONNECTED" | "QR_GENERATED" | "DISCONNECTED" | "AUTHENTICATED" | "INITIALIZING";
  qrCode: string | null;
  lastActive: string;
}

export const whatsappAPI = {
  getAllSessions: async () => {
    const res = await api.get<{ success: boolean; data: WhatsAppSession[] }>("/whatsapp/sessions");
    return res.data;
  },
  
  createSession: async (name: string) => {
    const res = await api.post<{ success: boolean; message: string; data: any }>("/whatsapp/sessions", { name });
    return res.data;
  },

  disconnectSession: async (id: string) => {
    const res = await api.post<{ success: boolean; message: string }>(`/whatsapp/sessions/${id}/disconnect`);
    return res.data;
  },

  resumeSession: async (id: string) => {
    const res = await api.post<{ success: boolean; message: string }>(`/whatsapp/sessions/${id}/resume`);
    return res.data;
  },

  deleteSession: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/whatsapp/sessions/${id}`);
    return res.data;
  }
};
