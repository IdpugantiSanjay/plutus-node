import { Audit } from "../common/base.types"
import { NotFoundError } from "../errors/NotFoundError"
import { NotModifiedError } from "../errors/NothingToChangeError"
import { Result } from '@badrap/result'


export type FirstArgument<T extends (...args: any) => any> = Parameters<T>[0]

export type CreateFn = (arg: CreateArg) => Promise<Result<CreateResult>>
export type DeleteFn = (arg: DeleteArg) => Promise<Result<DeleteResult, DeleteError>>
export type UpdateFn = (arg: UpdateArg) => Promise<Result<UpdateResult, UpdateError>>
export type ListFn = (arg: ListArg) => Promise<Result<ListResult>>

export type TransactionStore = {
  create: CreateFn
  delete: DeleteFn
  update: UpdateFn
  list: ListFn
}

export type Transaction = {
  _id: string;
  username: string;
  category: string;
  date: Date | string
  transactionType: number
  amount: number;
  description: string | undefined;
} & Audit


export type Credit = 1
export type Debit = 0
export type TransactionType = Credit | Debit


type UnAuditedTransaction = Omit<Transaction, keyof Audit>;
type TransactionId = Pick<Transaction, '_id'>

export type CreateArg = Omit<UnAuditedTransaction, '_id'>
export type UpdateArg = UnAuditedTransaction
export type DeleteArg = Pick<Transaction, '_id' | 'username'>
export type ListArg = Pick<UnAuditedTransaction, 'username' | 'category'> & { fromDate: string | Date, toDate: string | Date }


export type CreateResult = TransactionId
export type UpdateResult = TransactionId
export type DeleteResult = TransactionId
export type ListResult = Omit<UnAuditedTransaction, 'username'>[]

export type DeleteError = NotModifiedError | NotFoundError
export type UpdateError = NotModifiedError | NotFoundError


// export type HttpResponse<T> = T & { statusCode: number }
export type CreateHttpResponse = HttpResponse<CreateResult>
export type UpdateHttpResponse = HttpResponse<UpdateResult>
export type DeleteHttpResponse = HttpResponse<DeleteResult>
export type ListHttpResponse = HttpResponse<ListResult>


export type HttpResponse<T> = { response: T, statusCode: number }


export type TransactionProps = (keyof UnAuditedTransaction) []



