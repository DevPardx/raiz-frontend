import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/chats')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/chats"!</div>
}
