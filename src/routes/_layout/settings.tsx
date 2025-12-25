import SettingsView from '@/views/app/SettingsView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingsView />
}
