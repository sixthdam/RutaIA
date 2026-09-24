"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api/service";
import { useAuth } from "@/lib/auth/AuthContext";

const exampleQueries = [
  "Quiero aprender Python para análisis de datos desde nivel principiante",
  "Busco cursos de React avanzado con TypeScript y testing",
  "Necesito un curso de machine learning con TensorFlow, nivel intermedio",
  "Quiero aprender desarrollo backend con Node.js y bases de datos",
  "Busco cursos de diseño UX/UI para principiantes",
];

export default function QueryPage() {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { getUserId } = useAuth();

  useEffect(() => {
    const { ScrollTrigger } = require("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = formRef.current?.querySelectorAll(".form-group, .query-examples, .submit-btn");
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
    if (!question.trim()) {
      setError("Por favor escribe tu consulta");
      return;
    }
    if (question.trim().length < 10) {
      setError("La consulta debe tener al menos 10 caracteres");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("Usuario no autenticado");
      }
      const response = await api.createConsulta({ 
        pregunta: question.trim(),
        idUsuario: userId,
      });
      router.push(`/result/${response.idConsulta}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la consulta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExample = (example: string) => {
    setQuestion(example);
    textareaRef.current?.focus();
  };

  return (
    <div className="query-page">
      <div className="container">
        <header className="page-header text-center">
          <h1 className="page-title">Consulta Inteligente</h1>
          <p className="page-subtitle mx-auto">Describe qué quieres aprender y te recomendaremos los mejores cursos</p>
        </header>

        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="card__body">
            <form ref={formRef} onSubmit={handleSubmit} className="query-form" noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="pregunta">
                  ¿Qué te gustaría aprender? <span className="required" aria-hidden="true">*</span>
                </label>
                <textarea
                  ref={textareaRef}
                  id="pregunta"
                  name="pregunta"
                  className="form-input form-textarea"
                  placeholder="Ej: Quiero aprender machine learning desde cero, ¿qué cursos me recomiendan?"
                  rows={4}
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  aria-describedby="preguntaHelp preguntaError"
                />
                <div className="form-help" id="preguntaHelp">
                  Sé específico: menciona tu nivel, objetivos, tecnologías de interés...
                </div>
                {error && (
                  <div className="form-error visible" id="preguntaError" role="alert">
                    {error}
                  </div>
                )}
              </div>

              <div className="query-examples" role="group" aria-label="Ejemplos de consultas">
                <span className="query-examples__label">Ejemplos:</span>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      className="query-example"
                      onClick={() => handleExample(ex)}
                      aria-label={`Usar ejemplo: ${ex}`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full btn--lg submit-btn flex items-center justify-center gap-2"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                <span className="btn-text flex items-center gap-2">
                  <Search className="w-5 h-5" aria-hidden="true" />
                  Buscar recomendaciones
                </span>
                {isSubmitting && (
                  <span className="btn-loading flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    Analizando tu consulta...
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        <section className="mt-12" aria-labelledby="how-it-works-title">
          <div className="grid grid--3 gap-6">
            <article className="card text-center p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(26, 26, 46, 0.1)", color: "var(--color-primary)" }}>
                <Sparkles className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 id="how-it-works-title" className="card__title">Análisis IA</h3>
              <p className="text-[var(--color-text-secondary)]">Nuestro modelo analiza tu consulta en lenguaje natural</p>
            </article>
            <article className="card text-center p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(26, 26, 46, 0.1)", color: "var(--color-primary)" }}>
                <Search className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="card__title">Búsqueda semántica</h3>
              <p className="text-[var(--color-text-secondary)]">Encuentra cursos relevantes usando embeddings vectoriales</p>
            </article>
            <article className="card text-center p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(26, 26, 46, 0.1)", color: "var(--color-primary)" }}>
                <ArrowRight className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="card__title">Recomendación personalizada</h3>
              <p className="text-[var(--color-text-secondary)]">Recibe resultados adaptados a tu perfil y experiencia</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}