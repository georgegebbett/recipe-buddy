import { createUserProcedure } from "~/server/api/modules/users/procedures/createUser"
import { listUsersProcedure } from "~/server/api/modules/users/procedures/listUsers"
import { createTRPCRouter } from "~/server/api/trpc"
import { checkIsSetupProcedure } from '~/server/api/modules/users/procedures/checkIsSetup';
import { setupUserProcedure } from '~/server/api/modules/users/procedures/setupUser';

export const userRouter = createTRPCRouter({
  list: listUsersProcedure,
  create: createUserProcedure,
  checkIsSetup: checkIsSetupProcedure,
  setupUser: setupUserProcedure
})
