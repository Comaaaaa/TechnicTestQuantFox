import { useState } from 'react';
import { expenseApi, type Expense, type UpdateExpenseDto, type Category } from '../../utils/api';

export interface ExpenseListState {
  editingId: number | null;
  editForm: UpdateExpenseDto & { date?: Date };
  loading: number | null;
}

export interface ExpenseListActions {
  startEdit: (expense: Expense) => void;
  cancelEdit: () => void;
  saveEdit: (id: number) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  updateEditForm: (field: keyof (UpdateExpenseDto & { date?: Date }), value: any) => void;
}

export interface ExpenseListLogic extends ExpenseListState, ExpenseListActions {}

/**
 * @brief Custom hook that manages expense list state and business logic
 * @description Handles expense editing, updating, and deletion operations
 * @param {Function} onExpenseUpdated - Callback function called when expense is updated
 * @param {Function} onExpenseDeleted - Callback function called when expense is deleted
 * @returns {ExpenseListLogic} Object containing state and action methods
 */
export function useExpenseListLogic(
  onExpenseUpdated: (expense: Expense) => void,
  onExpenseDeleted: (id: number) => void,
): ExpenseListLogic {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateExpenseDto & { date?: Date }>({});
  const [loading, setLoading] = useState<number | null>(null);

  /**
   * @brief Initiates edit mode for a specific expense
   * @description Populates edit form with expense data and sets editing state
   * @param {Expense} expense - The expense object to edit
   */
  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm({
      amount: expense.amount,
      note: expense.note || '',
      category: expense.category,
      date: new Date(expense.createdAt),
    });
  };

  /**
   * @brief Cancels edit mode and resets form state
   * @description Clears editing state and form data
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  /**
   * @brief Saves edited expense data to the API
   * @description Updates expense via API and calls success callback
   * @param {number} id - The ID of the expense to update
   * @returns {Promise<void>} Promise that resolves when update is complete
   */
  const saveEdit = async (id: number) => {
    try {
      setLoading(id);

      const updateData: UpdateExpenseDto = {
        amount: editForm.amount,
        note: editForm.note,
        category: editForm.category,
      };

      // Only add createdAt if date is defined
      if (editForm.date) {
        updateData.createdAt = editForm.date.toISOString();
      }

      const updatedExpense = await expenseApi.update(id, updateData);
      onExpenseUpdated(updatedExpense);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('❌ Debug - Failed to update expense:', error);
    } finally {
      setLoading(null);
    }
  };

  /**
   * @brief Deletes an expense after user confirmation
   * @description Shows confirmation dialog and deletes expense via API
   * @param {number} id - The ID of the expense to delete
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   */
  const deleteExpense = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      setLoading(id);
      await expenseApi.delete(id);
      onExpenseDeleted(id);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    } finally {
      setLoading(null);
    }
  };

  /**
   * @brief Updates edit form field with type conversion
   * @description Handles different field types and converts values appropriately
   * @param {string} field - The form field to update
   * @param {any} value - The new value for the field
   */
  const updateEditForm = (field: keyof (UpdateExpenseDto & { date?: Date }), value: any) => {
    setEditForm((prev) => {
      const newForm = {
        ...prev,
        [field]:
          field === 'amount'
            ? Number(value)
            : field === 'date'
            ? value instanceof Date
              ? value
              : new Date(value)
            : value,
      };
      return newForm;
    });
  };

  return {
    editingId,
    editForm,
    loading,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteExpense,
    updateEditForm,
  };
}

/**
 * @brief Helper class for data formatting and display
 * @description Provides static methods for formatting dates, categories, and amounts
 */
export class ExpenseListFormatters {
  /**
   * @brief Formats date string to readable format
   * @description Converts ISO date string to localized date format
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date string
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * @brief Formats category string to title case
   * @description Capitalizes first letter and converts rest to lowercase
   * @param {string} category - Category string to format
   * @returns {string} Formatted category string
   */
  static formatCategory(category: string): string {
    return category.charAt(0) + category.slice(1).toLowerCase();
  }

  /**
   * @brief Formats amount number to currency string
   * @description Converts number to Euro currency format with 2 decimal places
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  static formatAmount(amount: number): string {
    return `€${amount.toFixed(2)}`;
  }
}

/**
 * @brief Configuration class for expense list settings
 * @description Provides static constants for category options and messages
 */
export class ExpenseListConfiguration {
  static readonly categoryOptions: Category[] = [
    'FOOD',
    'TRAVEL',
    'OFFICE',
    'SHOPPING',
    'INVESTMENTS',
    'OTHER',
  ];

  static readonly emptyStateMessage = 'No expenses found. Add your first expense to get started!';
  static readonly deleteConfirmationMessage = 'Are you sure you want to delete this expense?';
}
