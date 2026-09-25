"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Mail, Lock, User, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { api } from "@/lib/api/service";

interface Experience {
  value: string;
  label: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasenia: "",
    experiencia: "",
    areaInteres: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [experiencias, setExperiencias] = useState<Experience[]>([]);
  const { register } = useAuth();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchExperiencias = async () => {
      try {
        const data = await api.getExperiencias();
        setExperiencias(data.map((e) => ({ value: e, label: e.charAt(0) + e.slice(1).toLowerCase() })));
      } catch {
        // fallback
        setExperiencias([
          { value: "PRINCIPIANTE", label: "Principiante" },
          { value: "INTERMEDIO", label: "Intermedio" },
          { value: "AVANZADO", label: "Avanzado" },
        ]);
      }
    };
    fetchExperiencias();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.nombre || !formData.correo || !formData.contrasenia || !formData.experiencia) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    if (formData.contrasenia.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);
      router.push("/catalog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cuenta");
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
            <h1 className="auth-title">Crear Cuenta</h1>
            <p className="auth-subtitle">Regístrate para recibir recomendaciones personalizadas</p>
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
              <label className="form-label" htmlFor="nombre">Nombre completo <span className="required" aria-hidden="true">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="form-input pl-10"
                  placeholder="Juan Pérez"
                  required
                  autoComplete="name"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="correo">Correo electrónico <span className="required" aria-hidden="true">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  className="form-input pl-10"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  value={formData.correo}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contrasenia">Contraseña <span className="required" aria-hidden="true">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="contrasenia"
                  name="contrasenia"
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  value={formData.contrasenia}
                  onChange={handleChange}
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
              <div className="form-help">Mínimo 8 caracteres</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experiencia">Nivel de experiencia <span className="required" aria-hidden="true">*</span></label>
              <div className="relative">
                <select
                  id="experiencia"
                  name="experiencia"
                  className="form-select"
                  required
                  value={formData.experiencia}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Selecciona tu experiencia</option>
                  {experiencias.map((exp) => (
                    <option key={exp.value} value={exp.value}>
                      {exp.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="areaInteres">Área de interés</label>
              <input
                type="text"
                id="areaInteres"
                name="areaInteres"
                className="form-input"
                placeholder="Ej: Inteligencia Artificial, Desarrollo Web, Data Science..."
                autoComplete="off"
                value={formData.areaInteres}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <div className="form-help">Opcional: ayuda a personalizar tus recomendaciones</div>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full btn--lg submit-btn flex items-center justify-center gap-2"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              <span className="btn-text flex items-center gap-2">
                Crear Cuenta
              </span>
              {isSubmitting && (
                <span className="btn-loading flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  Creando...
                </span>
              )}
            </button>
          </form>

          <p className="auth-footer">
            ¿Ya tienes cuenta? <Link href="/login" className="font-medium">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}