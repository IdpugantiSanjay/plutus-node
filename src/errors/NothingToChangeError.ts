import { ApplicationError } from "../common/error";

export class NotModifiedError extends ApplicationError {
  override name = 'Not Modified';
  override httpStatusCode = 304;
  override description = undefined;
}


