export type ShapeKey =
  | "none"
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large"
  | "full";

export function shape(node: HTMLElement, s: ShapeKey) {
  for (const item of [
    "none",
    "extra-small",
    "small",
    "medium",
    "large",
    "extra-large",
    "full",
  ]) {
    node.classList.toggle(`shape-${item}`, s === item);
  }
}
