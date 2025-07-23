import { useState } from 'react';
import { authApi } from '../utils/api';
import { authUtils } from '../utils/auth';

export interface AuthFormState {
  tab: 'login' | 'register';
  username: string;
  password: string;
  confirmPassword: string;
  error: string | undefined;
  loading: boolean;
}

export interface AuthFormActions {
  onTabChange: (newTab: 'login' | 'register') => void;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
}

export interface AuthFormLogic extends AuthFormState, AuthFormActions {}

/**
 * @brief Custom hook that manages authentication form state and business logic
 * @description Handles login and registration form state, validation, and API calls
 * @returns {AuthFormLogic} Object containing form state and action methods
 */
export function useAuthFormLogic(): AuthFormLogic {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  /**
   * @brief Resets form fields to initial state
   * @description Clears username, password, confirm password, and error state
   */
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError(undefined);
  };

  /**
   * @brief Changes authentication tab and resets form
   * @description Switches between login and register modes
   * @param {'login' | 'register'} newTab - The tab to switch to
   */
  const onTabChange = (newTab: 'login' | 'register') => {
    setTab(newTab);
    resetForm();
  };

  /**
   * @brief Updates username field value
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);

  /**
   * @brief Updates password field value
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  /**
   * @brief Updates confirm password field value
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);

  /**
   * @brief Handles form submission for login and registration
   * @description Validates form data and calls appropriate API endpoint
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   * @returns {Promise<void>} Promise that resolves when authentication is complete
   */
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      const validationError = AuthFormValidation.validateForm(
        tab,
        username,
        password,
        confirmPassword,
      );
      if (validationError) {
        setError(validationError);
        return;
      }

      if (tab === 'login') {
        const response = await authApi.login(username, password);
        authUtils.setToken(response.access_token);
        window.location.href = '/dashboard';
      } else {
        await authApi.register(username, password);
        setTab('login');
        resetForm();
        setError('Registration successful! Please log in.');
      }
    } catch (err: any) {
      const errorMessage = err.message || `Failed to ${tab}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    tab,
    username,
    password,
    confirmPassword,
    error,
    loading,
    onTabChange,
    onUsernameChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    resetForm,
  };
}

/**
 * @brief Validation helper class for authentication forms
 * @description Provides static methods for validating login and registration data
 */
export class AuthFormValidation {
  /**
   * @brief Validates authentication form data
   * @description Checks required fields and password requirements for registration
   * @param {'login' | 'register'} tab - Current authentication mode
   * @param {string} username - Username to validate
   * @param {string} password - Password to validate
   * @param {string} confirmPassword - Password confirmation to validate
   * @returns {string | null} Error message if validation fails, null if valid
   */
  static validateForm(
    tab: 'login' | 'register',
    username: string,
    password: string,
    confirmPassword: string,
  ): string | null {
    if (!username || !password) {
      return 'Please fill in all fields';
    }

    if (tab === 'register') {
      if (password !== confirmPassword) {
        return 'Passwords do not match';
      }
      if (password.length < 6) {
        return 'Password must be at least 6 characters long';
      }
    }

    return null;
  }
}
