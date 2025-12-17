import React, { Component, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { WarningCircleIcon } from "@phosphor-icons/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error capturado por Error Boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: DefaultErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-700 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <WarningCircleIcon className="size-16 text-red-500" weight="duotone" />
        </div>

        <h1 className="text-2xl font-bold text-black dark:text-white">
          {t("error_boundary_title")}
        </h1>

        <p className="text-neutral-600 dark:text-neutral-400">
          {t("error_boundary_description")}
        </p>

        {error && import.meta.env.NODE_ENV === "development" && (
          <details className="text-left bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 text-sm">
            <summary className="cursor-pointer font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t("error_boundary_details")}
            </summary>
            <pre className="text-xs text-red-600 dark:text-red-400 overflow-x-auto whitespace-pre-wrap wrap-break-word">
              {error.toString()}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col gap-2 pt-4">
          <button
            onClick={resetError}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            {t("error_boundary_try_again")}
          </button>

          <button
            onClick={() => window.location.href = "/"}
            className="w-full bg-transparent text-black dark:text-white border border-neutral-300 dark:border-neutral-700 py-2.5 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {t("error_boundary_go_home")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
