"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Loader2, AlertCircle, BookOpen, CheckCircle, Search, Star, Info } from "lucide-react";
import { api, ConsultaResponse } from "@/lib/api/service";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatDateShort } from "@/lib/utils/date";

export default function StatsPage() {
  const { getUserId } = useAuth();
  useEffect(() => {
    const { ScrollTrigger } = require("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
  }, []);
  const [consultas, setConsultas] = useState<ConsultaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const data = await api.getConsultasByUsuario(userId);
        setConsultas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar historial");
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
  }, [loading]);

  const total = consultas.length;
  const respondidas = consultas.filter(c => c.estado === "RESPONDIDA").length;
  const pendientes = consultas.filter(c => c.estado === "PENDIENTE").length;
  const sinResultados = consultas.filter(c => c.estado === "SIN_RESULTADOS").length;
  const errores = consultas.filter(c => c.estado === "ERROR").length;

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
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)" }}>{total}</div>
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
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)" }}>{respondidas}</div>
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
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)" }}>{sinResultados}</div>
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
                  <div className="stat-item__value" style={{ fontFamily: "var(--font-serif)" }}>{pendientes}</div>
                  <div className="stat-item__label">Pendientes</div>
                </div>
              </div>
            </article>
          </div>

          {total === 0 && (
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