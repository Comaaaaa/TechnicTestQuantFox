const TOKEN_KEY = 'jwt_token';

/**
 * @brief Authentication utilities for JWT token management
 * @description Provides methods for storing, retrieving, and validating JWT tokens
 */
export const authUtils = {
  /**
   * @brief Stores JWT token in localStorage
   * @param {string} token - The JWT token to store
   */
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * @brief Retrieves JWT token from localStorage
   * @returns {string | null} The stored JWT token or null if not found
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * @brief Removes JWT token from localStorage
   * @description Effectively logs out the user by clearing the token
   */
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * @brief Checks if user is currently authenticated
   * @description Validates JWT token structure and expiration time
   * @returns {boolean} True if user is authenticated with valid token
   */
  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },

  /**
   * @brief Extracts user information from JWT token
   * @description Decodes JWT payload to retrieve user ID and username
   * @returns {Object | null} User info object or null if token is invalid
   */
  getUserInfo: (): { userId: number; username: string } | null => {
    const token = authUtils.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.sub,
        username: payload.username,
      };
    } catch {
      return null;
    }
  },
};
