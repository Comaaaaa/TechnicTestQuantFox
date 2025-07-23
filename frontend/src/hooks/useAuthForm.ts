import { useAuthFormLogic, type AuthFormLogic } from './useAuthForm.logic';

/**
 * @brief Authentication form hook
 * @description Provides authentication form state and logic for login and registration
 * @returns {AuthFormLogic} Object containing authentication form state and actions
 */
export function useAuthForm(): AuthFormLogic {
  return useAuthFormLogic();
}
