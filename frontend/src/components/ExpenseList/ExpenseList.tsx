import React from 'react';
import { type Expense } from '../../utils/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import CustomDatePicker from '../ui/DatePicker';
import {
  useExpenseListLogic,
  ExpenseListFormatters,
  ExpenseListConfiguration,
} from './ExpenseList.logic';
import styles from './ExpenseList.module.scss';

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseUpdated: (expense: Expense) => void;
  onExpenseDeleted: (id: number) => void;
}

/**
 * @brief Expense list component with inline editing capabilities
 * @description Displays expenses in a table format with edit and delete functionality
 * @param {ExpenseListProps} props - Component props including expenses array and callbacks
 * @returns {JSX.Element} Table of expenses with inline editing or empty state message
 */
const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onExpenseUpdated,
  onExpenseDeleted,
}) => {
  const logic = useExpenseListLogic(onExpenseUpdated, onExpenseDeleted);

  if (expenses.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{ExpenseListConfiguration.emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.expenseList}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className={styles.row}>
                <td>
                  {logic.editingId === expense.id ? (
                    <CustomDatePicker
                      value={logic.editForm.date}
                      onChange={(date: Date | null) => logic.updateEditForm('date', date)}
                      className={styles.editDatePicker}
                    />
                  ) : (
                    ExpenseListFormatters.formatDate(expense.createdAt)
                  )}
                </td>
                <td>
                  {logic.editingId === expense.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={String(logic.editForm.amount || '')}
                      onChange={(e) => logic.updateEditForm('amount', parseFloat(e.target.value))}
                      className={styles.editInput}
                    />
                  ) : (
                    <span className={styles.amount}>
                      {ExpenseListFormatters.formatAmount(expense.amount)}
                    </span>
                  )}
                </td>
                <td>
                  {logic.editingId === expense.id ? (
                    <select
                      value={logic.editForm.category || expense.category}
                      onChange={(e) => logic.updateEditForm('category', e.target.value)}
                      className={styles.editSelect}
                    >
                      {ExpenseListConfiguration.categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {ExpenseListFormatters.formatCategory(cat)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`${styles.category} ${styles[expense.category.toLowerCase()]}`}
                    >
                      {ExpenseListFormatters.formatCategory(expense.category)}
                    </span>
                  )}
                </td>
                <td>
                  {logic.editingId === expense.id ? (
                    <Input
                      type="text"
                      value={logic.editForm.note || ''}
                      onChange={(e) => logic.updateEditForm('note', e.target.value)}
                      placeholder="Add a note..."
                      className={styles.editInput}
                    />
                  ) : (
                    <span className={styles.note}>{expense.note || '-'}</span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    {logic.editingId === expense.id ? (
                      <>
                        <Button
                          size="small"
                          onClick={() => logic.saveEdit(expense.id)}
                          loading={logic.loading === expense.id}
                          className={styles.saveButton}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={logic.cancelEdit}
                          disabled={logic.loading === expense.id}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => logic.startEdit(expense)}
                          disabled={logic.loading === expense.id}
                          className={styles.editButton}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => logic.deleteExpense(expense.id)}
                          loading={logic.loading === expense.id}
                          className={styles.deleteButton}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
