"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { AlertCircle, ChevronLeft, ExternalLink, Loader2 } from "lucide-react";
import { api, CONFIG, Recommendation, Source, Course, CalificacionRequest, CalificacionResponse } from "@/lib/api/service";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const consultaId = parseInt(id || "0", 10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [sources, setSources] = useState<(Source & { curso?: Course })[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [existingRating, setExistingRating] = useState<CalificacionResponse | null>(null);

  const recommendationRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!consultaId) return;

    const fetchData = async () => {
      try {
        const consulta = await api.getConsulta(consultaId);
        setQuestion(consulta.pregunta);

        try {
          const rec = await api.getRecomendacionByConsulta(consultaId);
          setRecommendation(rec);

          // Fetch calification using idRecomendacion (not consultaId)
          try {
            const calif = await api.getCalificacion(rec.idRecomendacion);
            setExistingRating(calif);
            setRating(calif.calificacion);
            setComment(calif.comentario || "");
          } catch {
            // No rating yet
          }

          try {
            const fuentes = await api.getFuentesByRecomendacion(rec.idRecomendacion);
            const fuentesConCurso = await Promise.all(
              fuentes.map(async (f) => {
                try {
                  const curso = await api.getCurso(f.idCurso);
                  return { ...f, curso };
                } catch {
                  return f;
                }
              })
            );
            setSources(fuentesConCurso);
          } catch {
            setSources([]);
          }
        } catch {
          // No recommendation yet
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar resultado");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultaId]);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        if (recommendationRef.current) {
          tl.fromTo(
            recommendationRef.current.querySelectorAll(".animate-in"),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
          );
        }

        if (sourcesRef.current) {
          tl.fromTo(
            sourcesRef.current.querySelectorAll(".source-card"),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sourcesRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
            "-=0.3"
          );
        }

        if (ratingRef.current) {
          tl.fromTo(
            ratingRef.current.querySelectorAll(".animate-in"),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ratingRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
            "-=0.3"
          );
        }

        // Animate similarity bars
        (gsap.utils.toArray(".similarity-bar__fill") as HTMLElement[]).forEach((bar) => {
          const width = bar.style.getPropertyValue("--width") || bar.dataset.width || "0%";
          gsap.fromTo(
            bar,
            { width: 0 },
            {
              width,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bar,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        return () => {
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
      }, [recommendationRef, sourcesRef, ratingRef]);

      return () => ctx.revert();
    }
  }, [loading, recommendation, sources]);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recommendation || !rating) return;

    setSubmittingRating(true);
    setRatingError("");
    setRatingSuccess(false);

    try {
      const data: CalificacionRequest = {
        idRecomendacion: recommendation.idRecomendacion,
        calificacion: rating,
        comentario: comment.trim() || undefined,
      };

      if (existingRating) {
        await api.put(`${CONFIG.ENDPOINTS.CALIFICACIONES}/${recommendation.idRecomendacion}`, data);
      } else {
        await api.createCalificacion(data);
      }

      setRatingSuccess(true);
      setExistingRating({ ...data, idRecomendacion: recommendation.idRecomendacion, recomendacion: recommendation, fecha: new Date().toISOString() } as CalificacionResponse);

      setTimeout(() => setRatingSuccess(false), 3000);
    } catch (err) {
      setRatingError(err instanceof Error ? err.message : "Error al enviar calificación");
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    setSources([]);
  };

  const handleNewQuery = () => {
    router.push("/query");
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="result-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Resultado de tu Consulta</h1>
          </header>
          <div className="loading-state" role="status" aria-label="Analizando consulta">
            <div className="spinner" style={{ width: "3rem", height: "3rem", borderWidth: "3px" }} aria-hidden="true" />
            <h3>Analizando tu consulta...</h3>
            <p>Nuestro sistema está buscando las mejores recomendaciones para ti</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Resultado de tu Consulta</h1>
          </header>
          <div className="alert alert--error" role="alert">
            <div className="alert__icon" aria-hidden="true">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="alert__content">
              <div className="alert__title">Error</div>
              <div className="alert__message">{error}</div>
            </div>
            <button className="btn btn--secondary" onClick={handleRetry}>Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="result-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Resultado de tu Consulta</h1>
            <p className="page-subtitle" id="resultQuestion">{question}</p>
          </header>
          <div className="empty-state" role="status">
            <div className="empty-state__icon" aria-hidden="true">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="empty-state__title">No se encontraron resultados</h3>
            <p className="empty-state__message">Intenta reformular tu consulta con más detalles o diferentes palabras clave</p>
            <button className="btn btn--primary" onClick={handleNewQuery}>Nueva consulta</button>
          </div>
        </div>
      </div>
    );
  }

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((paragraph, i) => (
      <p key={i} className="whitespace-pre-wrap">
        {paragraph.split("**").map((part, j) => (
          j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
        ))}
      </p>
    ));
  };

  return (
    <div className="result-page">
      <div className="container">
        <header className="page-header">
          <button onClick={goBack} className="btn btn--ghost btn--sm mb-4 flex items-center gap-1" aria-label="Volver">
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Volver
          </button>
          <h1 className="page-title">Resultado de tu Consulta</h1>
          <p className="page-subtitle" id="resultQuestion">{question}</p>
        </header>

        <section ref={recommendationRef} className="recommendation-section card animate-in" style={{ marginBottom: "1.5rem" }} aria-labelledby="rec-title">
          <div className="card__header" style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)", color: "var(--color-text-inverse)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 id="rec-title" className="recommendation-title" style={{ color: "var(--color-text-inverse)" }}>Recomendación Principal</h2>
                <p className="recommendation-meta" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>Basado en tu consulta y perfil</p>
              </div>
              <span className="badge badge--success" style={{ background: "rgba(255,255,255,0.2)", color: "var(--color-text-inverse)" }}>IA</span>
            </div>
          </div>
          <div className="card__body">
            <div id="recommendationContent" className="recommendation-content">
              {renderMarkdown(recommendation.contenido)}
            </div>
          </div>
        </section>

        {sources.length > 0 && (
          <section ref={sourcesRef} className="sources-section card animate-in" aria-labelledby="sources-title">
            <div className="card__header">
              <h2 id="sources-title" className="card__title">Fuentes Utilizadas</h2>
              <p className="card__subtitle">Cursos que sirvieron de base para la recomendación, ordenados por similitud</p>
            </div>
            <div className="card__body">
              <div id="sourcesList" className="sources-list" role="list">
                {sources.map((source) => (
                  <article key={source.idFuente} className="source-card" role="listitem">
                    <div className="source-card__header">
                      <div className="source-card__info">
                        <h3 className="source-card__title">{source.curso?.nombre || `Curso #${source.idCurso}`}</h3>
                        <div className="source-card__meta">
                          {source.curso && (
                            <>
                              <span className="badge badge--neutral">{source.curso.categoria?.nombre}</span>
                              <span className={`badge badge--${source.curso.dificultad}`}>
                                {source.curso.dificultad.charAt(0) + source.curso.dificultad.slice(1).toLowerCase()}
                              </span>
                              <span>{source.curso.duracion}h</span>
                              <span>{source.curso.activo ? "Activo" : "Inactivo"}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="source-card__similarity">
                        <div className="similarity-bar" role="img" aria-label={`Similitud ${Math.round(source.similitud * 100)}%`}>
                          <div
                            className="similarity-bar__fill"
                            style={{ width: "0%" }}
                            data-width={`${Math.round(source.similitud * 100)}%`}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="similarity-value">{Math.round(source.similitud * 100)}%</span>
                      </div>
                    </div>
                    {source.curso && (
                      <>
                        <p className="source-card__description">{source.curso.descripcion}</p>
                        <div className="source-card__tags">
                          <a
                            href={source.curso.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--ghost btn--sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            Ver curso
                          </a>
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section ref={ratingRef} className="rating-section card animate-in" style={{ marginTop: "1.5rem" }} aria-labelledby="rating-title">
          <div className="card__header">
            <h2 id="rating-title" className="card__title">¿Te fue útil esta recomendación?</h2>
            <p className="card__subtitle">Tu valoración ayuda a mejorar futuras recomendaciones</p>
          </div>
          <div className="card__body">
            {existingRating ? (
              <div className="rating-display" role="status" aria-live="polite">
                <div className="rating-stars" aria-label={`Calificación: ${existingRating.calificacion} de 5 estrellas`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < (existingRating.calificacion || 0) ? "filled" : "empty"} aria-hidden="true">★</span>
                  ))}
                </div>
                {existingRating.comentario && (
                  <div className="rating-comment">
                    <p>&ldquo;{existingRating.comentario}&rdquo;</p>
                  </div>
                )}
                <p className="text-[var(--color-text-muted)] text-sm">Gracias por tu calificación. Ya has valorado esta recomendación.</p>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} noValidate>
                <fieldset className="mb-4" aria-label="Calificación de 1 a 5 estrellas">
                  <legend className="sr-only">Calificación</legend>
                  <div className="star-rating star-rating--lg" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <label key={i} className="cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={5 - i}
                          checked={rating === 5 - i}
                          onChange={() => setRating(5 - i)}
                          className="sr-only"
                          aria-label={`${5 - i} estrellas`}
                        />
                        <span className={rating !== null && rating >= 5 - i ? "filled" : "empty"} aria-hidden="true">★</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="form-group mb-4">
                  <label className="form-label" htmlFor="ratingComment">Comentario (opcional)</label>
                  <textarea
                    id="ratingComment"
                    className="form-textarea"
                    rows={3}
                    placeholder="¿Qué te gustó o qué mejorarías?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn--primary w-full"
                  disabled={!rating || submittingRating}
                >
                  <span className="btn-text flex items-center justify-center gap-2">
                    {submittingRating && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                    {submittingRating ? "Enviando..." : "Enviar calificación"}
                  </span>
                </button>

                {ratingError && (
                  <p className="form-error visible mt-2" role="alert">{ratingError}</p>
                )}

                {ratingSuccess && (
                  <p className="form-help mt-2 text-[var(--color-success)]" role="status">
                    ¡Gracias! Tu calificación ha sido enviada correctamente.
                  </p>
                )}
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}