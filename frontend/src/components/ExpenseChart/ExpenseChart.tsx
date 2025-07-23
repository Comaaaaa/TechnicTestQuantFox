import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { type Expense } from '../../utils/api';
import {
  useChartLogic,
  ChartDataProcessor,
  ChartConfiguration,
  type ChartType,
} from './ExpenseChart.logic';
import styles from './ExpenseChart.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface ExpenseChartProps {
  expenses: Expense[];
}

/**
 * @brief Expense chart component with multiple visualization types
 * @description Displays expense data in various chart formats with interactive controls
 * @param {ExpenseChartProps} props - Component props containing expenses array
 * @returns {JSX.Element} Chart container with controls and visualization
 */
const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const logic = useChartLogic();

  const dateData = ChartDataProcessor.getExpensesByDate(expenses);
  const categoryData = ChartDataProcessor.getExpensesByCategory(expenses);

  const timeSeriesChartData = ChartConfiguration.getTimeSeriesChartData(dateData);
  const categoryChartData = ChartConfiguration.getCategoryChartData(categoryData);
  const categoryBarChartData = ChartConfiguration.getCategoryBarChartData(categoryData);

  const chartOptions = ChartConfiguration.getChartOptions(logic.chartType);

  /**
   * @brief Renders the appropriate chart component based on selected type
   * @description Returns the correct Chart.js component with configured data and options
   * @returns {React.ReactElement} Chart component matching the selected chart type
   */
  const renderChart = (): React.ReactElement => {
    switch (logic.chartType) {
      case 'line':
        return <Line data={timeSeriesChartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={timeSeriesChartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={categoryChartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={categoryChartData} options={chartOptions} />;
      case 'category-bar':
        return <Bar data={categoryBarChartData} options={chartOptions} />;
      default:
        return <Line data={timeSeriesChartData} options={chartOptions} />;
    }
  };

  if (expenses.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <div className={styles.noData}>
          No expenses to display. Add some expenses to see charts!
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2>Expense Analytics</h2>
        <div className={styles.chartControls}>
          <button
            className={`${styles.chartButton} ${logic.chartType === 'line' ? styles.active : ''}`}
            onClick={() => logic.setChartType('line')}
          >
            Line Chart
          </button>
          <button
            className={`${styles.chartButton} ${logic.chartType === 'bar' ? styles.active : ''}`}
            onClick={() => logic.setChartType('bar')}
          >
            Bar Chart
          </button>
          <button
            className={`${styles.chartButton} ${
              logic.chartType === 'category-bar' ? styles.active : ''
            }`}
            onClick={() => logic.setChartType('category-bar')}
          >
            Category Bar
          </button>
          <button
            className={`${styles.chartButton} ${
              logic.chartType === 'doughnut' ? styles.active : ''
            }`}
            onClick={() => logic.setChartType('doughnut')}
          >
            Doughnut
          </button>
          <button
            className={`${styles.chartButton} ${logic.chartType === 'pie' ? styles.active : ''}`}
            onClick={() => logic.setChartType('pie')}
          >
            Pie Chart
          </button>
        </div>
      </div>
      <div className={styles.chartWrapper}>{renderChart()}</div>
    </div>
  );
};

export default ExpenseChart;
