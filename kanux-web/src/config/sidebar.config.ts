import {
  type LucideIcon,
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
  icon: LucideIcon;
}

export const SIDEBAR_MENU: Record<UserRole, SidebarMenuItem[]> = {
  TALENT: [
    { label: "Inicio", route: "/talent/dashboard", icon: Home },
    { label: "Desafíos", route: "/talent/challenges", icon: Trophy },
    { label: "Habilidades", route: "/talent/skills", icon: Medal },
    { label: "Mensajes", route: "/talent/messages", icon: MessageSquare },
    { label: "Analítica", route: "/talent/analytics", icon: BarChart3 },
    { label: "Perfil", route: "/talent/profile", icon: User },
    { label: "Facturación", route: "/talent/billing", icon: CreditCard },
  ],

  COMPANY: [
    { label: "Inicio", route: "/company/dashboard", icon: Home },
    { label: "Candidatos", route: "/company/candidates", icon: Users },
    { label: "Desafíos", route: "/company/challenges", icon: Trophy },
    { label: "Mensajes", route: "/company/messages", icon: MessageSquare },
    { label: "Analítica", route: "/company/analytics", icon: BarChart3 },
    { label: "Facturación", route: "/company/billing", icon: CreditCard },
  ],
};
