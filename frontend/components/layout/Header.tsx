"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { LogOut, User, BookOpen, Search, History, BarChart2 } from "lucide-react";


interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

const navItems = [
  { href: "/catalog", label: "Catálogo", icon: BookOpen },
  { href: "/query", label: "Consulta", icon: Search },
  { href: "/history", label: "Historial", icon: History },
  { href: "/stats", label: "Estadísticas", icon: BarChart2 },
];

export function Header({ isAuthenticated, userName, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const navLinks = Array.from(document.querySelectorAll(".nav__link[data-nav]") || []);
    if (navLinks.length > 0) {
      gsap.fromTo(
        navLinks,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }

    const logo = document.querySelector(".nav__logo") as HTMLElement | null;
    if (logo) {
      gsap.fromTo(
        logo,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
      );
    }

    return () => {
      if (navLinks.length > 0) gsap.killTweensOf(navLinks);
      if (logo) gsap.killTweensOf(logo);
    };
  }, [isAuthenticated]);

  // Mobile menu GSAP animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const ctx = gsap.context(() => {
      const links = Array.from(mobileMenuRef.current?.querySelectorAll(".mobile-nav__link") || []);
      const overlay = mobileMenuRef.current?.querySelector(".mobile-nav__overlay") as HTMLElement | null;

      if (isMenuOpen) {
        // Open animation
        gsap.set(mobileMenuRef.current, { display: "block" });
        
        const tl = gsap.timeline();
        if (overlay) {
          tl.fromTo(
            overlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        }
        if (links.length > 0) {
          tl.fromTo(
            links,
            { opacity: 0, x: -30, scale: 0.95 },
            { 
              opacity: 1, 
              x: 0, 
              scale: 1,
              duration: 0.4, 
              stagger: 0.08, 
              ease: "power3.out" 
            },
            "-=0.15"
          );
        }
      } else {
        // Close animation
        const tl = gsap.timeline();
        if (links.length > 0) {
          tl.to(
            links,
            { opacity: 0, x: 30, scale: 0.95, duration: 0.25, stagger: 0.05, ease: "power2.in" }
          );
        }
        if (overlay) {
          tl.to(
            overlay,
            { opacity: 0, duration: 0.2, ease: "power2.in" },
            "-=0.1"
          );
        }
        tl.set(mobileMenuRef.current, { display: "none" });
      }
    }, mobileMenuRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  return (
    <header
      className={`header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)]" : "bg-transparent"
      }`}
      style={{ height: "var(--header-height)" }}
      role="banner"
    >
      <nav className="nav container" style={{ height: "100%" }} aria-label="Navegación principal">
        <Link
          href="/"
          className="nav__logo flex items-center gap-2 font-serif text-xl font-bold"
          style={{ color: "var(--color-primary)" }}
          aria-label="RutaIA - Inicio"
          data-nav
        >
          <span style={{ fontSize: "1.5rem" }}>RutaIA</span>
        </Link>

        <ul className="nav__menu hidden md:flex items-center gap-1" id="navMenu" role="menubar">
          {navItems.map((item) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                className={`nav__link flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                }`}
                role="menuitem"
                data-nav
              >
                <item.icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          {isAuthenticated ? (
            <>
              <li role="none">
                <Link
                  href="/profile"
                  className="nav__link flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all duration-200"
                  role="menuitem"
                  data-nav
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span>{userName || "Perfil"}</span>
                </Link>
              </li>
              <li role="none">
                <button
                  onClick={onLogout}
                  className="nav__link flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-[var(--color-error)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] transition-all duration-200"
                  role="menuitem"
                  data-nav
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Cerrar Sesión</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li role="none">
                <Link
                  href="/login"
                  className="nav__link px-4 py-2 rounded-lg font-medium text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all duration-200"
                  role="menuitem"
                  data-nav
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li role="none">
                <Link
                  href="/register"
                  className="nav__link px-4 py-2 rounded-lg font-medium text-sm bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-dark)] shadow-sm transition-all duration-200"
                  role="menuitem"
                  data-nav
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          className="nav__toggle md:hidden flex flex-col justify-center gap-1.5 p-2 rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors"
          id="navToggle"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="navMenu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            className={`block w-6 h-0.5 rounded bg-[var(--color-text)] transition-all duration-300 ease-out ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
            aria-hidden="true"
          />
          <span
            className={`block w-6 h-0.5 rounded bg-[var(--color-text)] transition-all duration-300 ease-out ${
              isMenuOpen ? "opacity-0" : ""
            }`}
            aria-hidden="true"
          />
          <span
            className={`block w-6 h-0.5 rounded bg-[var(--color-text)] transition-all duration-300 ease-out ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </nav>

      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed top-[var(--header-height)] left-0 right-0 bottom-0 z-40"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div 
            className="mobile-nav__overlay fixed inset-0 bg-black/30"
            aria-hidden="true"
          />
          <div className="relative fixed inset-0 right-0 w-full max-w-sm bg-[var(--color-bg)] border-l border-[var(--color-border)] p-6 overflow-y-auto">
            <ul className="flex flex-col gap-2" role="menubar">
{navItems.map((item) => (
                <li key={item.href} role="none">
                  <Link
                    href={item.href}
                    className={`mobile-nav__link nav__link flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition-all duration-200 ${
                      pathname === item.href
                        ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                    }`}
                    role="menuitem"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              {isAuthenticated ? (
                <>
                  <li role="none">
                    <Link
                      href="/profile"
                      className="mobile-nav__link nav__link flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all duration-200"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" aria-hidden="true" />
                      <span>{userName || "Perfil"}</span>
                    </Link>
                  </li>
                  <li role="none">
                    <button
                      onClick={() => { onLogout(); setIsMenuOpen(false); }}
                      className="mobile-nav__link nav__link flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base text-[var(--color-error)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] transition-all duration-200"
                      role="menuitem"
                    >
                      <LogOut className="w-5 h-5" aria-hidden="true" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li role="none">
                    <Link
                      href="/login"
                      className="mobile-nav__link nav__link px-4 py-3 rounded-lg font-medium text-base text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all duration-200"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/register"
                      className="mobile-nav__link nav__link px-4 py-3 rounded-lg font-medium text-base bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-dark)] shadow-sm transition-all duration-200"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}