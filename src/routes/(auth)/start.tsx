import StartView from '@/views/auth/StartView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/start')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StartView />
}
