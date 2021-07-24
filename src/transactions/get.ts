import { ArgPredicates, validators } from './typeguards'
import ow from 'ow'
import { FirstArgument, HttpResponse, RequestHandler, Transaction, UnAuditedTransaction } from './types'
import { Result } from '@badrap/result'
import withStatus from '../internal/withStatus'
import { HttpStatusCodes } from '../common/StatusCodes'
import { store } from './store'
import { NotFoundError, PlutusError } from '../errors'

export type GetFn = (arg: Pick<Transaction, '_id'>) => Promise<Result<UnAuditedTransaction, GetError>>

type GetHttpResponse = HttpResponse<UnAuditedTransaction>
type GetError = NotFoundError
type GetArg = FirstArgument<GetFn>

function assertGetRequest(req: unknown): asserts req is GetArg {
  const shapeObj: ArgPredicates<GetArg> = {
    _id: validators['_id'],
  }
  const shape = ow.object.exactShape(shapeObj)
  ow(req, shape)
}

async function getTransaction(req: GetArg): Promise<Result<GetHttpResponse, PlutusError>> {
  const getResponse = await store.get(req)
  return withStatus(getResponse, HttpStatusCodes.Created)
}

export const requestHandler: RequestHandler<FirstArgument<GetFn>, GetHttpResponse> = {
  handler: getTransaction,
  validator: assertGetRequest,
}

export type GetTransactionInStore = {
  get: GetFn
}
