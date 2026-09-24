"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { ErrorBoundary } from "./ErrorBoundary";

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
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthenticatedApp>{children}</AuthenticatedApp>
      </AuthProvider>
    </ErrorBoundary>
  );
}