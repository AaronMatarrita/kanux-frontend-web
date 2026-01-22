import { UserRole } from "@/config/sidebar.config";

export const mockSession = {
  isAuthenticated: true,
  role: "COMPANY" as UserRole,
  name: "Alex Smith",
  email: "alex.smith@example.com",
  photoUrl: "https://i.pravatar.cc/40",
};
