import { Result } from '@badrap/result'
import { RequestHandler, Response } from 'express'
import { Option } from 'fp-ts/lib/Option'
import { PlutusError } from '../errors'
import { logger } from '../logger'
import { HttpResponse } from '../transactions/types'
import { assertUnReachable } from './assertUnReachable'
import mergeNoOverlap from './mergeNoOverlap'

export default function createHandler<T, R>(func: (req: T) => Promise<Result<HttpResponse<R>, PlutusError>>): RequestHandler {
  return async function f(req, res) {
    const input: Option<Record<string, unknown>> = mergeNoOverlap(req.params, req.query, req.body)

    if (input._tag == 'None') return res.status(400).send({ message: 'Invalid Request' })

    const result = await func(input.value as T)
    return handleResult(result, res)
  }
}

function handleResult<R>(result: Result<HttpResponse<R>, Error>, res: Response) {
  if (result.isErr) return handleError(result.error, res)

  const { statusCode, ...response } = result.value
  return res.status(statusCode).send(response)
}

function handleError(err: Error, res: Response): Response {
  logger.error(err.message, { req: { body: res.req.body, params: res.req.params, query: res.req.query }, err })

  const isPlutusError = (err: Error): err is PlutusError => 'httpStatusCode' in err
  if (!isPlutusError(err)) return res.status(500).send({ message: err.message })

  switch (err.name) {
    case 'Not Found':
    case 'Not Modified':
    case 'UnExpected Error':
      return res.status(err.httpStatusCode).send({ message: err.message })
  }
  assertUnReachable(err)
}
