import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { impl, Variant } from '@practical-fp/union-types';
import { flow } from 'fp-ts/function';
import { pipe } from 'fp-ts/lib/function';


export type RequestError =
  | Variant<"ResponseError", ResponseError>
  | Variant<"ParseError", Error>
  | Variant<"NetworkError", Error>

export const RequestError = impl<RequestError>()

type ResponseError = {
  statusCode: number
  details: string
  body?: any
}

export const toNetworkError = flow(E.toError, RequestError.NetworkError)
export const toParseError = flow(E.toError, RequestError.ParseError)

const fetchAndLog = (input: RequestInfo, init?: RequestInit) => {
  console.log(`Requesting URL: [${input}]`)
  return fetch(input, init)
}

export const fetchRaw = TE.tryCatchK(fetchAndLog, toNetworkError)

export const fetchWithOK = flow(
  fetchRaw,
  TE.chainW(r => pipe(
    r,
    TE.fromPredicate(r => r.ok, (): RequestError => RequestError.ResponseError({ statusCode: r.status, details: `Not OK` })),
    TE.orLeft((e1) => pipe(
      TE.tryCatch(() => r.json(), toParseError),
      TE.matchW(() => e1, (b): RequestError => RequestError.ResponseError({ statusCode: r.status, details: `Not OK`, body: b })),
    ))
  ))
)

export type Parser<E, A> = (i: unknown) => E.Either<E, A>

export const fetchParsedJSON = <A>(parser: Parser<Error, A>) => flow(
  fetchWithOK,
  TE.chainW(r => TE.tryCatch(() => r.json(), toParseError)),
  TE.chainW(flow(TE.fromEitherK(parser), TE.mapLeft(toParseError)))
)

export const fetchAndCast = <A>() => fetchParsedJSON(castTo<A>())

export const castTo = <T>() => (i: unknown) => E.right(i as T)

export const withLogs = <T, E>() => TE.bimap<T, T, E, E>(
  e => {
    console.log('[LEFT]', e)
    return e
  },
  a => {
    console.log('[RIGHT]', a)
    return a
  }
)
