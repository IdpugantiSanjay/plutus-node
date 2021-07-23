import { CreateArg, DeleteArg, UpdateArg } from "./types";
import ow, { Predicate } from 'ow'

export type Args = CreateArg & UpdateArg & DeleteArg
export type Validators<T> = { [K in keyof T]: Predicate<T[K]> }
export type ArgPredicates<Arg> = { [K in keyof Arg]: Predicate<Arg[K]> }

export const validators: Validators<Args> = {
  '_id': ow.string.maxLength(32),
  'amount': ow.number.greaterThan(0).lessThan(1_000_000),
  'category': ow.string.maxLength(64),
  'date': ow.string.date,
  'description': ow.string.maxLength(1024),
  'transactionType': ow.number.greaterThan(-1).lessThan(2),
  'username': ow.string.maxLength(32)
} as const
