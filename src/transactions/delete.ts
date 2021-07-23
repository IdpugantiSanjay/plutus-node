import { ArgPredicates, validators } from "./typeguards"
import { DeleteArg, DeleteFn, DeleteHttpResponse, FirstArgument, RequestHandler, UpdateFn, UpdateHttpResponse } from "./types"
import ow from 'ow'

import { HttpStatusCodes } from "../common/StatusCodes"
import withStatus from "../internal/withStatus"
import { store } from "./store"
import { Result } from "@badrap/result"


function assertDeleteRequest(req: unknown): asserts req is DeleteArg { 
  const shapeObj: ArgPredicates<DeleteArg> = {
    '_id': validators['_id'],
    'username': validators['username']
  }
  const shape = ow.object.exactShape(shapeObj)
  ow(req, shape)
}

async function deleteTransaction(req: FirstArgument<DeleteFn>): Promise<Result<DeleteHttpResponse, Error>> {
  const response = await store.delete(req);
  return withStatus(response, HttpStatusCodes.Success)
}


export const requestHandler: RequestHandler<FirstArgument<UpdateFn>, UpdateHttpResponse> = {
	handler: deleteTransaction,
	validator: assertDeleteRequest
}
