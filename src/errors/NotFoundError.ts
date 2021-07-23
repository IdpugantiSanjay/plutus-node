import { ApplicationError } from "../common/error";

export class NotFoundError extends ApplicationError {
  override name = 'Not Found';
  override httpStatusCode = 404;
  constructor(public description: string) {
    super();
  }
}
