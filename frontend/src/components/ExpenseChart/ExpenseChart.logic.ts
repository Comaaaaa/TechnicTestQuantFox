import { useState } from 'react';
import { type Expense } from '../../utils/api';

export type ChartType = 'line' | 'bar' | 'doughnut' | 'pie' | 'category-bar';

export interface ChartState {
  chartType: ChartType;
}

export interface ChartActions {
  setChartType: (type: ChartType) => void;
}

export interface ChartLogic extends ChartState, ChartActions {}

/**
 * @brief Custom hook that manages chart type selection state
 * @description Handles chart type switching for expense visualization
 * @returns {ChartLogic} Object containing chart state and actions
 */
export function useChartLogic(): ChartLogic {
  const [chartType, setChartType] = useState<ChartType>('line');

  return {
    chartType,
    setChartType,
  };
}

/**
 * @brief Data processing class for chart data transformation
 * @description Provides static methods for converting expense data into chart-ready formats
 */
export class ChartDataProcessor {
  /**
   * @brief Processes expenses by date for time-series charts
   * @description Groups expenses by date and calculates daily totals
   * @param {Expense[]} expenses - Array of expense objects
   * @returns {Object} Object containing sorted labels and data arrays
   */
  static getExpensesByDate(expenses: Expense[]) {
    const expensesByDate: { [key: string]: number } = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt).toLocaleDateString();
      expensesByDate[date] = (expensesByDate[date] || 0) + expense.amount;
    });

    const sortedDates = Object.keys(expensesByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    return {
      labels: sortedDates,
      data: sortedDates.map((date) => expensesByDate[date]),
    };
  }

  /**
   * @brief Processes expenses by category for pie/doughnut charts
   * @description Groups expenses by category and calculates totals per category
   * @param {Expense[]} expenses - Array of expense objects
   * @returns {Object} Object containing category labels and data arrays
   */
  static getExpensesByCategory(expenses: Expense[]) {
    const expensesByCategory: { [key: string]: number } = {};

    expenses.forEach((expense) => {
      expensesByCategory[expense.category] =
        (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    return {
      labels: Object.keys(expensesByCategory),
      data: Object.values(expensesByCategory),
    };
  }
}

/**
 * @brief Chart configuration class for styling and data formatting
 * @description Provides static methods and constants for chart appearance and behavior
 */
export class ChartConfiguration {
  static readonly chartColors = {
    primary: 'rgba(99, 102, 241, 1)',
    primaryBg: 'rgba(99, 102, 241, 0.2)',
    categoryColors: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
    ],
    categoryBorders: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 205, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ],
  };

  /**
   * @brief Creates chart data configuration for time-series charts
   * @description Formats date-based data for line and bar charts
   * @param {Object} dateData - Object containing labels and data arrays
   * @returns {Object} Chart.js compatible data configuration
   */
  static getTimeSeriesChartData(dateData: { labels: string[]; data: number[] }) {
    return {
      labels: dateData.labels,
      datasets: [
        {
          label: 'Daily Expenses',
          data: dateData.data,
          borderColor: this.chartColors.primary,
          backgroundColor: this.chartColors.primaryBg,
          tension: 0.1,
        },
      ],
    };
  }

  /**
   * @brief Creates chart data configuration for category-based pie/doughnut charts
   * @description Formats category data with multiple colors for visual distinction
   * @param {Object} categoryData - Object containing labels and data arrays
   * @returns {Object} Chart.js compatible data configuration
   */
  static getCategoryChartData(categoryData: { labels: string[]; data: number[] }) {
    return {
      labels: categoryData.labels,
      datasets: [
        {
          label: 'Expenses by Category',
          data: categoryData.data,
          backgroundColor: this.chartColors.categoryColors,
          borderColor: this.chartColors.categoryBorders,
          borderWidth: 2,
        },
      ],
    };
  }

  /**
   * @brief Creates chart data configuration for category bar charts
   * @description Formats category data for vertical bar chart display
   * @param {Object} categoryData - Object containing labels and data arrays
   * @returns {Object} Chart.js compatible data configuration
   */
  static getCategoryBarChartData(categoryData: { labels: string[]; data: number[] }) {
    return {
      labels: categoryData.labels,
      datasets: [
        {
          label: 'Total by Category',
          data: categoryData.data,
          backgroundColor: this.chartColors.categoryColors,
          borderColor: this.chartColors.categoryBorders,
          borderWidth: 1,
        },
      ],
    };
  }

  /**
   * @brief Creates chart options configuration based on chart type
   * @description Provides responsive design, styling, and interaction options
   * @param {ChartType} chartType - The type of chart being configured
   * @returns {Object} Chart.js compatible options configuration
   */
  static getChartOptions(chartType: ChartType) {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#ffffff',
            font: {
              size: 12,
            },
          },
        },
        title: {
          display: true,
          text:
            chartType === 'doughnut' || chartType === 'pie'
              ? 'Expenses by Category'
              : chartType === 'category-bar'
              ? 'Total by Category'
              : 'Expenses Over Time',
          color: '#ffffff',
          font: {
            size: 16,
            weight: 'bold' as const,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
        },
      },
      scales:
        chartType !== 'doughnut' && chartType !== 'pie'
          ? {
              x: {
                ticks: {
                  color: '#ffffff',
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#ffffff',
                  callback: function (value: any) {
                    return '€' + value.toFixed(2);
                  },
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
              },
            }
          : undefined,
    };
  }
}
