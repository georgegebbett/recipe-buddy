import { checkIsSetupProcedure } from "~/server/api/modules/users/procedures/checkIsSetup"
import { createUserProcedure } from "~/server/api/modules/users/procedures/createUser"
import { listUsersProcedure } from "~/server/api/modules/users/procedures/listUsers"
import { setupUserProcedure } from "~/server/api/modules/users/procedures/setupUser"
import { createTRPCRouter } from "~/server/api/trpc"

export const userRouter = createTRPCRouter({
  list: listUsersProcedure,
  create: createUserProcedure,
  checkIsSetup: checkIsSetupProcedure,
  setupUser: setupUserProcedure,
})
