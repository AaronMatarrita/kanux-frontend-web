

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export interface LoginFormState {
  data: LoginFormData;
  errors: LoginFormErrors;
  isLoading: boolean;
  isSubmitted: boolean;
}


export type BackendTalentProfile = {
  id: string;
  user_id: string;
  title: string | null;
  about: string | null;
  location: string | null;
  experience_level: string | null;
  learning_background_id: string | null;
  opportunity_status_id: string | null;
  education: string | null;
  profile_completeness: number;
  contact: Record<string, unknown> | null;
  created_at: string;
};

export type BackendCompanyProfile = {
  id: string;
  user_id: string;
  name: string | null;
  about: string | null;
  location: string | null;
  contact: Record<string, unknown> | null;
  url_logo: string | null;
  goal: string | null;
  created_at: string;
};


export type { SignUpFormData, SignUpFormErrors, SignUpFormState } from './signup.types';
