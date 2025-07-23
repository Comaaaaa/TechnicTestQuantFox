import React from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './AuthCardView.module.scss';

export type AuthCardViewProps = {
  tab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
  username: string;
  password: string;
  confirmPassword?: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  loading?: boolean;
};

/**
 * @brief Authentication card view component
 * @description Provides a tabbed interface for login and registration forms with glassmorphism styling
 * @param {AuthCardViewProps} props - Component props including form state and event handlers
 * @returns {JSX.Element} Tabbed authentication form with login and register modes
 */
const AuthCardView: React.FC<AuthCardViewProps> = ({
  tab,
  onTabChange,
  username,
  password,
  confirmPassword,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  error,
  loading,
}) => {
  return (
    <Card className={styles.authCard}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${tab === 'login' ? styles.active : ''}`}
          onClick={() => onTabChange('login')}
          type="button"
        >
          Login
        </button>
        <button
          className={`${styles.tabButton} ${tab === 'register' ? styles.active : ''}`}
          onClick={() => onTabChange('register')}
          type="button"
        >
          Register
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form className={styles.form} onSubmit={onSubmit}>
        <Input
          type="text"
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={onUsernameChange}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={onPasswordChange}
          required
          showPasswordToggle
        />

        {tab === 'register' && confirmPassword !== undefined && onConfirmPasswordChange && (
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            required
            showPasswordToggle
          />
        )}

        <Button type="submit" variant="glass" className={styles.submitButton} loading={loading}>
          {tab === 'login' ? 'Log in' : 'Register'}
        </Button>
      </form>

      <div className={styles.switchTab}>
        <span className={styles.switchText}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => onTabChange(tab === 'login' ? 'register' : 'login')}
            className={styles.switchLink}
          >
            {tab === 'login' ? 'Register' : 'Login'}
          </button>
        </span>
      </div>
    </Card>
  );
};

export default AuthCardView;
