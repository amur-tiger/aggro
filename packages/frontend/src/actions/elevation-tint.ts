export function elevationTint(node: HTMLElement, elevation: number) {
  for (let i = 0; i < 6; i++) {
    node.classList.toggle(`elevation-tint-${i}`, elevation === i);
  }
}
