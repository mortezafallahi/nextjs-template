'use client';

import { useAuthStore } from '@/store/auth-store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { initialize, isInitialized, isLoading, isAuthenticated, user } =
    useAuthStore(
      useShallow((state) => ({
        initialize: state.initialize,
        isInitialized: state.isInitialized,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }))
    );

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle routing
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const isPendingProfile = user?.status?.key === 'PENDING';
    const isLoginPage = pathname === '/app/login';
    const isConfirmPage = pathname === '/app/login/confirm';
    const isAppRoute = pathname.startsWith('/app');

    // Not authenticated and trying to access protected route
    if (!isAuthenticated && isAppRoute && !isLoginPage && !isConfirmPage) {
      router.replace(`/app/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Authenticated with pending profile - send to confirm page
    if (isAuthenticated && isPendingProfile && !isConfirmPage) {
      router.replace('/app/login/confirm');
      return;
    }

    // Authenticated with complete profile on login or confirm page
    if (
      isAuthenticated &&
      !isPendingProfile &&
      (isLoginPage || isConfirmPage)
    ) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect') || '/app';
      router.replace(redirectUrl);
      return;
    }
  }, [isInitialized, isLoading, pathname, router, isAuthenticated, user]);

  // Show loading while initialization or routing check
  if (isLoading || !isInitialized) {
    return (
      <div className="bg-background relative flex h-screen w-full flex-col items-center justify-center overflow-hidden p-4">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
