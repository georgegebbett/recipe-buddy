import { replete } from "@nll/datum/Datum"
import { DatumEither, initial, success, failure, toRefresh } from "@nll/datum/DatumEither"
import { Option } from 'fp-ts/es6/Option'
import { fromOption as eitherFromOption } from 'fp-ts/es6/Either'
import { useState } from "react"
import { Lazy, pipe } from "fp-ts/es6/function"
import { map, mapLeft, TaskEither } from "fp-ts/lib/TaskEither"

export const useAsync = <I extends any[], A, E = Error>(
  asyncFunction: (...input: I) => Promise<A>
) => {
  const [status, setStatus] = useState<DatumEither<E, A>>(initial)

  const execute = (...input: I) => {
    setStatus(status => toRefresh(status))

    return asyncFunction(...input)
      .then(response => {
        setStatus(success(response))
        return response
      })
      .catch((error: any) => {
        console.log('Async error', error)
        setStatus(failure(error))
      })
  }

  const reset = () => setStatus(initial)

  return { execute, status, reset }
}

export const useFromTaskEither = <I extends any[], A, E = Error>(
  asyncFunction: (...input: I) => TaskEither<E, A>
) => {
  const [status, setStatus] = useState<DatumEither<E, A>>(initial)

  const execute = (...input: I) => {
    setStatus(status => toRefresh(status))

    return pipe(
      asyncFunction(...input),
      map(response => {
        setStatus(success(response))
        return response
      }),
      mapLeft((error: any) => {
        console.log('Async error', error)
        setStatus(failure(error))
      })
    )()
  }

  const reset = () => setStatus(initial)

  return { execute, status, reset }
}


export const datumFromOption = <E, A>(onNone: Lazy<E>) => (
  o: Option<A>
): DatumEither<E, A> => replete(eitherFromOption(onNone)(o));

export const parseConnection =
  <I>(input: { items?: Array<I | null> | null } | null | undefined) =>
    <O>(parse: (i: I) => O) =>
      (input?.items || []).flatMap(i => i ? [parse(i)] : [])
