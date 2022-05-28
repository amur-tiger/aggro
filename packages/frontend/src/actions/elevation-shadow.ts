export function elevationShadow(node: HTMLElement, elevation: number) {
  for (let i = 0; i < 6; i++) {
    node.classList.toggle(`elevation-shadow-${i}`, elevation === i);
  }
}
