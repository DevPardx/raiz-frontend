import FavoritesView from '@/views/app/FavoritesView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/favorites')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FavoritesView />
}
