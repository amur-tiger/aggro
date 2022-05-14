const metadataKey = Symbol("Public");

export interface PublicMetadata {
  public: Set<string | symbol>;
}

export function Public(): MethodDecorator {
  return (target, propertyKey) => {
    const metadata: PublicMetadata = Reflect.getOwnMetadata(
      metadataKey,
      target
    ) ?? { public: new Set() };
    metadata.public.add(propertyKey);
    Reflect.defineMetadata(metadataKey, metadata, target);
  };
}

Public.isPublic = function (target: Function, method: string): boolean {
  const metadata: PublicMetadata | undefined = Reflect.getOwnMetadata(
    metadataKey,
    target.prototype
  );
  return !!(metadata && metadata.public.has(method));
};
