'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { setTokenCookie, getTokenCookie, removeTokenCookie } from './cookie-utils';

/**
 * ユーザー情報の型定義
 */
interface User {
  id: number;
  name: string;
  email: string;
  profileImgPath?: string | null;
}

/**
 * 認証コンテキストで提供する値の型定義
 */
interface AuthContextType {
  user: User | null; // ログイン中のユーザー情報
  isLoading: boolean; // 認証状態の読み込み中フラグ
  isAuthenticated: boolean; // ログイン済みかどうか
  accessToken: string | null; // アクセストークン
  login: (provider: 'google' | 'github') => void; // ログイン処理
  setAccessToken: (token: string | null) => void; // トークン設定
  getAccessToken: () => string | null; // トークン取得
}

/**
 * 認証コンテキストを作成
 * TODO：サーバーコンポーネントから認証情報にアクセスする場合は別途実装が必要そう？
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * 認証状態を管理し、子コンポーネントに提供するプロバイダー
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // ユーザー情報
  const [user, setUser] = useState<User | null>(null);
  // アクセストークン
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  // 認証状態の読み込み中フラグ
  const [isLoading, setIsLoading] = useState(true);

  /**
   * アクセストークンを設定し、Cookieにも保存する
   * tokenがnullの場合はCookieから削除
   */
  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      setTokenCookie(token);
    } else {
      removeTokenCookie();
    }
  }, []);

  /**
   * アクセストークンを取得
   */
  const getAccessToken = useCallback(() => {
    return accessToken || getTokenCookie();
  }, [accessToken]);

  /**
   * アクセストークンを使ってユーザー情報を取得
   * 成功したらtrue、失敗したらfalseを返す
   */
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
      console.error('ユーザー情報の取得に失敗しました:', error);
      return false;
    }
  }, []);

  /**
   * リフレッシュトークンを使って新しいアクセストークンを取得
   * 成功したら新しいトークンを返し、失敗したらnullを返す
   */
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
      console.error('トークンのリフレッシュに失敗しました:', error);
      return null;
    }
  }, [setAccessToken]);

  /**
   * アプリ起動時に認証状態を初期化
   */
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      // Cookieからトークンを取得
      const storedToken = getTokenCookie();

      if (storedToken) {
        // Cookieにトークンがある場合
        setAccessTokenState(storedToken);
        const success = await fetchCurrentUser(storedToken);

        if (!success) {
          // トークンが期限切れの場合、リフレッシュを試行
          const newToken = await refreshAccessToken();
          if (newToken) {
            await fetchCurrentUser(newToken);
          } else {
            // リフレッシュも失敗した場合、認証状態をクリア
            setAccessToken(null);
            setUser(null);
          }
        }
      } else {
        // Cookieにトークンがない場合
        // リフレッシュトークンがあれば復元を試行
        const newToken = await refreshAccessToken();
        if (newToken) {
          await fetchCurrentUser(newToken);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [fetchCurrentUser, refreshAccessToken, setAccessToken]);

  /**
   * OAuth認証を開始
   * バックエンドの認証エンドポイントにリダイレクト
   */
  const login = useCallback((provider: 'google' | 'github') => {
    window.location.href = `${API_URL}/auth/${provider}`;
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user, // userがあればログイン済みとする
    accessToken,
    login,
    setAccessToken,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 認証コンテキストを使用するためのhook
 * NOTE：AuthProvider内で使用する
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthはAuthProvider内で使用してください');
  }
  return context;
}
