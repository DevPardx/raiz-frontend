import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/verify-account")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(auth)/verify-account"!</div>;
}
