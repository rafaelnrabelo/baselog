import axios from "axios";
import { useRouter } from "next/router";
import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoleType;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

export enum UserRoleType {
  User = "USER",
  Admin = "ADMIN",
}

interface SignInReturn {
  id: string;
  accessToken: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoleType;
}

interface AuthContextData {
  user: User;
  token: string;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  authLoading: boolean;
  isAdmin: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  async function loadStorageData(): Promise<void> {
    const token = localStorage.getItem("@BaseLog:token");
    if (token) {
      const user = await getMe(token);
      setData({ token: token, user: user });
    }
    setAuthLoading(false);
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  const getMe = async (token: string) => {
    console.log(process.env.NEXT_PUBLIC_BASE_URL);
    const response = await axios.get<SignInReturn>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { firstName, lastName, email, role, id } = response.data;
    const userData: User = {
      firstName,
      lastName,
      role,
      email,
      id,
    };

    return userData;
  };

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    try {
      setAuthLoading(true);
      const response = await axios.post<SignInReturn>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      const { accessToken } = response.data;

      localStorage.setItem("@BaseLog:token", accessToken);
      loadStorageData();

      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await loadStorageData();
      if (data.token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`,
          null,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );
      }
      localStorage.removeItem("@BaseLog:token");
      setData({} as AuthState);
      router.replace("/");
    } catch (error) {
      localStorage.removeItem("@BaseLog:token");
      setData({} as AuthState);
      router.replace("/");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        signIn,
        signOut,
        authLoading,
        isAdmin: data?.user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
