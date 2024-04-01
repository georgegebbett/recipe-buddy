import { checkIsSetup } from "~/server/api/modules/users/service/checkIsSetup"
import { publicProcedure } from "~/server/api/trpc"
import { db } from "~/server/db"
import { users } from "~/server/db/schema"
import { count, sql } from "drizzle-orm"

export const checkIsSetupProcedure = publicProcedure.query(checkIsSetup)
