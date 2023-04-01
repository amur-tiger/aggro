import type { Factory } from "./factory";

export interface CacheItem<T = unknown> {
  isInitialized: boolean;
  isConstructing: boolean;
  instance?: T;
  factory?: Factory<T>;
}
