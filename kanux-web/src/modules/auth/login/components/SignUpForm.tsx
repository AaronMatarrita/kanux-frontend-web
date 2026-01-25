'use client';

import React, { useState, FormEvent } from 'react';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import styles from '../styles/login.module.css';
import type { SignUpFormData, SignUpFormErrors } from '../types/signup.types';

interface SignUpFormProps {
  onSubmit?: (data: SignUpFormData) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitError?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  submitError,
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'talent',
  });

  const [errors, setErrors] = useState<SignUpFormErrors>({});

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

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

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

  const handleConfirmPasswordChange = (value: string) => {
    setFormData({ ...formData, confirmPassword: value });
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: undefined });
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

  return (
    <div className={styles.loginCard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Registrar una cuenta</h1>
        <p className={styles.subtitle}>Únete a Kánux y empieza a crecer</p>
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
        </div>

        <div>
          <PasswordInput
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleConfirmPasswordChange}
            disabled={isLoading}
            placeholder="••••••••"
          />
          <label style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>
            Confirma contraseña
          </label>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Regístrate'}
        </button>
      </form>

      {onCancel && (
        <div className={styles.footer}>
          <span>Ya te encuentras registrado?</span>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#2ba8d6',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
           Inicia sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
