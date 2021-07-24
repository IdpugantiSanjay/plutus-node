import { ArgPredicates, validators } from './typeguards'
import { FirstArgument, HttpResponse, RequestHandler, TransactionId, UnAuditedTransaction } from './types'
import ow from 'ow'

import { HttpStatusCodes } from '../common/StatusCodes'
import withStatus from '../internal/withStatus'
import { store } from './store'
import { Result } from '@badrap/result'
import { NotModifiedError } from '../errors/NothingToChangeError'
import { NotFoundError } from '../errors/NotFoundError'

export type UpdateFn = (arg: UpdateArg) => Promise<Result<UpdateResult, UpdateError>>
export type UpdateArg = UnAuditedTransaction
export type UpdateResult = TransactionId
export type UpdateError = NotModifiedError | NotFoundError
export type UpdateHttpResponse = HttpResponse<UpdateResult>

async function updateTransaction(req: FirstArgument<UpdateFn>): Promise<Result<UpdateHttpResponse, Error>> {
  const result = await store.update(req)
  return withStatus(result, HttpStatusCodes.Success)
}

export function assertUpdateRequest(req: unknown): asserts req is UpdateArg {
  const shapeObj: ArgPredicates<UpdateArg> = {
    _id: validators['_id'],
    amount: validators['amount'],
    category: validators['category'],
    date: validators['date'],
    description: validators['description'],
    transactionType: validators['transactionType'],
    username: validators['username'],
  }
  const shape = ow.object.exactShape(shapeObj)
  ow(req, shape)
}

export const requestHandler: RequestHandler<FirstArgument<UpdateFn>, UpdateHttpResponse> = {
  handler: updateTransaction,
  validator: assertUpdateRequest,
}

export type UpdateTransactionInStore = {
  update: UpdateFn
}
