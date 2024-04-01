"use client"

import { useState } from "react"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { type AppRouter } from "~/server/api/root"
import { toast } from "sonner"

import { getUrl, transformer } from "./shared"

export const api = createTRPCReact<AppRouter>()

export function TRPCReactProvider(props: {
  children: React.ReactNode
  cookies: string
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.state.data !== undefined) {
              const title =
                (query.meta?.title as string) ?? "Something went wrong"
              const description =
                (query.meta?.description as string) ??
                (error instanceof Error && `${error.message}`)

              toast.error(title, { description })
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _, __, mutation) => {
            const title =
              (mutation.meta?.title as string) ?? "Something went wrong"
            const description =
              (mutation.meta?.description as string) ??
              (error instanceof Error && `${error.message}`)

            toast.error(title, { description })
          },
        }),
      })
  )

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            return {
              cookie: props.cookies,
              "x-trpc-source": "react",
            }
          },
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}
