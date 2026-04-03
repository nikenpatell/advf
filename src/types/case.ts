import { UserRole } from "./auth";

export interface CaseHistory {
  _id: string;
  action: string;
  performedBy: { _id: string; name: string };
  createdAt: string;
  details: string;
}

export interface HearingHistory {
  _id: string;
  hearingDate: string;
  notes: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "POSTPONED";
  createdBy: { _id: string; name: string };
  createdAt: string;
}

export interface CaseItem {
  _id: string;
  caseNumber: string;
  title: string;
  caseType: string;
  caseDate: string;
  courtName: string;
  stage: string;
  clientId: { _id: string; name: string; email: string; contactNumber: string };
  assignedMembers: { _id: string; name: string; email: string; role: UserRole }[];
  nextHearingDate?: string;
  status: "OPEN" | "CLOSED" | "PENDING";
  createdBy: string;
  hearings: HearingHistory[];
  history: CaseHistory[];
  comments?: { _id: string; author: { _id: string; name: string; email: string }; text: string; createdAt: string; }[];
  createdAt: string;
  updatedAt: string;
}
