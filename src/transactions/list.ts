import { validators } from "./typeguards"
import { FirstArgument, ListArg, ListFn, ListHttpResponse, RequestHandler } from "./types"
import ow from 'ow'

import { HttpStatusCodes } from "../common/StatusCodes"
import withStatus from "../internal/withStatus"
import { store } from "./store"
import { Result } from "@badrap/result"


async function listTransactions(req: FirstArgument<ListFn>): Promise<Result<ListHttpResponse>> {
  const result = await store.list(req)
  return withStatus(result, HttpStatusCodes.Success)
}

function assertListRequest(req: unknown): asserts req is ListArg {
  const shape = ow.object.exactShape({ "username": validators['username'] })
  try {
    ow(req, shape)
  } catch (error) {
    console.log('assertListRequest ', error)
    throw error
  }
}


export const requestHandler: RequestHandler<FirstArgument<ListFn>, ListHttpResponse> = {
	handler: listTransactions,
	validator: assertListRequest
}
