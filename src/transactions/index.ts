import { Router } from 'express'


import { requestHandler as _createHandler } from './create'
import { requestHandler as updateHandler } from './update'
import { requestHandler as deleteHandler } from './delete'
import { requestHandler as listHandler } from './list'

import createValidator from '../internal/createRequestValidator'
import createHandler from '../internal/createRequestHandler'

const create = [createValidator(_createHandler.validator), createHandler(_createHandler.handler)]
const list = [createValidator(listHandler.validator), createHandler(listHandler.handler)]
const update = [createValidator(updateHandler.validator), createHandler(updateHandler.handler)]
const _delete = [createValidator(deleteHandler.validator), createHandler(deleteHandler.handler)]



export const transactionRouter = Router({ mergeParams: true })

transactionRouter.get('/', ...create)
transactionRouter.post('', ...list)
transactionRouter.delete('/:_id', ...update)
transactionRouter.put('/:_id', ..._delete)