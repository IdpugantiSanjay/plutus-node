import { Option, none, some } from "fp-ts/lib/Option";

export default function mergeNoOverlap(...args: Record<string, unknown>[]): Option<Record<string, unknown>> {
  const keys = args.filter(a => !!a).flatMap(arg => Object.keys(arg).map(a => a.toLowerCase()))
  const uniqueKeys = new Set( keys )

  if (keys.length != uniqueKeys.size) return none;

  let merged = {}
  for (const arg of args.filter(a => !!a)) {
    merged = { ...merged, ...arg }
  }
  return some(merged)
}

