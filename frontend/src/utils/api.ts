import { authUtils } from './auth';

const API_BASE_URL = 'http://localhost:8080';

export type Category = 'FOOD' | 'TRAVEL' | 'OFFICE' | 'SHOPPING' | 'INVESTMENTS' | 'OTHER';

export interface User {
  id: number;
  username: string;
}

export interface Expense {
  id: number;
  amount: number;
  note?: string;
  createdAt: string;
  category: Category;
  userId: number;
}

export interface CreateExpenseDto {
  amount: number;
  note?: string;
  category: Category;
  createdAt?: string;
}

export interface UpdateExpenseDto {
  amount?: number;
  note?: string;
  category?: Category;
  createdAt?: string;
}

/**
 * @brief Custom error class for API errors
 * @description Extends Error with HTTP status code information
 */
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * @brief Generic API request function with authentication handling
 * @description Makes HTTP requests with automatic token inclusion and error handling
 * @param {string} endpoint - API endpoint path
 * @param {RequestInit} options - Fetch request options
 * @returns {Promise<T>} Promise that resolves to the response data
 * @throws {ApiError} When request fails or returns error status
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authUtils.getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        authUtils.removeToken();
        window.location.href = '/';
      }
      throw error;
    }
    throw new ApiError(0, 'Network error');
  }
}

/**
 * @brief Authentication API methods
 * @description Provides login and registration functionality
 */
export const authApi = {
  /**
   * @brief Authenticates user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{ access_token: string }>} Promise that resolves to access token
   */
  login: async (username: string, password: string): Promise<{ access_token: string }> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * @brief Registers new user with username and password
   * @param {string} username - New user's username
   * @param {string} password - New user's password
   * @returns {Promise<User>} Promise that resolves to created user object
   */
  register: async (username: string, password: string): Promise<User> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

/**
 * @brief User API methods
 * @description Provides user profile management functionality
 */
export const userApi = {
  /**
   * @brief Retrieves current user's profile information
   * @returns {Promise<User>} Promise that resolves to user profile data
   */
  getProfile: async (): Promise<User> => {
    return apiRequest('/user/me');
  },

  /**
   * @brief Updates current user's profile information
   * @param {Object} profileData - Profile update data including username and/or password
   * @returns {Promise<User>} Promise that resolves to updated user profile data
   */
  updateProfile: async (profileData: {
    username?: string;
    currentPassword?: string;
    password?: string;
  }): Promise<User> => {
    return apiRequest('/user/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

/**
 * @brief Expense API methods
 * @description Provides CRUD operations for expense management
 */
export const expenseApi = {
  /**
   * @brief Retrieves all expenses for the authenticated user
   * @returns {Promise<Expense[]>} Promise that resolves to array of expense objects
   */
  getAll: async (): Promise<Expense[]> => {
    return apiRequest('/expense');
  },

  /**
   * @brief Retrieves a specific expense by ID
   * @param {number} id - Expense ID to retrieve
   * @returns {Promise<Expense>} Promise that resolves to expense object
   */
  getById: async (id: number): Promise<Expense> => {
    return apiRequest(`/expense/${id}`);
  },

  /**
   * @brief Creates a new expense
   * @param {CreateExpenseDto} expense - Expense data to create
   * @returns {Promise<Expense>} Promise that resolves to created expense object
   */
  create: async (expense: CreateExpenseDto): Promise<Expense> => {
    return apiRequest('/expense', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },

  /**
   * @brief Updates an existing expense
   * @param {number} id - Expense ID to update
   * @param {UpdateExpenseDto} expense - Updated expense data
   * @returns {Promise<Expense>} Promise that resolves to updated expense object
   */
  update: async (id: number, expense: UpdateExpenseDto): Promise<Expense> => {
    const result = await apiRequest<Expense>(`/expense/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
    return result;
  },

  /**
   * @brief Deletes an expense
   * @param {number} id - Expense ID to delete
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   */
  delete: async (id: number): Promise<void> => {
    return apiRequest(`/expense/${id}`, {
      method: 'DELETE',
    });
  },
};
