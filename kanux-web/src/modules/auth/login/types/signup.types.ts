
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  userType?: 'talent' | 'company';
}

export interface SignUpFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  userType?: string;
  submit?: string;
}

export interface SignUpFormState {
  data: SignUpFormData;
  errors: SignUpFormErrors;
  isLoading: boolean;
  isSubmitted: boolean;
}
