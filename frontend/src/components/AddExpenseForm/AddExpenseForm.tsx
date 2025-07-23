import React from 'react';
import { type Expense } from '../../utils/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import CustomDatePicker from '../ui/DatePicker';
import { useAddExpenseFormLogic, AddExpenseFormConfiguration } from './AddExpenseForm.logic';
import styles from './AddExpenseForm.module.scss';

interface AddExpenseFormProps {
  onExpenseAdded: (expense: Expense) => void;
  onCancel: () => void;
}

/**
 * @brief Expense creation form component
 * @description Provides a modal form for adding new expenses with validation and date picker
 * @param {AddExpenseFormProps} props - Component props including callbacks for form actions
 * @returns {JSX.Element} Modal form with expense input fields and action buttons
 */
const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onExpenseAdded, onCancel }) => {
  const logic = useAddExpenseFormLogic(onExpenseAdded);

  return (
    <Card className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2>{AddExpenseFormConfiguration.formLabels.title}</h2>
        <button onClick={onCancel} className={styles.closeButton}>
          ×
        </button>
      </div>

      {logic.error && <div className={styles.errorMessage}>{logic.error}</div>}

      <form onSubmit={logic.handleSubmit} className={styles.form}>
        <Input
          label={AddExpenseFormConfiguration.formLabels.amount}
          type="number"
          step="0.01"
          min={0}
          value={String(logic.form.amount || 0)}
          onChange={(e) => logic.updateForm('amount', parseFloat(e.target.value) || 0)}
          placeholder={AddExpenseFormConfiguration.placeholders.amount}
          required
        />

        <CustomDatePicker
          label={AddExpenseFormConfiguration.formLabels.date}
          value={logic.form.date}
          onChange={(date: Date | null) => logic.updateForm('date', date)}
          required
        />

        <div className={styles.selectGroup}>
          <label className={styles.selectLabel}>
            {AddExpenseFormConfiguration.formLabels.category}
          </label>
          <select
            value={logic.form.category}
            onChange={(e) => logic.updateForm('category', e.target.value)}
            className={styles.select}
            required
          >
            {AddExpenseFormConfiguration.categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={AddExpenseFormConfiguration.formLabels.note}
          type="text"
          value={logic.form.note || ''}
          onChange={(e) => logic.updateForm('note', e.target.value)}
          placeholder={AddExpenseFormConfiguration.placeholders.note}
        />

        <div className={styles.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={logic.loading}
            className={styles.cancelButton}
          >
            {AddExpenseFormConfiguration.formLabels.cancel}
          </Button>
          <Button type="submit" loading={logic.loading} className={styles.submitButton}>
            {AddExpenseFormConfiguration.formLabels.submit}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddExpenseForm;
