'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  profileImgPath?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (provider: 'google' | 'github') => void;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'accessToken';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const getAccessToken = useCallback(() => {
    return accessToken || localStorage.getItem(TOKEN_KEY);
  }, [accessToken]);

  const fetchCurrentUser = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            query Me {
              me {
                id
                name
                email
                profileImgPath
              }
            }
          `,
        }),
      });

      const data = await response.json();

      if (data.data?.me) {
        setUser(data.data.me);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return false;
    }
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation RefreshToken {
              refreshToken {
                accessToken
              }
            }
          `,
        }),
      });

      const data = await response.json();

      if (data.data?.refreshToken?.accessToken) {
        const newToken = data.data.refreshToken.accessToken;
        setAccessToken(newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }, [setAccessToken]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      // Check for stored token
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (storedToken) {
        setAccessTokenState(storedToken);
        const success = await fetchCurrentUser(storedToken);

        if (!success) {
          // Token expired, try to refresh
          const newToken = await refreshAccessToken();
          if (newToken) {
            await fetchCurrentUser(newToken);
          } else {
            // Refresh failed, clear auth state
            setAccessToken(null);
            setUser(null);
          }
        }
      } else {
        // No token, try to refresh (in case we have a refresh token cookie)
        const newToken = await refreshAccessToken();
        if (newToken) {
          await fetchCurrentUser(newToken);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [fetchCurrentUser, refreshAccessToken, setAccessToken]);

  const login = useCallback((provider: 'google' | 'github') => {
    window.location.href = `${API_URL}/auth/${provider}`;
  }, []);

  const logout = useCallback(async () => {
    const token = getAccessToken();

    if (token) {
      try {
        await fetch(`${API_URL}/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            query: `
              mutation Logout {
                logout
              }
            `,
          }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    setAccessToken(null);
    setUser(null);
  }, [getAccessToken, setAccessToken]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    accessToken,
    login,
    logout,
    setAccessToken,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
