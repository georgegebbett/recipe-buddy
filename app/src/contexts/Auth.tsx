import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { impl, Variant } from '@practical-fp/union-types';
import { DatumEither, initial, pending, refreshFold, success } from '@nll/datum/DatumEither';
import { FCWithChildren } from '../types/react';
import { useApiFetch } from '../hooks/useApiClient';
import { fetchAndCast, fetchWithOK } from '../lib/fetch';
import { useFromTaskEither } from '../hooks/useAsync';
import { constVoid, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither'

export type AuthState =
  | Variant<"LoggedIn", LoggedInUser>
  | Variant<"LoggedOut">

export const AuthState = impl<AuthState>()

export type LoggedInUser = {
  accessToken: string,
  name: string,
  roles: string[]
}

type AuthContext = {
  state: DatumEither<string, AuthState>
  logout: () => void
  login: (username: string, password: string) => void
}


export const AuthContext= createContext<AuthContext>({
  state: pending,
  login: Promise.resolve,
  logout: Promise.resolve,
})

export const useAuth = () => useContext(AuthContext)

type UserResponse = {
  username: string
  access_token: string
  roles: string[]
}

export const AuthProvider: FCWithChildren<{}> = ({children}) => {

  const [state, setState] = useState<DatumEither<string, AuthState>>(pending)

  const api = useApiFetch(fetchAndCast<UserResponse>())
  const { status, execute } = useFromTaskEither(api)

  const api2 = useApiFetch(fetchWithOK)
  const {status: loginStatus, execute: loginExecute} = useFromTaskEither(api2)

  const userState = () => pipe(
    status,
    refreshFold(
      () => setState(initial),
      () => setState(pending),
      () => setState(success(AuthState.LoggedOut())),
      (a) => {
        localStorage.setItem('rb-token', a.access_token)
        setState(success(AuthState.LoggedIn({
          accessToken: a.access_token,
          roles: a.roles,
          name: a.username,
        })));
      }
    )
  )

  useEffect(() => {
    const token = localStorage.getItem('rb-token')
    console.log(`first run token is ${token}`);
    execute('users/me', {headers: {Authorization: `Bearer ${token}`}})}, [])
  useEffect(() => {userState()}, [status])

  const loginReq = (username: string, password: string) => execute('auth/login', {
    method: 'POST',
    body: JSON.stringify({username, password})
  })

  const logoutReq = () => loginExecute('auth/login', {
    method: 'DELETE',
  })

  const login = (username: string, password: string) => pipe(
    loginReq(username, password),
    userState,
  )

  const logout = () => pipe(
    logoutReq(),
    userState
  )

  const context: AuthContext = {
    state: state,
    login: login,
    logout: logout
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  )
}
