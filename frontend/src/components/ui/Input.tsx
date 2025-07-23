import React, { useState } from 'react';
import styles from './Input.module.scss';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  step?: string;
  className?: string;
  showPasswordToggle?: boolean;
}

/**
 * @brief Reusable input component with glassmorphism styling
 * @description Provides a consistent input interface with optional password toggle,
 *             label support, and glassmorphism styling
 * @param {InputProps} props - Component props including type, label, and validation
 * @returns {JSX.Element} Styled input field with optional password visibility toggle
 */
const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  min,
  step,
  className = '',
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  /**
   * @brief Toggles password visibility state
   * @description Switches between showing and hiding password characters
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  /**
   * @brief Generates CSS class string for input group styling
   * @description Combines base input group class with optional custom className
   * @returns {string} Space-separated CSS class string
   */
  const getInputGroupClasses = (): string => {
    return `${styles.inputGroup} ${className}`;
  };

  return (
    <div className={getInputGroupClasses()}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          step={step}
          className={styles.input}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
