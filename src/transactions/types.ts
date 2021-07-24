import { Audit } from '../common/base.types'
import { Result } from '@badrap/result'

export type FirstArgument<T extends (...args: any) => any> = Parameters<T>[0]

export type Transaction = {
  _id: string
  username: string
  category: string
  date: Date | string
  transactionType: number
  amount: number
  description: string | undefined
} & Audit

export type Credit = 1
export type Debit = 0
export type TransactionType = Credit | Debit

export type RequestHandler<T, R> = {
  validator: (req: unknown) => asserts req is T
  handler: (req: T) => Promise<Result<R, Error>>
}

export type UnAuditedTransaction = Omit<Transaction, keyof Audit>
export type TransactionId = Pick<Transaction, '_id'>
export type HttpResponse<T> = { response: T; statusCode: number }
export type TransactionProps = (keyof UnAuditedTransaction)[]
