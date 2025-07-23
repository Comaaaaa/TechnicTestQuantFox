'use client';
import ExpenseChart from '../../components/ExpenseChart/ExpenseChart';
import ExpenseList from '../../components/ExpenseList/ExpenseList';
import AddExpenseForm from '../../components/AddExpenseForm/AddExpenseForm';
import { useDashboardLogic, DashboardCalculations } from './page.logic';
import styles from './page.module.scss';

/**
 * @brief Main dashboard page component
 * @description Displays user dashboard with expense summary, charts, and expense management
 * @returns {JSX.Element} Dashboard page with loading, error, or main content
 */
export default function DashboardPage() {
  const logic = useDashboardLogic();

  if (logic.loading) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  if (logic.error) {
    if (
      logic.error.includes('Unauthorized') ||
      logic.error.includes('401') ||
      logic.error.includes('Authentication')
    ) {
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      return (
        <div className={styles.dashboardPage}>
          <div className={styles.loading}>Redirecting to login...</div>
        </div>
      );
    }

    return (
      <div className={styles.dashboardPage}>
        <div className={styles.error}>Error: {logic.error}</div>
      </div>
    );
  }

  if (!logic.user) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.loading}>Loading user data...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Expense Tracker</h1>
        <div className={styles.userInfo}>
          <span>Welcome, {logic.user.username}</span>
          <div className={styles.headerActions}>
            <button
              onClick={() => (window.location.href = '/profile')}
              className={styles.profileButton}
            >
              Profile
            </button>
            <button onClick={logic.handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <h3>Total Expenses</h3>
            <p className={styles.amount}>
              €{DashboardCalculations.getTotalExpenses(logic.expenses).toFixed(2)}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <h3>This Month</h3>
            <p className={styles.amount}>
              €{DashboardCalculations.getMonthlyExpenses(logic.expenses).toFixed(2)}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Total Transactions</h3>
            <p className={styles.count}>
              {DashboardCalculations.getTotalTransactions(logic.expenses)}
            </p>
          </div>
        </div>

        <div className={styles.chartsSection}>
          <ExpenseChart expenses={logic.expenses} />
        </div>

        <div className={styles.expensesSection}>
          <div className={styles.sectionHeader}>
            <h2>Recent Expenses</h2>
            <button onClick={() => logic.setShowAddForm(true)} className={styles.addButton}>
              Add Expense
            </button>
          </div>

          <ExpenseList
            expenses={logic.expenses}
            onExpenseUpdated={logic.handleExpenseUpdated}
            onExpenseDeleted={logic.handleExpenseDeleted}
          />
        </div>
      </main>

      {logic.showAddForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <AddExpenseForm
              onExpenseAdded={logic.handleExpenseAdded}
              onCancel={() => logic.setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
