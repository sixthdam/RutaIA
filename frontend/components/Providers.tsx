"use client";

import { ReactNode, useEffect } from "react";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { ErrorBoundary } from "./ErrorBoundary";
import { useRouter } from "next/navigation";
import { onAuthEvent } from "@/lib/auth/events";

function AuthenticatedApp({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout, userName } = useAuth();

  return (
    <MainLayout
      isAuthenticated={isAuthenticated}
      userName={userName || user?.nombre}
      onLogout={logout}
    >
      {children}
    </MainLayout>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthEvent('LOGOUT', () => {
      router.push('/login');
    });
    return unsubscribe;
  }, [router]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthenticatedApp>{children}</AuthenticatedApp>
      </AuthProvider>
    </ErrorBoundary>
  );
}