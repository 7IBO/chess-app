/**
 * Error Boundary pour gérer les erreurs React et afficher un fallback UI
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "@/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error("Error caught by ErrorBoundary:", { error, errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md border border-red-500/50">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Oups ! Une erreur est survenue</h1>
            <p className="text-slate-300 mb-6">
              Une erreur inattendue s'est produite. Nous nous excusons pour la gêne occasionnée.
            </p>

            {this.state.error && (
              <details className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                <summary className="cursor-pointer text-slate-400 font-semibold mb-2">
                  Détails de l'erreur
                </summary>
                <pre className="text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Recharger l'application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
