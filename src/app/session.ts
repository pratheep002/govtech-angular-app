import { User } from "./user";

export interface Session {
  id: number;
  sessionName: string;
  initiatedBy: User;
  isActive: boolean;
}