import { verifyToken } from '@/api/auth';
import ResetPasswordView from '@/views/auth/ResetPasswordView';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/reset-password/$token')({
  loader: async ({ params }) => {
    try {
      await verifyToken(params.token);
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ResetPasswordView />;
}
