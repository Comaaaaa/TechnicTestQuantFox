'use client';
import { useEffect } from 'react';
import { useAuthForm } from '../../hooks/useAuthForm';
import { authUtils } from '../../utils/auth';
import AuthCardView from '../../components/AuthCard/AuthCardView';
import styles from './page.module.scss';

export default function LoginPage() {
  const auth = useAuthForm();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (authUtils.isAuthenticated()) {
      window.location.href = '/dashboard';
    } else {
      authUtils.removeToken();
    }
  }, []);

  return (
    <div className={styles.loginPage}>
      <AuthCardView {...auth} />
    </div>
  );
}
