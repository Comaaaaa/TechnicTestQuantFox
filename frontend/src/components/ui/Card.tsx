import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @brief Glassmorphism card container component
 * @description Provides a styled container with glassmorphism effects for content grouping
 * @param {CardProps} props - Component props including children and optional className
 * @returns {JSX.Element} Styled card container with glassmorphism background
 */
const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  /**
   * @brief Generates CSS class string for card styling
   * @description Combines base card class with optional custom className
   * @returns {string} Space-separated CSS class string
   */
  const getCardClasses = (): string => {
    return [styles.card, className].filter(Boolean).join(' ');
  };

  return <div className={getCardClasses()}>{children}</div>;
};

export default Card;
 