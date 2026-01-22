import {
  Home,
  Trophy,
  Medal,
  MessageSquare,
  User,
  CreditCard,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export type UserRole = "TALENT" | "COMPANY";

export interface SidebarMenuItem {
  label: string;
  route: string;
  icon: any;
}

export const SIDEBAR_MENU: Record<UserRole, SidebarMenuItem[]> = {
  TALENT: [
    { label: "Dashboard", route: "/talent/dashboard", icon: Home },
    { label: "Challenges", route: "/talent/challenges", icon: Trophy },
    { label: "Skills", route: "/talent/skills", icon: Medal },
    { label: "Messages", route: "/talent/messages", icon: MessageSquare },
    { label: "Profile", route: "/talent/profile", icon: User },
    { label: "Billing", route: "/talent/billing", icon: CreditCard },
  ],

  COMPANY: [
    { label: "Dashboard", route: "/company/dashboard", icon: Home },
    { label: "Candidates", route: "/company/candidates", icon: Users },
    { label: "Challenges", route: "/company/challenges", icon: Trophy },
    { label: "Messages", route: "/company/messages", icon: MessageSquare },
    { label: "Analytics", route: "/company/analytics", icon: BarChart3 },
    { label: "Billing", route: "/company/billing", icon: CreditCard },
    { label: "Settings", route: "/company/settings", icon: Settings },
  ],
};
