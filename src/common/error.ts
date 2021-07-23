import { IApplicationError } from "./types";

export abstract class ApplicationError extends Error implements IApplicationError  {
  abstract override name: string;
  abstract httpStatusCode: number;
  abstract description: string | undefined = 'Internal Server Error';
}