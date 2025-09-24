'use client';

import { AppError, ErrorCode } from '@/types/errors';
// import { useAuthStore } from '@/store/auth-store';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';

import React, { useState } from 'react';
import { toast } from 'sonner';

const globalErrorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
        toast.error(error.message || 'توکن شما منقضی شده.');
        // useAuthStore.getState().logout();
        break;

      case ErrorCode.FORBIDDEN:
        window.location.href = '/forbidden';
        break;

      case ErrorCode.VALIDATION_ERROR:
        console.warn('Validation Error: Component should handle this.');
        break;

      case ErrorCode.INTERNAL_SERVER_ERROR:
      case ErrorCode.SERVICE_UNAVAILABLE:

      case ErrorCode.PARSE_ERROR:
      case ErrorCode.NOT_FOUND:
      case ErrorCode.UNKNOWN_ERROR:
      default:
        toast.error(error.message, {
          position: 'top-center',
          duration: 4000,
        });
        break;
    }
  } else if (error instanceof Error) {
    toast.error(error.message, { position: 'top-center' });
  } else {
    toast.error('یک خطای کاملاً ناشناخته رخ داده است', {
      position: 'top-center',
    });
  }
};

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: globalErrorHandler,
        }),

        mutationCache: new MutationCache({
          onError: globalErrorHandler,
        }),

        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
