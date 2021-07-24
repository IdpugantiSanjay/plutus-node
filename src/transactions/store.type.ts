import { CreateTransactionInStore } from './create'
import { DeleteTransactionInStore } from './delete'
import { GetTransactionInStore } from './get'
import { ListTransactionInStore } from './list'
import { UpdateTransactionInStore } from './update'

export type ITransactionStore = CreateTransactionInStore &
  GetTransactionInStore &
  UpdateTransactionInStore &
  DeleteTransactionInStore &
  ListTransactionInStore
