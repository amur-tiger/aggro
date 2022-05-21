import { ClassType } from "type-graphql";
import { NotFoundException } from "./exceptions/not-found-exception";
import { ConstructionException } from "./exceptions/construction-exception";
import type { CacheItem } from "./model/cache-item";
import type { Factory } from "./model/factory";
import { Service } from "./decorators/service";
import { Logger } from "../logger";

export class Container {
  private readonly logger = new Logger(Container);
  private readonly cache = new Map<string, CacheItem>();

  public constructor() {
    this.setInstance(Container, this);
  }

  public get<T>(key: ClassType<T>): T;
  public get<T = unknown>(key: string): T;

  public get(key: string | ClassType): unknown {
    const strKey = typeof key === "string" ? key : key.name;
    const item = this.cache.get(strKey);

    if (!item) {
      if (typeof key === "string") {
        throw new NotFoundException(
          `Item "${strKey}" is not in the container.`
        );
      }

      const metadata = Service.get(key);
      if (!metadata) {
        throw new NotFoundException(
          `Item "${strKey}" is not in the container. Apply @Service() if it should be.`
        );
      }

      try {
        const args = metadata.args;
        const factory: Factory = (container) =>
          new key(...args.map((arg: any) => container.get(arg)));
        const instance = factory(this);

        this.cache.set(strKey, {
          isInitialized: true,
          isConstructing: false,
          instance,
          factory,
        });

        return instance;
      } catch (e) {
        this.logger.error(`While constructing "${strKey}": ${(e instanceof Error) ? e.message : e}`);
        throw e;
      }
    }

    if (!item.isInitialized) {
      if (!item.factory) {
        throw new ConstructionException(
          `Cannot construct "${strKey}": No factory available.`
        );
      }
      item.instance = item.factory(this);
      item.isInitialized = true;
    }

    return item.instance;
  }

  public set<T>(key: ClassType<T>, factory: Factory<T>): void;
  public set(key: string, factory: Factory): void;

  public set(key: string | ClassType, factory: Factory): void {
    if (typeof key !== "string") {
      key = key.name;
    }
    this.cache.set(key, {
      isInitialized: false,
      isConstructing: false,
      factory,
    });
  }

  public setInstance<T>(key: ClassType<T>, instance: T): void;
  public setInstance(key: string, instance: unknown): void;

  public setInstance(key: string | ClassType, instance: unknown): void {
    if (typeof key !== "string") {
      key = key.name;
    }
    this.cache.set(key, {
      isInitialized: true,
      isConstructing: false,
      instance,
    });
  }
}
