"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Filter, X, Tag, Star, Clock } from "lucide-react";
import { api, Course, Category } from "@/lib/api/service";
import { Skeleton } from "@/components/loading/Skeleton";

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ category: "", difficulty: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          api.getCursos(),
          api.getCategorias(),
        ]);
        setCourses(coursesData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar cursos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current!.querySelectorAll(".course-card"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [courses, filters]);

  const filteredCourses = courses.filter((course) => {
    const catMatch = !filters.category || course.categoria?.nombre === filters.category;
    const diffMatch = !filters.difficulty || course.dificultad === filters.difficulty;
    return catMatch && diffMatch;
  });

  const handleFilterChange = (key: "category" | "difficulty", value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: "", difficulty: "" });
  };

  const hasActiveFilters = filters.category || filters.difficulty;

  const difficulties = ["BASICA", "INTERMEDIO", "AVANZADO"];

  return (
    <div className="catalog-page">
      <div className="container">
        <header className="page-header">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="page-title">Catálogo de Cursos</h1>
              <p className="page-subtitle">Explora todos los cursos disponibles y filtra según tus necesidades</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn--secondary flex items-center gap-2 md:hidden"
              aria-expanded={showFilters}
              aria-controls="filterPanel"
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              Filtros
            </button>
          </div>

          <div
            id="filterPanel"
            className={`catalog-filters card mt-4 transition-all duration-300 ${!showFilters && "md:hidden hidden"}`}
            style={{ display: showFilters || isDesktop ? "block" : "none" }}
          >
            <div className="card__body">
              <div className="filter-row flex flex-wrap gap-4">
                <div className="form-group flex-1 min-w-[200px]">
                  <label className="form-label" htmlFor="filterCategory">Categoría</label>
                  <select
                    id="filterCategory"
                    className="form-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat.idCategoria} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group flex-1 min-w-[200px]">
                  <label className="form-label" htmlFor="filterDificultad">Dificultad</label>
                  <select
                    id="filterDificultad"
                    className="form-select"
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                  >
                    <option value="">Todas las dificultades</option>
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff.charAt(0) + diff.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {hasActiveFilters && (
                  <div className="form-group flex items-end">
                    <button type="button" className="btn btn--secondary btn--full flex items-center gap-2" onClick={clearFilters}>
                      <X className="w-4 h-4" aria-hidden="true" />
                      Limpiar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="alert alert--error mb-6" role="alert">
            <div className="alert__content">
              <div className="alert__title">Error</div>
              <div className="alert__message">{error}</div>
            </div>
            <button className="btn btn--secondary btn--sm" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        <div id="coursesContainer">
          {loading ? (
            <div className="grid grid--auto" ref={gridRef} role="status" aria-label="Cargando cursos">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="course" />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="empty-state" role="status">
              <div className="empty-state__icon" aria-hidden="true">
                <Tag className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="empty-state__title">No hay cursos disponibles</h3>
              <p className="empty-state__message">
                {hasActiveFilters
                  ? "No se encontraron cursos con los filtros seleccionados"
                  : "No hay cursos disponibles en este momento"}
              </p>
              {hasActiveFilters && (
                <button className="btn btn--secondary" onClick={clearFilters}>
                  Restablecer filtros
                </button>
              )}
            </div>
          ) : (
            <div className="courses-grid grid grid--auto" ref={gridRef} role="list" aria-label="Lista de cursos">
              {filteredCourses.map((course) => (
                <article key={course.idCurso} className="course-card card" role="listitem">
                  <div className="course-card__header">
                    <div className="course-card__category">
                      <span className="badge badge--neutral">{course.categoria?.nombre}</span>
                    </div>
                    <h3 className="course-card__title">{course.nombre}</h3>
                    <div className="course-card__difficulty">
                      <span className={`badge badge--${course.dificultad}`}>
                        {course.dificultad.charAt(0) + course.dificultad.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="course-card__body">
                    <p className="course-card__description">{course.descripcion}</p>
                    <div className="course-card__meta">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        {course.duracion}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" style={{ color: "var(--color-accent)" }} aria-hidden="true" />
                        {course.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}