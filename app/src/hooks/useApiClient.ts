import { pipe } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { useEnvironment } from '../contexts/Environment';
import { useAuth } from '../contexts/Auth';
import { refreshFold } from '@nll/datum/DatumEither';
import { matchExhaustive } from '@practical-fp/union-types';
import { useEffect } from 'react';

export const useApiFetch = <E, A>(fetcher: (input: RequestInfo, init?: RequestInit) => TaskEither<E, A>) => {
  const { BACKEND_URL } = useEnvironment()
  const {state} = useAuth()

  useEffect(() => {
    console.log(state)}, [state])

  const getToken = () => pipe(
    state,
    refreshFold(
      () => '',
      () => '',
      () => '',
      a => matchExhaustive(a, {
        LoggedIn: b => b.accessToken,
        LoggedOut: () => ''
      }),

    )
  )

  return (input: RequestInfo, init?: RequestInit) => pipe(
    getToken(),
    a => {
      console.log(`token ${a}`)
      return a
    },
    token => fetcher(`${BACKEND_URL}/${input}`, {
      ...init,
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  )
}
