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
            Unable to connect to Grocy - check your URL and API key
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
