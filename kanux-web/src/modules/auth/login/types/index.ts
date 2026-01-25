/**
 * Login Module Types
 */

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

export type { SignUpFormData, SignUpFormErrors, SignUpFormState } from './signup.types';
