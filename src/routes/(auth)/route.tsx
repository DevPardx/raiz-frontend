import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import AuthLayout from '@/components/layouts/AuthLayout'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async () => {
    const { isInitialized, checkAuth } = useAuthStore.getState();

    if (!isInitialized) {
      await checkAuth();
    }

    const { isAuthenticated: authStatus } = useAuthStore.getState();

    if (authStatus) {
      throw redirect({ to: '/' });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout>
        <Outlet />
    </AuthLayout>
  )
}
