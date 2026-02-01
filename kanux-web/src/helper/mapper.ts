import { UserRole } from "@/config/sidebar.config";
import {
  BackendTalentProfile,
  BackendCompanyProfile,
} from "@/modules/auth/login/types";
import {
  CompanyProfile,
  TalentProfile,
  Session,
} from "@/types/session.types";
import { LoginResponse } from "@/services/auth.service";

export const mapUserTypeToRole = (
  userType: "company" | "talent"
): UserRole => {
  return userType === "company" ? "COMPANY" : "TALENT";
};

const mapTalentProfile = (profile: BackendTalentProfile): TalentProfile => ({
  id: profile.id,
  id_user: profile.user_id, 
  first_name: profile.first_name ?? null,
  last_name: profile.last_name ?? null,
  title: profile.title ?? null,
  bio: profile.about ?? null,
  location: profile.location ?? null,
  profile_completeness: profile.profile_completeness ?? 100,
  skills: null,
  photo_url: null,
  created_at: profile.created_at,
});

const mapCompanyProfile = (profile: BackendCompanyProfile): CompanyProfile => ({
  id: profile.id,
  id_user: profile.user_id,
  name: profile.name ?? null,
  about: profile.about ?? null,
  location: profile.location ?? null,
  contact: profile.contact ?? null,
  url_logo: profile.url_logo ?? null,
  goal: profile.goal ?? null,
  created_at: profile.created_at,
});

export const mapLoginResponseToSession = (
  response: LoginResponse,
): Session => {
  const baseUser = {
    id: response.user.id,
    email: response.user.email,
  };

  if (response.user.userType === "talent") {
    return {
      isAuthenticated: true,
      token: response.token,
      sessionId: response.sessionId,
      user: {
        ...baseUser,
        userType: "talent",
        profile: mapTalentProfile(response.user.profile),
      },
    };
  }

  return {
    isAuthenticated: true,
    token: response.token,
    sessionId: response.sessionId,
    user: {
      ...baseUser,
      userType: "company",
      profile: mapCompanyProfile(response.user.profile),
    },
  };
};
