import { ApplicationError } from "../common/error";

export class UnExpectedError extends ApplicationError {
  name = 'UnExpected Error';
  httpStatusCode = 500;
  description: string | undefined;
}