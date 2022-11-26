import * as React from 'react'
import { useContext } from 'react'

export interface Environment {
  // POSTHOG_KEY: string
  BACKEND_URL: string
}

export const DEFAULT_ENVIRONMENT: Environment = {
  // POSTHOG_KEY: process.env.REACT_APP_POSTHOG_KEY || '',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || ''
}

export const EnvironmentContext = React.createContext<Environment>(DEFAULT_ENVIRONMENT)

export const useEnvironment = (): Environment => {
  return useContext(EnvironmentContext)
}
