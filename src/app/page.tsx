import { redirect } from "next/navigation"
import { checkIsSetup } from "~/server/api/modules/users/service/checkIsSetup"
import { getServerAuthSession } from "~/server/auth"

import { ROUTES } from "~/lib/routes"

export default async function Home() {
  const session = await getServerAuthSession()

  const isSetup = await checkIsSetup()

  if (session) {
    redirect(ROUTES.recipes.root)
  } else if (!isSetup) {
    redirect(ROUTES.setup)
  }
}
