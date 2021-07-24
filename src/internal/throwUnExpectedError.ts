import { createUnExpectedError } from '../errors'

export default function throwUnExpectedError(): never {
  throw createUnExpectedError('Unexpected Error Occured')
}
