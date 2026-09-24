import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer border-t border-[var(--color-border)] bg-[var(--color-bg)] mt-auto" role="contentinfo">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold" style={{ color: "var(--color-primary)" }}>RutaIA</span>
            <span className="text-[var(--color-text-muted)] text-sm hidden sm:block">Tu guía inteligente de cursos</span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Enlaces del pie de página">
            <Link
              href="/catalog"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/query"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Consulta
            </Link>
            <Link
              href="/history"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Historial
            </Link>
            <Link
              href="/stats"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Estadísticas
            </Link>
          </nav>
          
          <p className="text-sm text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} RutaIA - Sistema de recomendación de cursos
          </p>
        </div>
      </div>
    </footer>
  );
}