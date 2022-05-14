const metadataKey = Symbol("Route");

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface RouteOptions {
  method?: Method;
  pattern?: string;
}

export interface RouteMetadata {
  routes: Record<string | symbol, { method: Method; pattern: string }>;
}

export function Route(): MethodDecorator;
export function Route(pattern: string): MethodDecorator;
export function Route(options: RouteOptions): MethodDecorator;

export function Route(
  patternOrOptions?: string | RouteOptions
): MethodDecorator {
  return (target, propertyKey) => {
    const method =
      (patternOrOptions != null && typeof patternOrOptions === "object"
        ? patternOrOptions.method
        : "GET") ?? "GET";
    const pattern =
      (patternOrOptions != null && typeof patternOrOptions === "object"
        ? patternOrOptions.pattern
        : patternOrOptions) ?? propertyKey;
    if (typeof pattern === "symbol") {
      throw new TypeError("A symbol cannot be used as a route name.");
    }

    const metadata: RouteMetadata = Reflect.getOwnMetadata(
      metadataKey,
      target
    ) ?? { routes: {} };
    metadata.routes[propertyKey] = { method, pattern };
    Reflect.defineMetadata(metadataKey, metadata, target);
  };
}

Route.get = (target: Function): RouteMetadata | undefined => {
  return Reflect.getOwnMetadata(metadataKey, target.prototype);
};
