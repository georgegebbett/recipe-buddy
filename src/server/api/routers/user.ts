import {createTRPCRouter,} from "~/server/api/trpc"
import {listUsersProcedure} from "~/server/api/modules/users/procedures/listUsers";
import {createUserProcedure} from "~/server/api/modules/users/procedures/createUser";

export const userRouter = createTRPCRouter({
  list: listUsersProcedure,
  create: createUserProcedure
})
