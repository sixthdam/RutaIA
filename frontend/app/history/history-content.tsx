"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AlertCircle, ChevronRight, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { api, ConsultaResponse } from "@/lib/api/service";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatDate } from "@/lib/utils/date";

export default function HistoryPage() {
  const { getUserId } = useAuth();
  const [consultas, setConsultas] = useState<ConsultaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const tableRef = useRef<HTMLTableElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const data = await api.getConsultasByUsuario(userId); // TODO: Backend to implement GET /api/consultas?idUsuario={id}
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
    if (!loading && tbodyRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          tbodyRef.current!.querySelectorAll("tr"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power3.out" }
        );
      }, tbodyRef);
      return () => ctx.revert();
    }
  }, [loading, consultas]);

  const getStatusBadge = (estado: string) => {
    const badges: Record<string, { class: string; icon: React.ReactNode; label: string }> = {
      RESPONDIDA: { class: "badge--RESPONDIDA", icon: <CheckCircle className="w-3 h-3" />, label: "Respondida" },
      PENDIENTE: { class: "badge--PENDIENTE", icon: <Clock className="w-3 h-3" />, label: "Pendiente" },
      SIN_RESULTADOS: { class: "badge--SIN_RESULTADOS", icon: <Search className="w-3 h-3" />, label: "Sin resultados" },
      ERROR: { class: "badge--ERROR", icon: <XCircle className="w-3 h-3" />, label: "Error" },
    };
    return badges[estado] || { class: "badge--neutral", icon: <span />, label: estado };
  };

  const handleViewDetail = (idConsulta: number) => {
    router.push(`/history/${idConsulta}`);
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Historial de Consultas</h1>
            <p className="page-subtitle">Revisa tus consultas anteriores y sus resultados</p>
          </header>
          <div className="loading-state" role="status" aria-label="Cargando historial">
            <div className="spinner" aria-hidden="true" />
            <p>Cargando historial...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Historial de Consultas</h1>
            <p className="page-subtitle">Revisa tus consultas anteriores y sus resultados</p>
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

  if (consultas.length === 0) {
    return (
      <div className="history-page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Historial de Consultas</h1>
            <p className="page-subtitle">Revisa tus consultas anteriores y sus resultados</p>
          </header>
          <div className="empty-state" role="status">
            <div className="empty-state__icon" aria-hidden="true">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="empty-state__title">No tienes consultas aún</h3>
            <p className="empty-state__message">Cuando hagas tu primera consulta, aparecerá aquí</p>
            <a href="/query" className="btn btn--primary">Hacer primera consulta</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">Historial de Consultas</h1>
          <p className="page-subtitle">Revisa tus consultas anteriores y sus resultados</p>
        </header>

        <div className="table-container card" style={{ overflow: "visible" }}>
          <table className="table" ref={tableRef}>
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Pregunta</th>
                <th scope="col">Estado</th>
                <th scope="col">Resumen</th>
                <th scope="col"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody ref={tbodyRef}>
              {consultas.map((consulta) => {
                const badge = getStatusBadge(consulta.estado);
                return (
                  <tr key={consulta.idConsulta} style={{ cursor: "pointer" }} onClick={() => handleViewDetail(consulta.idConsulta)}>
                    <td>
                      <time dateTime={consulta.fecha}>{formatDate(consulta.fecha)}</time>
                    </td>
                    <td>
                      <span className="history-question">{consulta.pregunta}</span>
                    </td>
                    <td>
                      <span className={`badge ${badge.class} flex items-center gap-1`}>
                        {badge.icon} {badge.label}
                      </span>
                    </td>
                    <td>
                      <span className="history-summary">
                        {consulta.estado === "RESPONDIDA" ? "Recomendación generada" : consulta.estado === "PENDIENTE" ? "Procesando..." : consulta.estado === "SIN_RESULTADOS" ? "No se encontraron cursos" : "Error en el procesamiento"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn--ghost btn--sm p-2"
                        onClick={(e) => { e.stopPropagation(); handleViewDetail(consulta.idConsulta); }}
                        aria-label={`Ver detalle de la consulta del ${formatDate(consulta.fecha)}`}
                      >
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}