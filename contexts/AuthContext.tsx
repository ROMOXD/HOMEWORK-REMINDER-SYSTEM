import { getItem, removeItem, setItem, StorageKeys } from "@/lib/storage";
import type { ResetCode, User } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<string | null>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getItem<User | null>(StorageKeys.session, null).then((session) => {
      setUser(session);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return "Please Fill Out All Fields";
    }

    const users = await getItem<User[]>(StorageKeys.users, []);
    const match = users.find(
      (entry) =>
        entry.email.toLowerCase() === email.trim().toLowerCase() &&
        entry.password === password,
    );

    if (!match) {
      return "Incorrect Email or Password";
    }

    await setItem(StorageKeys.session, match);
    setUser(match);
    return null;
  }, []);

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string,
      confirmPassword: string,
    ) => {
      if (!username.trim() || !email.trim() || !password || !confirmPassword) {
        return "Please Fill Out All Fields";
      }

      if (password !== confirmPassword) {
        return "Passwords do not match";
      }

      const users = await getItem<User[]>(StorageKeys.users, []);
      const exists = users.some(
        (entry) => entry.email.toLowerCase() === email.trim().toLowerCase(),
      );

      if (exists) {
        return "An account with this email already exists";
      }

      const newUser: User = {
        id: createId(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      await setItem(StorageKeys.users, [...users, newUser]);
      await setItem(StorageKeys.session, newUser);
      setUser(newUser);
      return null;
    },
    [],
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!email.trim()) {
      return "Please Fill Out All Fields";
    }

    const users = await getItem<User[]>(StorageKeys.users, []);
    const match = users.find(
      (entry) => entry.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!match) {
      return "No account found with this email";
    }

    const code = generateCode();
    const resetCode: ResetCode = {
      email: match.email,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    await setItem(StorageKeys.resetCode, resetCode);
    return code;
  }, []);

  const resetPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      if (!email.trim() || !code.trim() || !newPassword.trim()) {
        return "Please Fill Out All Fields";
      }

      const stored = await getItem<ResetCode | null>(StorageKeys.resetCode, null);

      if (
        !stored ||
        stored.email.toLowerCase() !== email.trim().toLowerCase() ||
        stored.code !== code.trim()
      ) {
        return "Invalid verification code";
      }

      if (Date.now() > stored.expiresAt) {
        return "Verification code has expired";
      }

      const users = await getItem<User[]>(StorageKeys.users, []);
      const updated = users.map((entry) =>
        entry.email.toLowerCase() === email.trim().toLowerCase()
          ? { ...entry, password: newPassword }
          : entry,
      );

      await setItem(StorageKeys.users, updated);
      await removeItem(StorageKeys.resetCode);
      return null;
    },
    [],
  );

  const logout = useCallback(async () => {
    await removeItem(StorageKeys.session);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      requestPasswordReset,
      resetPassword,
      logout,
    }),
    [user, isLoading, login, register, requestPasswordReset, resetPassword, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
