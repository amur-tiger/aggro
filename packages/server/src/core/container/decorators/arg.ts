const metadataKey = Symbol("Arg");

export interface ArgMetadata {
  args: Record<number, string | undefined>;
}

export function Arg(name: string): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const metadata: ArgMetadata = Reflect.getOwnMetadata(metadataKey, target) ?? { args: {} };
    metadata.args[parameterIndex] = name;
    Reflect.defineMetadata(metadataKey, metadata, target);
  };
}

Arg.getArgNames = function (target: Function): Record<number, string | undefined> {
  const metadata: ArgMetadata = Reflect.getOwnMetadata(metadataKey, target) ?? { args: {} };
  return metadata.args;
};
