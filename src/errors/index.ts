export type UnExpectedError = {
  readonly name: 'UnExpected Error'
  readonly httpStatusCode: 500
  message: string
}

export type NotFoundError = {
  readonly name: 'Not Found'
  readonly httpStatusCode: 404
  message: string
}

export type NotModifiedError = {
  readonly name: 'Not Modified'
  readonly httpStatusCode: 304
  message: string
}

export type PlutusError = NotFoundError | NotModifiedError | UnExpectedError

export function createUnExpectedError(message: string): UnExpectedError {
  return {
    name: 'UnExpected Error',
    httpStatusCode: 500,
    message: message,
  }
}

export function createNotFoundError(message: string): NotFoundError {
  return {
    name: 'Not Found',
    httpStatusCode: 404,
    message: message,
  }
}

export function createNotModifiedError(message: string): NotModifiedError {
  return {
    name: 'Not Modified',
    httpStatusCode: 304,
    message: message,
  }
}
