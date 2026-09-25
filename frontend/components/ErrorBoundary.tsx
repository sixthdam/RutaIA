"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" role="alert">
          <div className="card" style={{ maxWidth: "500px", margin: "2rem auto", padding: "2rem" }}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(220, 38, 38, 0.1)", color: "var(--color-error)" }}>
                <AlertCircle className="w-8 h-8" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text)" }}>Algo salió mal</h2>
              <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
                Ocurrió un error inesperado. Por favor, intenta recargar la página.
              </p>
              {this.state.error && process.env.NODE_ENV === "development" && (
                <details className="mb-4 text-left" style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                  <summary style={{ cursor: "pointer" }}>Detalles del error</summary>
                  <pre className="mt-2 p-2 rounded bg-[var(--color-bg-muted)] overflow-auto" style={{ maxHeight: "200px" }}>
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={this.handleRetry}
                className="btn btn--primary flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Reintentar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}