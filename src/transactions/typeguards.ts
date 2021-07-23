import { CreateArg, DeleteArg, ListArg, UpdateArg } from "./types";
import ow, { Predicate } from 'ow'

type Args = CreateArg & UpdateArg & DeleteArg
type Validators<T> = { [K in keyof T]: Predicate<T[K]> }
type ArgPredicates<Arg> = { [K in keyof Arg]: Predicate<Arg[K]> }

const validators: Validators<Args> = {
  '_id': ow.string.maxLength(32),
  'amount': ow.number.greaterThan(0).lessThan(1_000_000),
  'category': ow.string.maxLength(64),
  'date': ow.string.date,
  'description': ow.string.maxLength(1024),
  'transactionType': ow.number.greaterThan(-1).lessThan(2),
  'username': ow.string.maxLength(32)
} as const

export function assertCreateRequest(req: Record<string, unknown>): asserts req is CreateArg {
  const shapeObj: ArgPredicates<CreateArg> = {
    'amount': validators.amount,
    'category': validators.category,
    'date': validators.date,
    'description': validators.description,
    'transactionType': validators.transactionType,
    'username': validators.username,
  }
  const shape = ow.object.exactShape(shapeObj)
  ow(req, shape)
} 


export function assertDeleteRequest(req: Record<string, unknown>): asserts req is DeleteArg { 
  const shapeObj: ArgPredicates<DeleteArg> = {
    '_id': validators['_id'],
    'username': validators['username']
  }
  const shape = ow.object.exactShape(shapeObj)
  ow(req, shape)
}

export function assertUpdateRequest(req: Record<string, unknown>): asserts req is UpdateArg {
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


export function assertListRequest(req: Record<string, unknown>): asserts req is ListArg {
  const shape = ow.object.exactShape({ "username": validators['username'] })
  try {
    ow(req, shape)
  } catch (error) {
    console.log('assertListRequest ', error)
    throw error
  }
}