import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store"

import { env } from "~/env"
import { DashboardShell } from "~/components/shell"
import { RecipeForm } from "~/app/(dashboard)/recipes/[id]/recipeForm"

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
  noStore()

  const baseUrl = env.GROCY_BASE_URL

  return (
    <DashboardShell>
      <RecipeForm recipeId={parseInt(params.id)} grocyBaseUrl={baseUrl} />
    </DashboardShell>
  )
}
