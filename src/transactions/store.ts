import type { Client as NewTypes } from '@elastic/elasticsearch/api/new'
import { ApiResponse } from '@elastic/elasticsearch/lib/Transport'
import { CreateArg, Transaction, UpdateArg, TransactionStore, UpdateFn, DeleteFn, CreateFn, ListFn, ListArg, TransactionProps } from './types'
import { Client, estypes } from '@elastic/elasticsearch'

import { NotModifiedError } from '../errors/NothingToChangeError'
import { NotFoundError } from '../errors/NotFoundError'
import throwUnExpectedError from '../internal/throwUnExpectedError'
import { Result } from '@badrap/result'
import { transformHits } from './lib'


const { ok, err } = Result;


const INDEX = 'transactions'

// @ts-expect-error @elastic/elasticsearch
const client: NewTypes = new Client({
  node: process.env['ELASTIC_SEARCH_URL']
})

const create: CreateFn = async (transaction) => {
  const response = await client.index<CreateArg>({ index: INDEX, body: transaction });
  switch (response.body.result) {
    case 'created': return ok({ _id: response.body._id })
  }

  throwUnExpectedError();
}


const _delete: DeleteFn = async (transaction) => {
  const response = await client.delete({ index: INDEX, id: transaction._id })

  switch (response.body.result) {
    case 'deleted': return ok({ _id: response.body._id })
    case 'noop': return err(new NotModifiedError)
    case 'not_found': return err(new NotFoundError(`${transaction._id} Not Found`))
  }

  throwUnExpectedError();
}


const update: UpdateFn = async (transaction: UpdateArg): ReturnType<UpdateFn> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, username, ...updateProps } = transaction;

  const response = await client.update({ index: INDEX, id: transaction._id, body: { doc: updateProps } })
  switch (response.body.result) {
    case 'updated': return ok({ _id: response.body._id })
    case 'noop': return err(new NotModifiedError())
    case 'not_found': return err(new NotFoundError(`${transaction._id} Not Found`))
  }

  throwUnExpectedError();
}

const list: ListFn = async (arg: ListArg): ReturnType<ListFn> => {
  try {
    const response = await client.search<Transaction>({
      index: INDEX,
      _source_includes: ['_id', 'amount', 'category', 'date', 'description', 'transactionType', 'username'] as TransactionProps,
      body: {
        query: {
          bool: {
            must: [
              { term: { username: arg.username } },
              // { match: { category: arg.category } }
            ]
          }
        }
      }
    })
    return ok(transformHits(response.body.hits.hits));
  } catch (error) {
    console.log(error)
    throw error;
  }
}






export async function createTransactionIndex(client: NewTypes): Promise<ApiResponse<estypes.CreateIndexResponse, unknown>> {
  const properties: { [key in keyof Omit<Transaction, '_id'>]: estypes.Property } = {
    username: {
      type: 'keyword'
    },
    category: {
      type: 'keyword'
    },
    date: {
      type: 'date'
    },
    transactionType: {
      type: 'byte'
    },
    description: {
      type: 'text'
    },
    amount: {
      type: 'double'
    },
    updatedAt: {
      type: 'date',
      index: false
    },
    createdAt: {
      type: 'date',
      index: false
    }
  }

  return client.indices.create({
    index: INDEX,
    body: {
      mappings: {
        properties
      }
    }
  }, { ignore: [400] })
}




export const store: TransactionStore = {
  delete: _delete,
  create, update, list
} as const