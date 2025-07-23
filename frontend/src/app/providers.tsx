'use client';

import { HeroUIProvider } from '@heroui/system';

/**
 * @brief Application providers wrapper component
 * @description Provides HeroUI context to all child components
 * @param {Object} props - Component props containing children
 * @param {React.ReactNode} props.children - Child components to wrap with providers
 * @returns {JSX.Element} HeroUI provider wrapper
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
