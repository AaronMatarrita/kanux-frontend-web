'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import SignUpForm from './SignUpForm';
import styles from '../styles/login.module.css';
import type { LoginFormData, LoginFormErrors } from '../types';
import type { SignUpFormData } from '../types/signup.types';

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void> | void;
  onSignUp?: (data: SignUpFormData) => Promise<void> | void;
  isLoading?: boolean;
  submitError?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSignUp,
  isLoading = false,
  submitError,
}) => {
  const [showSignUp, setShowSignUp] = useState(false);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [signUpError, setSignUpError] = useState<string>();

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });

    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });

    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      setErrors({
        ...errors,
        submit: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };


  const handleSignUp = async (data: SignUpFormData) => {
    setSignUpError(undefined);
    try {
      if (onSignUp) {
        await onSignUp(data);
      }

      setShowSignUp(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setSignUpError(errorMessage);
    }
  };

  if (showSignUp) {
    return (
      <SignUpForm
        onSubmit={handleSignUp}
        onCancel={() => setShowSignUp(false)}
        submitError={signUpError}
      />
    );
  }

  return (
    <div className={styles.loginCard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bienvenido de vuelta</h1>
        <p className={styles.subtitle}>Continua tu jornada con Kánux</p>
      </div>

      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput
          value={formData.email}
          error={errors.email}
          onChange={handleEmailChange}
          disabled={isLoading}
          placeholder="your@email.com"
        />

        <div>
          <PasswordInput
            value={formData.password}
            error={errors.password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            placeholder="••••••••"
          />
          <div className={styles.forgotPassword}>
            <Link href="/auth/forgot-password">Olvidaste tu contraseña?</Link>
          </div>
        </div>

        <div className={styles.rememberMe}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="rememberMe">Recuerdame</label>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className={styles.footer}>
        <span>No tienes una cuenta?</span>
        <button
          type="button"
          onClick={() => setShowSignUp(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2ba8d6',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
         Regístrate
        </button>
      </div>
    </div>
  );
};

export default LoginForm;