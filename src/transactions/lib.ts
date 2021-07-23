import { Hit } from "@elastic/elasticsearch/api/types";

export function transformHits<T>(hits: Hit<T>[]): T[] {
  return hits.filter(h => !!h._source).map(h => h._source) as T[];
}
