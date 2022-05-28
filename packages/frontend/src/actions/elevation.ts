import { getContext, setContext } from "svelte";

const key = Symbol("elevation");

export function getCurrentElevation(): number {
  return getContext(key) ?? 0;
}

export function setCurrentElevation(elevation: number): void {
  setContext(key, elevation);
}
