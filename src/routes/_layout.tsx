import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import MainLayout from '@/components/layouts/MainLayout'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/_layout')({
  beforeLoad: async ({ location }) => {
    const { isInitialized, checkAuth } = useAuthStore.getState();

    if (!isInitialized) {
      await checkAuth();
    }

    const { isAuthenticated: authStatus } = useAuthStore.getState();

    if (location.pathname === '/' || location.pathname === '') {
      return;
    }

    if (!authStatus) {
      throw redirect({
        to: '/start',
      });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainLayout>
        <Outlet />
    </MainLayout>
  )
}
