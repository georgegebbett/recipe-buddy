import { generateApiKeyProcedure } from "~/server/api/modules/apiKeys/procedures/generateApiKey"
import { listApiKeysProcedure } from "~/server/api/modules/apiKeys/procedures/listApiKeys"
import { deleteApiKeyProcedure } from "~/server/api/modules/apiKeys/procedures/deleteApiKey"
import { createTRPCRouter } from "~/server/api/trpc"

export const apiKeyRouter = createTRPCRouter({
  list: listApiKeysProcedure,
  generate: generateApiKeyProcedure,
  delete: deleteApiKeyProcedure,
})
