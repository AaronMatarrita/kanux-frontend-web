'use client';

import React, { useState } from 'react';
import styles from '../styles/login.module.css';

interface PasswordInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  error,
  onChange,
  disabled = false,
  placeholder = '••••••••',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor="password">
        Contraseña
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className={`${styles.input} ${error ? styles.error : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          required
          aria-label="Password"
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: '#666',
            fontSize: '16px',
            opacity: disabled ? 0.5 : 1,
          }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default PasswordInput;
