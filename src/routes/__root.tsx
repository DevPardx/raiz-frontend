import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ErrorBoundary>
      <Outlet />
      <Toaster position="top-right" richColors theme='light'  />
    </ErrorBoundary>
  );
}
