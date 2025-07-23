'use client';

import React, { useRef } from 'react';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * @brief Custom date picker component using native HTML date input
 * @description Provides a styled date picker that integrates with the app's glassmorphism theme
 * @param {DatePickerProps} props - Component props
 * @returns {JSX.Element} Styled date picker input with label
 */
const CustomDatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  className,
  disabled = false,
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const dateValue = value ? value.toISOString().split('T')[0] : '';

  /**
   * @brief Handles date input change events
   * @description Converts string input value to Date object and calls onChange callback
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const newValue = e.target.value;
      if (newValue) {
        const newDate = new Date(newValue);
        onChange(newDate);
      } else {
        onChange(null);
      }
    }
  };

  /**
   * @brief Handles click events to ensure date picker opens
   * @description Uses showPicker API or focus fallback to open native date picker
   */
  const handleClick = () => {
    if (inputRef.current && !disabled) {
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className={`${styles.datePickerContainer} ${className || ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="date"
        value={dateValue}
        onChange={handleChange}
        onClick={handleClick}
        disabled={disabled}
        required={required}
        className={styles.dateInput}
      />
    </div>
  );
};

export default CustomDatePicker;
