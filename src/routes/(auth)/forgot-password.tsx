import ForgotPasswordView from "@/views/auth/ForgotPasswordView";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ForgotPasswordView />;
}
