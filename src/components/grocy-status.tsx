"use client"

import { api } from "~/trpc/react"
import { CheckCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

export const GrocyStatus = () => {
  const { data } = api.grocy.checkConnection.useQuery()

  return (
    <>
      {data && data.success ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Connected to Grocy</AlertTitle>
          <AlertDescription>
            Connected to Grocy v{data.data.grocy_version.Version}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Not connected to Grocy</AlertTitle>
          <AlertDescription>
            Unable to connect to Grocy - check your URL and API key
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
