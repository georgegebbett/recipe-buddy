import { publicProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { count, sql } from 'drizzle-orm';
import { users } from '~/server/db/schema';
import { checkIsSetup } from '~/server/api/modules/users/service/checkIsSetup';

export const checkIsSetupProcedure = publicProcedure
  .query(checkIsSetup);
