import {getServerAuthSession} from "~/server/auth"
import {redirect} from "next/navigation";
import {ROUTES} from "~/lib/routes";
import { checkIsSetup } from '~/server/api/modules/users/service/checkIsSetup';

export default async function Home() {
  const session = await getServerAuthSession()

  const isSetup = await checkIsSetup()

  if (session) {
    redirect(ROUTES.recipes.root);
  } else if (!isSetup) {
    redirect(ROUTES.setup)
  }

}
