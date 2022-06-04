export interface SortFunction<T> {
  (a: T, b: T): number;
}

export function byProp<T extends {}>(prop: keyof T): SortFunction<T>;
export function byProp<T extends {}, K extends keyof T>(
  prop: keyof T,
  fn: SortFunction<T[K]>
): SortFunction<T>;

export function byProp<T extends {}, K extends keyof T>(
  prop: K,
  fn?: SortFunction<T[K]>
): SortFunction<T> {
  const sortFn = fn ?? defaultCompare;

  return (a, b) => sortFn(a[prop], b[prop]);
}

function defaultCompare<T>(x: T, y: T): number {
  //INFO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  //ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-sortcompare

  if (x === undefined && y === undefined) {
    return 0;
  }

  if (x === undefined) {
    return 1;
  }

  if (y === undefined) {
    return -1;
  }

  const xString = toString(x);
  const yString = toString(y);

  if (xString < yString) {
    return -1;
  }

  if (xString > yString) {
    return 1;
  }

  return 0;
}

function toString(obj: unknown): string {
  //ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-tostring

  if (obj === undefined) {
    return "undefined";
  }

  if (obj === null) {
    return "null";
  }

  if (typeof obj === "boolean" || typeof obj === "number") {
    return obj.toString();
  }

  if (typeof obj === "string") {
    return obj;
  }

  if (typeof obj === "symbol") {
    throw new TypeError();
  }

  return (obj as object).toString();
}
