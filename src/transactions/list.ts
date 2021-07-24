import { validators } from './typeguards'
import { FirstArgument, HttpResponse, RequestHandler, UnAuditedTransaction } from './types'
import ow from 'ow'

import { HttpStatusCodes } from '../common/StatusCodes'
import withStatus from '../internal/withStatus'
import { store } from './store'
import { Result } from '@badrap/result'
import { PlutusError } from '../errors'

export type ListFn = (arg: ListArg) => Promise<Result<ListResult, PlutusError>>

type ListHttpResponse = HttpResponse<ListResult>
type ListResult = Omit<UnAuditedTransaction, 'username'>[]
type ListArg = Pick<UnAuditedTransaction, 'username' | 'category'> & {
  fromDate: string | Date
  toDate: string | Date
}

async function listTransactions(req: FirstArgument<ListFn>): Promise<Result<ListHttpResponse, PlutusError>> {
  const result = await store.list(req)
  return withStatus(result, HttpStatusCodes.Success)
}

function assertListRequest(req: unknown): asserts req is ListArg {
  const shape = ow.object.exactShape({ username: validators['username'] })
  try {
    ow(req, shape)
  } catch (error) {
    console.log('assertListRequest ', error)
    throw error
  }
}

export const requestHandler: RequestHandler<FirstArgument<ListFn>, ListHttpResponse> = {
  handler: listTransactions,
  validator: assertListRequest,
}

export type ListTransactionInStore = {
  list: ListFn
}
