import { HttpResponse } from "../transactions/types";
import { HttpStatusCodes } from "../common/StatusCodes";
import { Result } from "@badrap/result";


const { ok, err } = Result; 

export default function withStatus<T>(resp: Result<T, Error>, httpStatusCode: HttpStatusCodes): Result<HttpResponse<T>, Error> {
  if (resp.isOk) {
    return ok({ response: resp.value, statusCode: httpStatusCode })
  }
  return err(resp.error)
}