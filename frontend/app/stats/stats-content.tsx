"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AlertCircle, BookOpen, CheckCircle, Search, Star, Info, TrendingUp } from "lucide-react";
import { api, StatsResponse } from "@/lib/api/service";
import { useAuth } from "@/lib/auth/AuthContext";

export default function StatsPage() {
  const { getUserId } = useAuth();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const data = await api.getStats(userId);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getUserId]);

  useEffect(() => {
    if (!loading && statsRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          statsRef.current!.querySelectorAll(".stat-item"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
        );
      }, statsRef);
      return () => ctx.revert();
    }
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="stats-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Estadísticas</h1>
            <p className="page-subtitle">Resumen de tu actividad</p>
          </header>
          <div className="loading-state" role="status" aria-label="Cargando estadísticas">
            <div className="spinner" aria-hidden="true" />
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Estadísticas</h1>
            <p className="page-subtitle">Resumen de tu actividad</p>
          </header>
          <div className="alert alert--error" role="alert">
            <div className="alert__icon" aria-hidden="true"><AlertCircle className="w-5 h-5" /></div>
            <div className="alert__content">
              <div className="alert__title">Error</div>
              <div className="alert__message">{error}</div>
            </div>
            <button className="btn btn--secondary" onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Estadísticas</h1>
            <p className="page-subtitle">Resumen de tu actividad</p>
          </header>
          <div className="empty-state" role="status">
            <div className="empty-state__icon" aria-hidden="true">
              <Info className="w-10 h-10 text-[var(--color-info)]" />
            </div>
            <h3 className="empty-state__title">No hay estadísticas disponibles</h3>
            <p className="empty-state__message">Cuando hagas tu primera consulta, aparecerán tus estadísticas aquí</p>
            <a href="/query" className="btn btn--primary">Hacer primera consulta</a>
          </div>
        </div>
      </div>
    );
  }

  const { totalConsultas, consultasRespondidas, consultasSinResultados, calificacionPromedio, cursoMasRecomendado, distribucionEstados } = stats;

  return (
    <div className="stats-page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">Estadísticas</h1>
          <p className="page-subtitle">Resumen de tu actividad</p>
        </header>

        <section ref={statsRef} className="stats-simple" aria-labelledby="stats-title">
          <h2 id="stats-title" className="sr-only">Resumen de estadísticas</h2>
          
          <div className="stats-grid">
            <article className="stat-item card">
              <div className="card__body stat-item__body">
                <div className="stat-item__icon" style={{ backgroundColor: "rgba(26, 26, 46, 0.1)", color: "var(--color-primary)" }}>
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="stat-item__content">
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)" }}>{totalConsultas}</div>
                  <div className="stat-item__label">Total de consultas</div>
                </div>
              </div>
            </article>

            <article className="stat-item card">
              <div className="card__body stat-item__body">
                <div className="stat-item__icon" style={{ backgroundColor: "rgba(45, 125, 70, 0.1)", color: "var(--color-success)" }}>
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="stat-item__content">
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)" }}>{consultasRespondidas}</div>
                  <div className="stat-item__label">Respondidas</div>
                </div>
              </div>
            </article>

            <article className="stat-item card">
              <div className="card__body stat-item__body">
                <div className="stat-item__icon" style={{ backgroundColor: "rgba(14, 116, 144, 0.1)", color: "var(--color-info)" }}>
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="stat-item__content">
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)" }}>{consultasSinResultados}</div>
                  <div className="stat-item__label">Sin resultados</div>
                </div>
              </div>
            </article>

            <article className="stat-item card">
              <div className="card__body stat-item__body">
                <div className="stat-item__icon" style={{ backgroundColor: "rgba(201, 169, 98, 0.1)", color: "var(--color-accent)" }}>
                  <Star className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="stat-item__content">
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)" }}>
                    {calificacionPromedio > 0 ? calificacionPromedio.toFixed(1) : "—"}
                  </div>
                  <div className="stat-item__label">Calificación promedio</div>
                </div>
              </div>
            </article>
          </div>

          {cursoMasRecomendado && (
            <article className="stat-item card" style={{ marginTop: "1rem" }}>
              <div className="card__body stat-item__body">
                <div className="stat-item__icon" style={{ backgroundColor: "rgba(26, 26, 46, 0.1)", color: "var(--color-primary)" }}>
                  <TrendingUp className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="stat-item__content">
                  <div className="stat-item__label">Curso más recomendado</div>
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}>{cursoMasRecomendado}</div>
                </div>
              </div>
            </article>
          )}

          {Object.keys(distribucionEstados).length > 0 && (
            <div className="card" style={{ marginTop: "1.5rem" }}>
              <div className="card__header">
                <h3 className="card__title">Distribución por estado</h3>
              </div>
              <div className="card__body">
                <div className="grid grid--3 gap-4">
                  {Object.entries(distribucionEstados).map(([estado, count]) => (
                    <div key={estado} className="stat-mini text-center">
                      <div className="stat-mini__value" style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem" }}>{count}</div>
                      <div className="stat-mini__label" style={{ textTransform: "capitalize" }}>{estado.toLowerCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {totalConsultas === 0 && (
            <div className="empty-state" role="status">
              <div className="empty-state__icon" aria-hidden="true">
                <Info className="w-10 h-10 text-[var(--color-info)]" />
              </div>
              <h3 className="empty-state__title">No hay consultas aún</h3>
              <p className="empty-state__message">Cuando hagas tu primera consulta, aparecerán tus estadísticas aquí</p>
              <a href="/query" className="btn btn--primary">Hacer primera consulta</a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}