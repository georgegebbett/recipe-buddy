import { createUserProcedure } from "~/server/api/modules/users/procedures/createUser"
import { listUsersProcedure } from "~/server/api/modules/users/procedures/listUsers"
import { createTRPCRouter } from "~/server/api/trpc"

export const userRouter = createTRPCRouter({
  list: listUsersProcedure,
  create: createUserProcedure,
})
