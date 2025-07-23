import { useState } from 'react';
import { expenseApi, type CreateExpenseDto, type Category, type Expense } from '../../utils/api';

export interface AddExpenseFormState {
  form: CreateExpenseDto & { date?: Date };
  loading: boolean;
  error: string;
}

export interface AddExpenseFormActions {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  updateForm: (field: keyof (CreateExpenseDto & { date?: Date }), value: any) => void;
  resetForm: () => void;
}

export interface AddExpenseFormLogic extends AddExpenseFormState, AddExpenseFormActions {}

/**
 * @brief Custom hook that manages add expense form state and business logic
 * @description Handles form data management, validation, and expense creation
 * @param {Function} onExpenseAdded - Callback function called when expense is successfully added
 * @returns {AddExpenseFormLogic} Object containing form state and action methods
 */
export function useAddExpenseFormLogic(
  onExpenseAdded: (expense: Expense) => void,
): AddExpenseFormLogic {
  const [form, setForm] = useState<CreateExpenseDto & { date?: Date }>({
    amount: 0,
    note: '',
    category: 'OTHER',
    date: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  /**
   * @brief Updates form field value with type conversion
   * @description Handles different field types and converts values appropriately
   * @param {string} field - The form field to update
   * @param {any} value - The new value for the field
   */
  const updateForm = (field: keyof (CreateExpenseDto & { date?: Date }), value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === 'amount'
          ? Number(value)
          : field === 'date'
          ? value instanceof Date
            ? value
            : new Date(value)
          : value,
    }));
  };

  /**
   * @brief Resets form to initial state
   * @description Clears all form fields and error state
   */
  const resetForm = () => {
    setForm({
      amount: 0,
      note: '',
      category: 'OTHER',
      date: new Date(),
    });
    setError('');
  };

  /**
   * @brief Handles form submission and expense creation
   * @description Validates form data and creates new expense via API
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>} Promise that resolves when expense is created
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = AddExpenseFormValidation.validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const expenseData: CreateExpenseDto = {
        amount: form.amount,
        note: form.note,
        category: form.category,
        createdAt: form.date ? form.date.toISOString() : new Date().toISOString(),
      };

      const newExpense = await expenseApi.create(expenseData);
      onExpenseAdded(newExpense);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    handleSubmit,
    updateForm,
    resetForm,
  };
}

/**
 * @brief Validation helper class for expense form data
 * @description Provides static methods for validating expense form inputs
 */
export class AddExpenseFormValidation {
  /**
   * @brief Validates expense form data
   * @description Checks amount, note length, and date validity
   * @param {CreateExpenseDto & { date?: Date }} form - The form data to validate
   * @returns {string | null} Error message if validation fails, null if valid
   */
  static validateForm(form: CreateExpenseDto & { date?: Date }): string | null {
    if (!form.amount || form.amount <= 0) {
      return 'Please enter a valid amount';
    }

    if (form.amount > 999999) {
      return 'Amount is too large';
    }

    if (form.note && form.note.length > 500) {
      return 'Note is too long (max 500 characters)';
    }

    if (form.date && form.date > new Date()) {
      return 'Date cannot be in the future';
    }

    return null;
  }
}

/**
 * @brief Configuration class for expense form settings
 * @description Provides static constants for form labels, options, and placeholders
 */
export class AddExpenseFormConfiguration {
  static readonly categoryOptions: { value: Category; label: string }[] = [
    { value: 'FOOD', label: 'Food & Dining' },
    { value: 'TRAVEL', label: 'Travel & Transport' },
    { value: 'OFFICE', label: 'Office & Work' },
    { value: 'SHOPPING', label: 'Shopping' },
    { value: 'INVESTMENTS', label: 'Investments' },
    { value: 'OTHER', label: 'Other' },
  ];

  static readonly defaultForm: CreateExpenseDto & { date?: Date } = {
    amount: 0,
    note: '',
    category: 'OTHER',
    date: new Date(),
  };

  static readonly formLabels = {
    title: 'Add New Expense',
    amount: 'Amount (€)',
    category: 'Category',
    note: 'Note (Optional)',
    date: 'Date',
    submit: 'Add Expense',
    cancel: 'Cancel',
  };

  static readonly placeholders = {
    amount: '0.00',
    note: 'Add a description...',
    date: 'Select date',
  };
}
