import { ArgPredicates, validators } from './typeguards'
import { FirstArgument, HttpResponse, RequestHandler, Transaction, TransactionId } from './types'
import ow from 'ow'

import { HttpStatusCodes } from '../common/StatusCodes'
import withStatus from '../internal/withStatus'
import { store } from './store'
import { Result } from '@badrap/result'
import { NotFoundError, NotModifiedError, PlutusError } from '../errors'

export type DeleteFn = (arg: DeleteArg) => Promise<Result<DeleteResult, DeleteError>>

type DeleteArg = Pick<Transaction, '_id' | 'username'>
type DeleteResult = TransactionId
type DeleteHttpResponse = HttpResponse<DeleteResult>
type DeleteError = NotModifiedError | NotFoundError

function assertDeleteRequest(req: unknown): asserts req is DeleteArg {
  const shapeObj: ArgPredicates<DeleteArg> = {
    _id: validators['_id'],
    username: validators['username'],
  }
  const shape = ow.object.exactShape(shapeObj)
  ow(req, shape)
}

async function deleteTransaction(req: FirstArgument<DeleteFn>): Promise<Result<DeleteHttpResponse, PlutusError>> {
  const response = await store.delete(req)
  return withStatus(response, HttpStatusCodes.Success)
}

export const requestHandler: RequestHandler<FirstArgument<DeleteFn>, DeleteHttpResponse> = {
  handler: deleteTransaction,
  validator: assertDeleteRequest,
}

export type DeleteTransactionInStore = {
  delete: DeleteFn
}
