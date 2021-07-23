import { ArgPredicates, validators } from "./typeguards"
import { FirstArgument, RequestHandler, UpdateArg, UpdateFn, UpdateHttpResponse } from "./types"
import ow from 'ow'

import { HttpStatusCodes } from "../common/StatusCodes"
import withStatus from "../internal/withStatus"
import { store } from "./store"
import { Result } from "@badrap/result"

async function updateTransaction(req: FirstArgument<UpdateFn>): Promise<Result<UpdateHttpResponse, Error>> {
  const result = await store.update(req);
  return withStatus(result, HttpStatusCodes.Success)
}


export function assertUpdateRequest(req: unknown): asserts req is UpdateArg {
  const shapeObj: ArgPredicates<UpdateArg> = {
    '_id': validators['_id'],
    'amount': validators['amount'],
    'category': validators['category'],
    'date': validators['date'],
    'description': validators['description'],
    'transactionType': validators['transactionType'],
    'username': validators['username']
  }
  const shape = ow.object.exactShape(shapeObj)
  ow(req, shape)
}

export const requestHandler: RequestHandler<FirstArgument<UpdateFn>, UpdateHttpResponse> = {
	handler: updateTransaction,
	validator: assertUpdateRequest
}
