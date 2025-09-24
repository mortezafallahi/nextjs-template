import type { UserProfile } from '@/types';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { api } from '@/api';

interface AuthState {
  // States
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  lastChecked: number | null;
  token: string | null;

  // Actions
  initialize: () => Promise<void>;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isPendingProfile: () => boolean;
}

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME || 'token';
const CHECK_INTERVAL = 5 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial states
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isInitialized: false,
        lastChecked: null,
        token: null,

        // Actions
        initialize: async () => {
          const { lastChecked } = get();
          const now = Date.now();

          if (lastChecked && now - lastChecked < CHECK_INTERVAL) {
            set({ isLoading: false, isInitialized: true });
            return;
          }

          const token = Cookies.get(TOKEN_NAME);

          if (!token) {
            set(
              {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true,
                lastChecked: now,
              },
              false,
              'initialize:noToken'
            );
            return;
          }

          try {
            set({ isLoading: true }, false, 'initialize:start');

            const response = await api.auth.getMe();

            if (response.status && response.data) {
              set(
                {
                  user: response.data.user,
                  isAuthenticated: true,
                  isLoading: false,
                  isInitialized: true,
                  lastChecked: now,
                },
                false,
                'initialize:success'
              );
            } else {
              throw new Error('Failed to get user data');
            }
          } catch (error) {
            console.error('Auth initialization failed:', error);
            Cookies.remove(TOKEN_NAME);
            set(
              {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true,
                lastChecked: now,
              },
              false,
              'initialize:failed'
            );
          }
        },

        setToken: (token: string) => {
          Cookies.set(TOKEN_NAME, token, {
            expires: 7,
            secure:
              process.env.NODE_ENV === 'production' &&
              !window.location.hostname.includes('localhost'),
            sameSite: 'lax',
            path: '/',
          });
          set({ token, isAuthenticated: true });
        },

        setUser: (user: UserProfile) => {
          set({ user });
        },

        // Logout
        logout: () => {
          Cookies.remove(TOKEN_NAME);
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
              lastChecked: null,
              token: null,
            },
            false,
            'logout'
          );
          // Clear localStorage
          localStorage.removeItem('auth-storage');
        },

        // Refresh user data from API
        refreshUser: async () => {
          try {
            const response = await api.auth.getMe();
            if (response.status && response.data) {
              set({ user: response.data.user });
            }
          } catch (error) {
            console.error('Failed to refresh user:', error);
          }
        },

        // Check if profile is pending
        isPendingProfile: () => {
          return get().user?.status?.key === 'PENDING';
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          lastChecked: state.lastChecked,
          token: state.token,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);
