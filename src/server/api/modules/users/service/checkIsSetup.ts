import { db } from '~/server/db';
import { count } from 'drizzle-orm';
import { users } from '~/server/db/schema';
import { logger } from '~/lib/logger';

export const checkIsSetup = async () => {

  logger.info("Checking if instance setup")

  const [numberOfUsers] = await db.select({ value: count(users.id) }).from(users);

  const isSetup = !numberOfUsers || (numberOfUsers && numberOfUsers.value > 0);

  logger.info({isSetup})

  return isSetup

};


