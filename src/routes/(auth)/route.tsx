import { createFileRoute, Outlet } from '@tanstack/react-router'
import AuthLayout from '@/components/layouts/AuthLayout'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout>
        <Outlet />
    </AuthLayout>
  )
}
