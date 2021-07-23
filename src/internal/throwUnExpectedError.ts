import { UnExpectedError } from "../errors/UnExpectedError";

export default function throwUnExpectedError(): never {
  throw new UnExpectedError
}