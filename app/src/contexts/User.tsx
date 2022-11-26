import { LoggedInUser } from './Auth';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { FCWithChildren } from '../types/react';
import { useApiFetch } from '../hooks/useApiClient';
import { fetchAndCast, fetchRaw } from '../lib/fetch';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither'

export type UserContext = {
  user: LoggedInUser,
  grocy: GrocySettings
}

type UserResponse = {
  grocyApiKey: string
  grocyBaseUrl: string
}

export type GrocySettings = {
  apiKey: string
  baseUrl: string
}

const initialUserContext: UserContext = {
  user: {
    name: '',
    roles: [],
    accessToken: ''
  },
  grocy: {
    apiKey: '',
    baseUrl: ''
  }
}

const UserContext = createContext<UserContext>(initialUserContext)

export const useUser = () => useContext(UserContext)

export const UserProvider: FCWithChildren<{user: LoggedInUser}> = ({user, children}) => {

  const [state, setState] = useState<UserContext>({user, grocy: { apiKey: '', baseUrl: '' } })

  const getUserFromBackend = useApiFetch(fetchAndCast<UserResponse>())('users/me')

  useEffect(() => {
    pipe(
      getUserFromBackend,
      TE.map(a => {
        setState({user, grocy: {apiKey: a.grocyApiKey, baseUrl: a.grocyBaseUrl}})
      })
    )()
  }, [user])


  return (
    <UserContext.Provider value={state}>
      {children}
    </UserContext.Provider>
  )

}
