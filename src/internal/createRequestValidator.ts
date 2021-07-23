import { RequestHandler } from "express";
import { Option } from "fp-ts/lib/Option";
import mergeNoOverlap from "./mergeNoOverlap";

export default function createRequestValidator<T>(validator: (req: T) => asserts req is T): RequestHandler  {
  return function (req, res, next) {
    const input: Option<Record<string, unknown>> = mergeNoOverlap(req.params, req.query, req.body);
    try {
      if (input._tag == 'Some') { 
        validator(input.value as T) 
        next()
      }
      else {
        throw new Error('Invalid Request')
      }
    } catch (error) {
      console.log(error)
      res.status(400).send(error)      
    }
  }
}