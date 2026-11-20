"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { LoginInput, ProfileUpdateInput, RegisterInput } from "@/schemas/auth";
import type { SessionResponse } from "../types";
import { createLocalAuth, LOCAL_AUTH_STORAGE_KEY, LocalAuthError } from "../local-auth";

interface AuthContextValue {
  session: SessionResponse | undefined;
  isReady: boolean;
  login: (input: LoginInput) => Promise<SessionResponse>;
  register: (input: RegisterInput) => Promise<SessionResponse>;
  updateProfile: (input: ProfileUpdateInput) => Promise<SessionResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getLocalAuth() {
  try {
    return createLocalAuth(window.localStorage);
  } catch {
    throw new LocalAuthError("storage_unavailable");
  }
}

function reportAuthError(error: unknown) {
  console.error("Local authentication failed:", error);
  toast.error(error instanceof Error ? error.message : "Local authentication failed. Please try again.");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionResponse>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreSession = () => {
      try {
        setSession(getLocalAuth().readSession());
      } catch (error) {
        setSession({ authenticated: false });
        reportAuthError(error);
      } finally {
        setIsReady(true);
      }
    };

    const syncOtherTabs = (event: StorageEvent) => {
      if (event.key !== null && event.key !== LOCAL_AUTH_STORAGE_KEY) return;
      restoreSession();
    };

    restoreSession();
    window.addEventListener("storage", syncOtherTabs);
    return () => window.removeEventListener("storage", syncOtherTabs);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const user = await getLocalAuth().login(input);
    const nextSession: SessionResponse = { authenticated: true, localOnly: true, user };
    setSession(nextSession);
    return nextSession;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const user = await getLocalAuth().register(input);
    const nextSession: SessionResponse = { authenticated: true, localOnly: true, user };
    setSession(nextSession);
    return nextSession;
  }, []);

  const updateProfile = useCallback(async (input: ProfileUpdateInput) => {
    if (!session?.localOnly || !session.user?._id) {
      throw new Error("Profile updates are only available for local accounts.");
    }
    const user = getLocalAuth().updateProfile(session.user._id, input);
    const nextSession: SessionResponse = { ...session, user };
    setSession(nextSession);
    return nextSession;
  }, [session]);

  const logout = useCallback(async () => {
    getLocalAuth().logout();
    setSession({ authenticated: false });
  }, []);

  const value = useMemo(
    () => ({ session, isReady, login, register, updateProfile, logout }),
    [session, isReady, login, register, updateProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}
