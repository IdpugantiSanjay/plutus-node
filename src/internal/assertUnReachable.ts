export function assertUnReachable(x: never): never {
  throw new Error('Unreachable path reached ' + x)
}
