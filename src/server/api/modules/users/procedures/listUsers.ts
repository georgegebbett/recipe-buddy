import {protectedProcedure} from "~/server/api/trpc";
import {db} from "~/server/db";
import {users as userTable} from "~/server/db/schema";
import z from "zod"

export const listUsersProcedure = protectedProcedure
    .output(z.object({
      id: z.number(),
      name: z.string(),
      username: z.string()
    }).array())
    .query(async () => {

      return db.select({
        id: userTable.id,
        name: userTable.name,
        username: userTable.username,
      }).from(userTable)


    })
