import "~/styles/globals.css"

import {Inter} from "next/font/google"
import {cookies} from "next/headers"
import {TRPCReactProvider} from "~/trpc/react"

import {dashboardConfig} from "~/config/dashboard"
import {cn} from "~/lib/utils"
import {Toaster} from "~/components/ui/sonner"
import {MainNav} from "~/components/main-nav"
import {RecipesSidebar} from "~/components/nav"
import {SiteFooter} from "~/components/site-footer"
import {ThemeProvider} from "~/components/theme-provider"
import {UserAccountNav} from "~/components/user-account-nav";
import {getCurrentUser} from "~/lib/session";
import {Button} from "~/components/ui/button";
import {signIn} from "next-auth/react";
import {SignInButton} from "~/components/sign-in-button";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Recipe Buddy",
  description: "Recipe Buddy",
  icons: [{rel: "icon", url: "/favicon.ico"}],
}

export default async function RootLayout(
    {children}: { children: React.ReactNode }
) {

  const user = await getCurrentUser()
  return (
      <html lang="en">
      <body
          className={cn(
              "bg-background min-h-screen font-sans antialiased",
              inter.variable
          )}
      >
      <TRPCReactProvider cookies={cookies().toString()}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col space-y-6">
            <header className="bg-background sticky top-0 z-40 border-b">
              <div className="container flex h-16 items-center justify-between py-4">
                {user ? (
                    <><MainNav items={dashboardConfig.mainNav}/><UserAccountNav
                        user={{
                          name: user?.name,
                          username: user?.username,
                        }}/></>) : (<>
                 <SignInButton/>

                </>)}
              </div>
            </header>
            {children}
            <Toaster/>
            {/*<SiteFooter className="border-t" />*/}
          </div>
        </ThemeProvider>
      </TRPCReactProvider>
      </body>
      </html>
  )
}
