import bcrypt from 'bcrypt';
import { db } from '~/server/db';
import { users as userTable } from '~/server/db/schema';

type CreateUserInput = {
  username: string
  name: string
  password: string
}
export const createUser = async (input: CreateUserInput) => {

  const hashed = await bcrypt.hash(input.password, 10)

  const insertedUser = await db.insert(userTable).values({
    ...input,
    passwordHash: hashed,
  })

  return {
    id: insertedUser.lastInsertRowid as number,
    ...input,
  }


}
