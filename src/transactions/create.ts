import { ArgPredicates, validators } from './typeguards'
import { FirstArgument, HttpResponse, RequestHandler, TransactionId, UnAuditedTransaction } from './types'
import ow from 'ow'

import { HttpStatusCodes } from '../common/StatusCodes'
import withStatus from '../internal/withStatus'
import { store } from './store'
import { Result } from '@badrap/result'

export type CreateResult = TransactionId
export type CreateArg = Omit<UnAuditedTransaction, '_id'>
export type CreateFn = (arg: CreateArg) => Promise<Result<CreateResult>>
export type CreateHttpResponse = HttpResponse<CreateResult>

function assertCreateRequest(req: unknown): asserts req is CreateArg {
  const shapeObj: ArgPredicates<CreateArg> = {
    amount: validators.amount,
    category: validators.category,
    date: validators.date,
    description: validators.description,
    transactionType: validators.transactionType,
    username: validators.username,
  }
  const shape = ow.object.exactShape(shapeObj)
  ow(req, shape)
}

async function createTransaction(req: FirstArgument<CreateFn>): Promise<Result<CreateHttpResponse, Error>> {
  const createResponse = await store.create(req)
  return withStatus(createResponse, HttpStatusCodes.Created)
}

export const requestHandler: RequestHandler<FirstArgument<CreateFn>, CreateHttpResponse> = {
  handler: createTransaction,
  validator: assertCreateRequest,
}

export type CreateTransactionInStore = {
  create: CreateFn
}
