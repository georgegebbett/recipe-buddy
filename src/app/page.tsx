import { getServerAuthSession } from "~/server/auth"

import { SidebarLayout } from "~/components/SidebarLayout"

export default async function Home() {
  const session = await getServerAuthSession()

  const numbers = new Array(50).fill(0).map((a, i) => i)

  return (
    <div className="flex h-full flex-1 flex-col">
      <p>Hello {session.user.name}</p>
    </div>
  )
}
