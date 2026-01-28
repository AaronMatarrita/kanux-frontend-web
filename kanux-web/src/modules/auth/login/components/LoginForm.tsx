"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import styles from "../styles/login.module.css";
import type { LoginFormData, LoginFormErrors } from "../types";

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void> | void;
  isLoading?: boolean;
  submitError?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  submitError,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 4) return "Password must be at least 4 characters";
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
        submit: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleSignUpClick = () => {
    router.push("/onboarding/account-selection");
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Continue your journey with Kánux</p>
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

        <PasswordInput
          value={formData.password}
          error={errors.password}
          onChange={handlePasswordChange}
          disabled={isLoading}
          placeholder="••••••••"
        />

        <div className={styles.rememberForgot}>
          <div className={styles.rememberMe}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link
            href="/auth/forgot-password"
            className={styles.forgotPasswordLink}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className={styles.footer}>
        <span>Don't have an account?</span>
        <button
          type="button"
          onClick={handleSignUpClick}
          className={styles.getStartedLink}
        >
          Get started
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
