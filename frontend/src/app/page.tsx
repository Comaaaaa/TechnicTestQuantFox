'use client';
import { useAuthForm } from '../hooks/useAuthForm';
import { authUtils } from '../utils/auth';
import AuthCardView from '../components/AuthCard/AuthCardView';
import { useEffect } from 'react';

/**
 * @brief Root page component that renders login as the default page
 * @description Renders the login page directly as the default route
 * @returns {JSX.Element} Login page with authentication card
 */
export default function Home() {
  const auth = useAuthForm();

  /**
   * @brief Effect hook that handles authentication state
   * @description Validates existing tokens and redirects authenticated users to dashboard
   */
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    // Check if user is authenticated with valid token
    if (authUtils.isAuthenticated()) {
      window.location.href = '/dashboard';
    } else {
      // Clear any invalid tokens to ensure clean state
      authUtils.removeToken();
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <AuthCardView {...auth} />
    </div>
  );
}
