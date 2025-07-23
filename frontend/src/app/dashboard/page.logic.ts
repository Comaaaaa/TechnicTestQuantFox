import { useEffect, useState } from 'react';
import { authUtils } from '../../utils/auth';
import { expenseApi, userApi, type Expense, type User } from '../../utils/api';

export interface DashboardState {
  user: User | null;
  expenses: Expense[];
  loading: boolean;
  error: string;
  showAddForm: boolean;
}

export interface DashboardActions {
  loadDashboardData: () => Promise<void>;
  handleLogout: () => void;
  handleExpenseAdded: (newExpense: Expense) => void;
  handleExpenseUpdated: (updatedExpense: Expense) => void;
  handleExpenseDeleted: (deletedId: number) => void;
  setShowAddForm: (show: boolean) => void;
}

export interface DashboardLogic extends DashboardState, DashboardActions {}

/**
 * @brief Custom hook that manages dashboard state and business logic
 * @description Handles user authentication, expense data loading, and form management
 * @returns {DashboardLogic} Object containing state and action methods
 */
export function useDashboardLogic(): DashboardLogic {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  /**
   * @brief Effect hook that initializes dashboard data on component mount
   * @description Checks authentication and loads user data if authenticated
   */
  useEffect(() => {
    const initializeDashboard = async () => {
      if (typeof window === 'undefined') return;

      if (!authUtils.isAuthenticated()) {
        authUtils.removeToken();
        window.location.href = '/';
        return;
      }

      await loadDashboardData();
    };

    initializeDashboard();
  }, []);

  /**
   * @brief Loads user profile and expenses data from the API
   * @description Fetches user information and expense list concurrently
   * @returns {Promise<void>} Promise that resolves when data is loaded
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [userProfile, userExpenses] = await Promise.all([
        userApi.getProfile(),
        expenseApi.getAll(),
      ]);

      setUser(userProfile);
      setExpenses(userExpenses);
    } catch (err: any) {
      console.error('Dashboard data loading error:', err);

      const errorMessage = err.message || 'Failed to load dashboard data';
      const isAuthError =
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('401') ||
        errorMessage.includes('Authentication') ||
        errorMessage.includes('Forbidden') ||
        errorMessage.includes('403');

      if (isAuthError) {
        authUtils.removeToken();
        setError('Authentication failed. Please log in again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * @brief Handles user logout by clearing token and redirecting to login
   * @description Removes authentication token and navigates to login page
   */
  const handleLogout = () => {
    authUtils.removeToken();
    window.location.href = '/';
  };

  /**
   * @brief Adds a new expense to the local state and closes the add form
   * @param {Expense} newExpense - The newly created expense object
   */
  const handleExpenseAdded = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    setShowAddForm(false);
  };

  /**
   * @brief Updates an existing expense in the local state
   * @param {Expense} updatedExpense - The updated expense object
   */
  const handleExpenseUpdated = (updatedExpense: Expense) => {
    setExpenses((prev) =>
      prev.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)),
    );
  };

  /**
   * @brief Removes an expense from the local state
   * @param {number} deletedId - The ID of the expense to remove
   */
  const handleExpenseDeleted = (deletedId: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== deletedId));
  };

  return {
    user,
    expenses,
    loading,
    error,
    showAddForm,
    loadDashboardData,
    handleLogout,
    handleExpenseAdded,
    handleExpenseUpdated,
    handleExpenseDeleted,
    setShowAddForm,
  };
}

/**
 * @brief Helper class for dashboard calculations and data processing
 * @description Provides static methods for calculating expense statistics
 */
export class DashboardCalculations {
  /**
   * @brief Calculates the total sum of all expenses
   * @param {Expense[]} expenses - Array of expense objects
   * @returns {number} Total amount of all expenses
   */
  static getTotalExpenses(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  /**
   * @brief Calculates the total expenses for the current month
   * @param {Expense[]} expenses - Array of expense objects
   * @returns {number} Total amount of expenses for current month
   */
  static getMonthlyExpenses(expenses: Expense[]): number {
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        const now = new Date();
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }

  /**
   * @brief Counts the total number of expense transactions
   * @param {Expense[]} expenses - Array of expense objects
   * @returns {number} Total number of expenses
   */
  static getTotalTransactions(expenses: Expense[]): number {
    return expenses.length;
  }
}
