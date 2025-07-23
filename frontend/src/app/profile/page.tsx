'use client';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useProfileLogic } from './page.logic';
import styles from './page.module.scss';

export default function ProfilePage() {
  const logic = useProfileLogic();

  if (logic.loading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>User Profile</h1>
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = '/dashboard')}
            className={styles.backButton}
          >
            Back to Dashboard
          </Button>
          <Button variant="secondary" onClick={logic.handleLogout} className={styles.logoutButton}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.profileSection}>
          <Card className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <h2>Edit Profile</h2>
              <p className={styles.subtitle}>Update your username and password</p>
            </div>

            {logic.error && <div className={styles.errorMessage}>{logic.error}</div>}

            {logic.success && <div className={styles.successMessage}>{logic.success}</div>}

            <form onSubmit={logic.handleUpdateProfile} className={styles.form}>
              <div className={styles.formSection}>
                <h3>Account Information</h3>
                <Input
                  type="text"
                  label="Username"
                  placeholder="Enter new username"
                  value={logic.username}
                  onChange={(e) => logic.setUsername(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formSection}>
                <h3>Change Password</h3>
                <Input
                  type="password"
                  label="Current Password"
                  placeholder="Enter current password"
                  value={logic.currentPassword}
                  onChange={(e) => logic.setCurrentPassword(e.target.value)}
                  showPasswordToggle
                />

                <Input
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  value={logic.newPassword}
                  onChange={(e) => logic.setNewPassword(e.target.value)}
                  showPasswordToggle
                />

                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={logic.confirmPassword}
                  onChange={(e) => logic.setConfirmPassword(e.target.value)}
                  showPasswordToggle
                />
              </div>

              <div className={styles.formActions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => (window.location.href = '/dashboard')}
                  disabled={logic.saving}
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={logic.saving} className={styles.saveButton}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
