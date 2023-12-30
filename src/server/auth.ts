import {type DefaultSession, getServerSession, type NextAuthOptions,} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {db} from "~/server/db";
import {eq} from "drizzle-orm";
import {users} from "~/server/db/schema";
import bcrpyt from "bcrypt"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user']
  }

  interface User {
    id: string
    name: string
    username: string
  }

}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Password",
      credentials: {
        username: {label: "Username", type: "text"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        if (credentials) {

          const dbUser = await db.query.users.findFirst({where: eq(users.username, credentials.username)})

          if (!dbUser) return null

          const passwordResult = await bcrpyt.compare(credentials.password, dbUser.passwordHash)

          if (!passwordResult) return null

          return {
            name: dbUser.name,
            id: dbUser.id.toString(),
            username: dbUser.username
          }

        } else {
          return null
        }

      }
    })
  ],
  callbacks: {
    jwt({token, profile, user}) {
      if (user) {
        token.id = user.id

      }
      return token
    },
    session: ({session, token}) => {
      if (session?.user && token?.id) {
        session.user.id = String(token.id)
      }
      return session
    },

  }
};


/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
