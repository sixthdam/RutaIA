"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { AlertCircle, ChevronLeft, ExternalLink, Clock } from "lucide-react";
import { api, ConsultaResponse, Recommendation, Source, Course, CalificacionResponse } from "@/lib/api/service";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const consultaId = parseInt(id || "0", 10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consulta, setConsulta] = useState<ConsultaResponse | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [sources, setSources] = useState<(Source & { curso?: Course })[]>([]);
  const [rating, setRating] = useState<CalificacionResponse | null>(null);

  const detailRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!consultaId) return;

    const fetchData = async () => {
      try {
        const consultaData = await api.getConsulta(consultaId);
        setConsulta(consultaData);

        try {
          const rec = await api.getRecomendacionByConsulta(consultaId);
          setRecommendation(rec);

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

          try {
            const calif = await api.getCalificacion(rec.idRecomendacion);
            setRating(calif);
          } catch {
            // No rating
          }
        } catch {
          // No recommendation
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar detalle");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultaId]);

  useEffect(() => {
    if (!loading && detailRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.fromTo(
          detailRef.current!.querySelectorAll(".animate-in"),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );

        if (recRef.current) {
          tl.fromTo(
            recRef.current.querySelectorAll(".animate-in"),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
            "-=0.3"
          );
        }

        if (sourcesRef.current) {
          tl.fromTo(
            sourcesRef.current.querySelectorAll(".source-detail-card"),
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
              duration: 0.5,
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
        (gsap.utils.toArray(".similarity-large") as HTMLElement[]).forEach((el) => {
          const width = el.dataset.width || "0%";
          gsap.fromTo(
            el,
            { width: 0 },
            {
              width,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        return () => {
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
      }, [detailRef, recRef, sourcesRef, ratingRef]);

      return () => ctx.revert();
    }
  }, [loading, consulta, recommendation, sources, rating]);

  const goBack = () => {
    router.push("/history");
  };

  const getStatusBadge = (estado: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      RESPONDIDA: { class: "badge--RESPONDIDA", label: "Respondida" },
      PENDIENTE: { class: "badge--PENDIENTE", label: "Pendiente" },
      SIN_RESULTADOS: { class: "badge--SIN_RESULTADOS", label: "Sin resultados" },
      ERROR: { class: "badge--ERROR", label: "Error" },
    };
    return badges[estado] || { class: "badge--neutral", label: estado };
  };

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((paragraph, i) => (
      <p key={i} className="whitespace-pre-wrap">
        {paragraph.split("**").map((part, j) => (
          j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
        ))}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="history-detail-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Detalle de Consulta</h1>
          </header>
          <div className="loading-state" role="status" aria-label="Cargando detalle">
            <div className="spinner" aria-hidden="true" />
            <p>Cargando detalle...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-detail-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Detalle de Consulta</h1>
          </header>
          <div className="alert alert--error" role="alert">
            <div className="alert__icon" aria-hidden="true"><AlertCircle className="w-5 h-5" /></div>
            <div className="alert__content">
              <div className="alert__title">Error</div>
              <div className="alert__message">{error}</div>
            </div>
            <Link href="/history" className="btn btn--secondary">Volver</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!consulta) {
    return (
      <div className="history-detail-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Detalle de Consulta</h1>
          </header>
          <div className="empty-state" role="status">
            <h3 className="empty-state__title">Consulta no encontrada</h3>
            <Link href="/history" className="btn btn--primary">Volver al historial</Link>
          </div>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(consulta.estado);

  return (
    <div className="history-detail-page">
      <div className="container">
        <header className="page-header">
          <button onClick={goBack} className="btn btn--secondary btn--sm mb-4 flex items-center gap-1" aria-label="Volver al historial">
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Volver al historial
          </button>
          <h1 className="page-title">Detalle de Consulta</h1>
        </header>

        <div ref={detailRef} id="detailContent" className="animate-in">
          <div className="card animate-in" style={{ marginBottom: "1.5rem" }}>
            <div className="card__header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 id="detailQuestion" className="card__title">{consulta.pregunta}</h2>
                <div className="flex flex-wrap gap-2 mt-2" id="detailMeta">
                  <span className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    {formatDate(consulta.fecha)}
                  </span>
                  <span className={`badge ${badge.class} flex items-center gap-1`}>{badge.label}</span>
                </div>
              </div>
            </div>
          </div>

          {recommendation && (
            <section ref={recRef} className="card animate-in" style={{ marginBottom: "1.5rem" }} aria-labelledby="rec-title">
              <div className="card__header" style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)", color: "var(--color-text-inverse)" }}>
                <h2 id="rec-title" className="card__title" style={{ color: "var(--color-text-inverse)" }}>Recomendación Generada</h2>
              </div>
              <div className="card__body">
                <div id="detailRecommendation" className="recommendation-text">
                  {renderMarkdown(recommendation.contenido)}
                </div>
              </div>
            </section>
          )}

          {sources.length > 0 && (
            <section ref={sourcesRef} className="card animate-in" aria-labelledby="sources-title">
              <div className="card__header">
                <h2 id="sources-title" className="card__title">Fuentes Utilizadas</h2>
                <p className="card__subtitle">Cursos que sirvieron de base para la recomendación</p>
              </div>
              <div className="card__body">
                <div id="detailSources" className="sources-detail-list" role="list">
                  {sources.map((source) => (
                    <article key={source.idFuente} className="source-detail-card" role="listitem">
                      <div className="source-detail-card__header">
                        <div className="source-detail-card__info">
                          <h3 className="source-detail-card__title">{source.curso?.nombre || `Curso #${source.idCurso}`}</h3>
                          <div className="source-detail-card__meta">
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
                        <div className="source-detail-card__similarity">
                          <div className="similarity-large" data-width={`${Math.round(source.similitud * 100)}%`} aria-hidden="true">{Math.round(source.similitud * 100)}%</div>
                          <div className="similarity-label">Similitud</div>
                        </div>
                      </div>
                      {source.curso && (
                        <>
                          <p className="source-detail-card__description">{source.curso.descripcion}</p>
                          <div className="source-detail-card__tags">
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

          {rating && (
            <section ref={ratingRef} className="card animate-in" style={{ marginTop: "1.5rem" }} aria-labelledby="rating-title">
              <div className="card__header">
                <h2 id="rating-title" className="card__title">Tu Calificación</h2>
              </div>
              <div className="card__body">
                <div id="detailRating" className="rating-display">
                  <div className="rating-stars" aria-label={`Calificación: ${rating.calificacion} de 5 estrellas`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < (rating.calificacion || 0) ? "filled" : "empty"} aria-hidden="true">★</span>
                    ))}
                  </div>
                  {rating.comentario && (
                    <div className="rating-comment">
                      <p>&ldquo;{rating.comentario}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}