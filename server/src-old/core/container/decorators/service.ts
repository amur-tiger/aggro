const metadataKey = Symbol("Service");

export interface ServiceMetadata {
  args: any[];
}

export function Service(): ClassDecorator {
  return (target) => {
    let args = Reflect.getMetadata("design:paramtypes", target);

    let proto: object | null = target;
    while (!args) {
      proto = Reflect.getPrototypeOf(proto);
      if (!proto) {
        break;
      }
      args = Reflect.getMetadata("design:paramtypes", proto);
    }

    if (!args) {
      throw new TypeError(
        `Unable to determine constructor arguments for "${target.name}". All super-classes must also have the @Service() attribute and at least one constructor must be defined.`
      );
    }

    const metadata: ServiceMetadata = { args };
    Reflect.defineMetadata(metadataKey, metadata, target);
  };
}

Service.get = (target: Function): ServiceMetadata | undefined => {
  return Reflect.getOwnMetadata(metadataKey, target);
};
