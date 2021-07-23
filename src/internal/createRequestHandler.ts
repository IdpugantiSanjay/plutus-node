import { Result } from '@badrap/result';
import { RequestHandler, Response } from 'express';
import { Option } from 'fp-ts/lib/Option';
import { ApplicationError } from '../common/error';
import { logger } from '../logger';
import { HttpResponse } from '../transactions/types';
import mergeNoOverlap from './mergeNoOverlap';

export default function createHandler<T, R>(func: (req: T) => Promise<Result<HttpResponse<R>, Error>>): RequestHandler {
  return async function f(req, res) {
    const input: Option<Record<string, unknown>> = mergeNoOverlap(req.params, req.query, req.body);
    
    if (input._tag == 'None') return res.status(400).send({ message: 'Invalid Request' })
    
    const result = await func(input.value as T)
    return handleResult(result, res)
  };
}

function handleResult<R>(result: Result<HttpResponse<R>, Error>, res: Response) {
  if (result.isErr) {
    const error = result.error;
    logger.error(error.message, { req: { body: res.req.body, params: res.req.params, query: res.req.query }, error })
    if (error instanceof ApplicationError) res.status(error.httpStatusCode).send(error)
    return res.status(500).send({ message: error.message })
  }

  const { statusCode, ...response } = result.value
  return res.status(statusCode).send(response)
}