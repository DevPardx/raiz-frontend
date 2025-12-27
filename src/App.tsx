import { useEffect } from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./store/authStore";
import Spinner from "./components/atoms/Spinner";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isInitialized || isLoading) {
    return <Spinner />;
  }

  return <RouterProvider router={router} />;
}
