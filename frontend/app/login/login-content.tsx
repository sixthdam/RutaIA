"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Mail, Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = formRef.current?.querySelectorAll(".form-group, .auth-footer, .submit-btn");
      if (elements && elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
      }
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/catalog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <button onClick={() => router.back()} className="btn btn--ghost btn--sm mb-4 flex items-center gap-1" aria-label="Volver">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Volver
            </button>
            <h1 className="auth-title">Iniciar Sesión</h1>
            <p className="auth-subtitle">Accede a tu cuenta para continuar</p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="auth-form" noValidate>
            {error && (
              <div className="alert alert--error" role="alert">
                <div className="alert__icon" aria-hidden="true"><AlertCircle className="w-5 h-5" /></div>
                <div className="alert__content">
                  <div className="alert__message">{error}</div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo electrónico <span className="required" aria-hidden="true">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input pl-10"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña <span className="required" aria-hidden="true">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full btn--lg submit-btn flex items-center justify-center gap-2"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              <span className="btn-text flex items-center gap-2">
                Iniciar Sesión
              </span>
              {isSubmitting && (
                <span className="btn-loading flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  Iniciando...
                </span>
              )}
            </button>
          </form>

          <p className="auth-footer">
            ¿No tienes cuenta? <Link href="/register" className="font-medium">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}