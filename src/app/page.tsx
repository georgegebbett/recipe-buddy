import {getServerAuthSession} from "~/server/auth"
import {redirect} from "next/navigation";
import {ROUTES} from "~/lib/routes";

export default async function Home() {
  const session = await getServerAuthSession()

  if (session) redirect(ROUTES.recipes.root)
}
