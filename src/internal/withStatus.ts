import { HttpResponse } from '../transactions/types'
import { HttpStatusCodes } from '../common/StatusCodes'
import { Result } from '@badrap/result'
import { PlutusError } from '../errors'

const { ok, err } = Result

export default function withStatus<T>(resp: Result<T, PlutusError>, httpStatusCode: HttpStatusCodes): Result<HttpResponse<T>, PlutusError> {
  if (resp.isOk) {
    return ok({ response: resp.value, statusCode: httpStatusCode })
  }
  return err(resp.error)
}
