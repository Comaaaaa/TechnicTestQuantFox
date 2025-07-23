import React from 'react';
import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * @brief Reusable button component with multiple variants and states
 * @description Provides a consistent button interface with glassmorphism styling,
 *             loading states, and multiple size and variant options
 * @param {ButtonProps} props - Component props including variant, size, and loading state
 * @returns {JSX.Element} Styled button with optional loading spinner
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  /**
   * @brief Generates CSS class string for button styling
   * @description Combines base button class with variant, size, and loading classes
   * @returns {string} Space-separated CSS class string
   */
  const getButtonClasses = (): string => {
    return [styles.button, styles[variant], styles[size], loading ? styles.loading : '', className]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <button className={getButtonClasses()} disabled={disabled || loading} {...props}>
      {loading && <div className={styles.spinner} />}
      {children}
    </button>
  );
};

export default Button;
