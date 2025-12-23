import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/favorites')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/favorites"!</div>
}
