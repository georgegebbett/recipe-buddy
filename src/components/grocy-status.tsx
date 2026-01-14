"use client"

import { api } from "~/trpc/react"
import { CheckCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Skeleton } from "~/components/ui/skeleton"

export const GrocyStatus = () => {
  const { data, isLoading } = api.grocy.checkConnection.useQuery()

  return (
    <>
      {data && data.success ? (
        <Alert>
          <CheckCircle className="size-4" />
          <AlertTitle>Connected to Grocy</AlertTitle>
          <AlertDescription>
            Connected to Grocy v{data.data.grocy_version.Version}
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <Alert className="pl-10">
          <AlertTitle>
            <Skeleton className="h-5 w-40" />
          </AlertTitle>
          <AlertDescription>
            <Skeleton className="h-4 w-80" />
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle className="size-4" />
          <AlertTitle>Not connected to Grocy</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <p>Unable to connect to Grocy - check your URL and API key</p>
              <p className="text-sm">
                Set <code className="rounded bg-muted px-1 py-0.5">GROCY_BASE_URL</code> and{" "}
                <code className="rounded bg-muted px-1 py-0.5">GROCY_API_KEY</code> environment variables.
                Find your API key in Grocy under Settings → Manage API keys.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
