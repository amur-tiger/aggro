import { createSignal } from "solid-js";

const [locationValue, setLocation] = createSignal(window.location.pathname);
export const location = locationValue;

const originalPushState = history.pushState;
history.pushState = function (...args) {
  const result = originalPushState.apply(this, args);
  setLocation(window.location.pathname);
  return result;
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
  const result = originalReplaceState.apply(this, args);
  setLocation(window.location.pathname);
  return result;
};

window.addEventListener("popstate", (e) => setLocation((e.target as Window).location.pathname));

export function navigate(pathname: string, options?: Partial<{ replace?: boolean }>) {
  if (options?.replace ?? false) {
    history.replaceState("", "", pathname);
  } else {
    history.pushState("", "", pathname);
  }
}
