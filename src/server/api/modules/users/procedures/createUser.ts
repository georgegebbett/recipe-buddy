import {protectedProcedure} from "~/server/api/trpc";
import {db} from "~/server/db";
import {users as userTable} from "~/server/db/schema";
import z from "zod"
import bcrypt from "bcrypt"
import {CreateUserSchema} from "~/server/api/modules/users/procedures/createUserSchema";

export const createUserProcedure = protectedProcedure
    .input(CreateUserSchema)
    .output(z.object({
      id: z.number(),
      name: z.string(),
      username: z.string(),
    }))
    .mutation(async ({input}) => {

      const hashed = await bcrypt.hash(input.password, 10);

      const insertedUser = await db.insert(userTable).values({
        ...input,
        passwordHash: hashed
      })

      return {
        id: insertedUser.lastInsertRowid as number,
        ...input
      }

    })
