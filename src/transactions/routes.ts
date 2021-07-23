import { Router } from "express";
import createHandler from "../internal/createRequestHandler";
import { assertCreateRequest, assertDeleteRequest, assertListRequest, assertUpdateRequest } from "./typeguards";

import { store } from "./store";
import { DeleteHttpResponse, UpdateHttpResponse, CreateHttpResponse, UpdateFn, FirstArgument, DeleteFn, CreateFn, ListFn, ListHttpResponse } from "./types";
import withStatus from "../internal/withStatus";
import { HttpStatusCodes } from "../common/StatusCodes";
import { Result } from "@badrap/result";
import createValidator from "../internal/createRequestValidator";


export const router = Router({ mergeParams: true })

async function createTransaction(req: FirstArgument<CreateFn>): Promise<Result<CreateHttpResponse, Error>>  {
  const createResponse = await store.create(req)
  return withStatus(createResponse, HttpStatusCodes.Created)
}

async function deleteTransaction(req: FirstArgument<DeleteFn>): Promise<Result<DeleteHttpResponse, Error>> {
  const response = await store.delete(req);
  return withStatus(response, HttpStatusCodes.Success)
}

async function updateTransaction(req: FirstArgument<UpdateFn>): Promise<Result<UpdateHttpResponse, Error>> {
  const result = await store.update(req);
  return withStatus(result, HttpStatusCodes.Success)
}

async function listTransactions(req: FirstArgument<ListFn>): Promise<Result<ListHttpResponse>> {
  const result = await store.list(req)
  return withStatus(result, HttpStatusCodes.Success)
}

const _createHandler = createHandler(createTransaction)
const deleteHandler = createHandler(deleteTransaction)
const updateHandler = createHandler(updateTransaction)
const listHandler = createHandler(listTransactions)

const _createValidator = createValidator(assertCreateRequest)
const updateValidator = createValidator(assertUpdateRequest)
const deleteValidator = createValidator(assertDeleteRequest)
const listValidator = createValidator(assertListRequest)

router.get('/', listValidator, listHandler)
router.post('', _createValidator, _createHandler)
router.delete('/:_id', deleteValidator, deleteHandler)
router.put('/:_id', updateValidator, updateHandler)