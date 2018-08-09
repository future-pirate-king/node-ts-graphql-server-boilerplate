import { Redis } from 'ioredis';

export interface ResolverMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: any,
      context: { url: string; redis: Redis },
      info: any
    ) => any;
  };
}
