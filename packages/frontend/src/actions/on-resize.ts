export function onResize(
  node: HTMLElement,
  callback: (rect: DOMRectReadOnly) => void
) {
  const observer = new ResizeObserver((elements) => {
    const item = elements.find((element) => element.target === node);
    if (item) {
      callback(item.contentRect);
    }
  });

  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    },
  };
}
