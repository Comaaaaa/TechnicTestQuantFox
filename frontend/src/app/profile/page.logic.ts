import { useEffect, useState } from 'react';
import { authUtils } from '../../utils/auth';
import { userApi, type User } from '../../utils/api';

export interface ProfileState {
  user: User | null;
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileActions {
  loadUserProfile: () => Promise<void>;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => void;
  setUsername: (username: string) => void;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
}

export interface ProfileLogic extends ProfileState, ProfileActions {}

/**
 * @brief Custom hook that manages profile page state and business logic
 * @description Handles user profile data loading, form management, and profile updates
 * @returns {ProfileLogic} Object containing state and action methods
 */
export function useProfileLogic(): ProfileLogic {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /**
   * @brief Effect hook that initializes profile data on component mount
   * @description Checks authentication and loads user profile if authenticated
   */
  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    loadUserProfile();
  }, []);

  /**
   * @brief Loads user profile data from the API
   * @description Fetches user information and populates form fields
   * @returns {Promise<void>} Promise that resolves when profile is loaded
   */
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await userApi.getProfile();
      setUser(userProfile);
      setUsername(userProfile.username);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * @brief Handles profile update form submission
   * @description Validates form data and updates user profile
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>} Promise that resolves when update is complete
   */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const validationError = ProfileValidation.validateForm(
        username,
        newPassword,
        confirmPassword,
      );
      if (validationError) {
        setError(validationError);
        return;
      }

      // Prepare update data
      const updateData: {
        username?: string;
        currentPassword?: string;
        password?: string;
      } = {};

      // Add username if changed
      if (username !== user?.username) {
        updateData.username = username;
      }

      // Add password if provided
      if (newPassword) {
        if (!currentPassword) {
          setError('Current password is required to change password');
          return;
        }
        updateData.currentPassword = currentPassword;
        updateData.password = newPassword;
      }

      // Call API to update profile
      await userApi.updateProfile(updateData);

      setSuccess('Profile updated successfully!');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  /**
   * @brief Handles user logout by clearing token and redirecting to login
   * @description Removes authentication token and navigates to login page
   */
  const handleLogout = () => {
    authUtils.removeToken();
    window.location.href = '/login';
  };

  return {
    user,
    loading,
    saving,
    error,
    success,
    username,
    currentPassword,
    newPassword,
    confirmPassword,
    loadUserProfile,
    handleUpdateProfile,
    handleLogout,
    setUsername,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
  };
}

/**
 * @brief Helper class for profile form validation
 * @description Provides static methods for validating profile update forms
 */
export class ProfileValidation {
  /**
   * @brief Validates profile update form data
   * @param {string} username - The username to validate
   * @param {string} newPassword - The new password to validate
   * @param {string} confirmPassword - The password confirmation to validate
   * @returns {string | null} Error message if validation fails, null if valid
   */
  static validateForm(
    username: string,
    newPassword: string,
    confirmPassword: string,
  ): string | null {
    if (!username.trim()) {
      return 'Username cannot be empty';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (newPassword && newPassword.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (newPassword && newPassword !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  }
}
