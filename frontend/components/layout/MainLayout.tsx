"use client";

import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { gsap } from "gsap";

interface MainLayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

export function MainLayout({ children, isAuthenticated, userName, onLogout }: MainLayoutProps) {
  useEffect(() => {
    gsap.set("main", { opacity: 1 });
    return () => {
      gsap.killTweensOf("main");
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAuthenticated={isAuthenticated} userName={userName} onLogout={onLogout} />
      <main className="main flex-1 pt-[var(--header-height)]" id="main-content" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}