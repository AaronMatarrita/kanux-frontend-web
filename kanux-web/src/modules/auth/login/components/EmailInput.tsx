'use client';

import React from 'react';
import styles from '../styles/login.module.css';

interface EmailInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  error,
  onChange,
  disabled = false,
  placeholder = 'your@email.com',
}) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor="email">
        Correo
      </label>
      <input
        id="email"
        type="email"
        className={`${styles.input} ${error ? styles.error : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        required
        aria-label="Email address"
        aria-invalid={!!error}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default EmailInput;
