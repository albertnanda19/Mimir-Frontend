export type UserRole = "superadmin" | "user";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}
