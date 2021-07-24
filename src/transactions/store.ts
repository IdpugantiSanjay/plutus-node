import type { Client as NewTypes } from '@elastic/elasticsearch/api/new'
import { ApiResponse } from '@elastic/elasticsearch/lib/Transport'
import { Transaction, TransactionProps, UnAuditedTransaction, FirstArgument } from './types'
import { Client, estypes } from '@elastic/elasticsearch'

import throwUnExpectedError from '../internal/throwUnExpectedError'
import { Result } from '@badrap/result'
import { transformHits } from './lib'
import { ITransactionStore } from './store.type'
import { GetFn } from './get'
import { CreateFn } from './create'
import { ListFn } from './list'
import { DeleteFn } from './delete'
import { UpdateFn } from './update'
import { createNotFoundError, createNotModifiedError } from '../errors'

const { ok, err } = Result

const INDEX = 'transactions'

// @ts-expect-error @elastic/elasticsearch
const client: NewTypes = new Client({
  node: process.env['ELASTIC_SEARCH_URL'],
})

const create: CreateFn = async (transaction) => {
  const response = await client.index<FirstArgument<CreateFn>>({ index: INDEX, body: transaction })
  switch (response.body.result) {
    case 'created':
      return ok({ _id: response.body._id })
  }

  throwUnExpectedError()
}

const _delete: DeleteFn = async (transaction) => {
  const response = await client.delete({ index: INDEX, id: transaction._id })

  switch (response.body.result) {
    case 'deleted':
      return ok({ _id: response.body._id })
    case 'noop':
      return err(createNotModifiedError(`Transaction with id ${transaction._id} is not modified`))
    case 'not_found':
      return err(createNotFoundError(`Transaction with id ${transaction._id} Not Found`))
  }

  throwUnExpectedError()
}

const update: UpdateFn = async (transaction) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, username, ...updateProps } = transaction

  const response = await client.update({ index: INDEX, id: transaction._id, body: { doc: updateProps } })
  switch (response.body.result) {
    case 'updated':
      return ok({ _id: response.body._id })
    case 'noop':
      return err(createNotModifiedError(`Transaction with id ${transaction._id} is not modified`))
    case 'not_found':
      return err(createNotFoundError(`Transaction with id ${transaction._id} Not Found`))
  }

  throwUnExpectedError()
}

const list: ListFn = async (arg) => {
  const response = await client.search<Transaction>({
    index: INDEX,
    _source_includes: ['_id', 'amount', 'category', 'date', 'description', 'transactionType', 'username'] as TransactionProps,
    body: {
      query: {
        bool: {
          must: [
            { term: { username: arg.username } },
            // { match: { category: arg.category ||  } }
          ],
        },
      },
    },
  })
  return ok(transformHits(response.body.hits.hits))
}

const get: GetFn = async (arg) => {
  const response = await client.get<UnAuditedTransaction>({
    _source_includes: ['_id', 'amount', 'category', 'date', 'description', 'transactionType'],
    index: INDEX,
    id: arg._id,
  })

  if (!response.body.found) return err(createNotFoundError(`${arg._id} not found`))
  if (response.body._source) return ok(response.body._source)

  throw new Error()
}

export async function createTransactionIndex(client: NewTypes): Promise<ApiResponse<estypes.CreateIndexResponse, unknown>> {
  const properties: { [key in keyof Omit<Transaction, '_id'>]: estypes.Property } = {
    username: {
      type: 'keyword',
    },
    category: {
      type: 'keyword',
    },
    date: {
      type: 'date',
    },
    transactionType: {
      type: 'byte',
    },
    description: {
      type: 'text',
    },
    amount: {
      type: 'double',
    },
    updatedAt: {
      type: 'date',
      index: false,
    },
    createdAt: {
      type: 'date',
      index: false,
    },
  }

  return client.indices.create(
    {
      index: INDEX,
      body: {
        mappings: {
          properties,
        },
      },
    },
    { ignore: [400] },
  )
}

export const store: ITransactionStore = {
  delete: _delete,
  create,
  update,
  list,
  get,
} as const
